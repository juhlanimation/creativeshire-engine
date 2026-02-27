/**
 * Import a Figma Make / React project into the Creativeshire engine as a preset.
 *
 * Analyzes a Figma Make React project's structure (Layout, pages, sections),
 * generates engine section patterns using ReactSection passthrough, creates
 * chrome wrappers, and assembles a preset.
 *
 * Usage:
 *   npm run import:react -- --input ./path-to-figma-export/src --preset ClientSite
 *   npm run import:react -- --input ./path-to-figma-export/src --preset ClientSite --pages home,about
 *   npm run import:react -- --input ./path-to-figma-export/src --preset ClientSite --dry-run
 */

import fs from 'fs'
import path from 'path'
import { parseArgs } from 'util'

// =============================================================================
// CLI Parsing
// =============================================================================

const { values } = parseArgs({
  options: {
    input: { type: 'string', short: 'i' },
    preset: { type: 'string', short: 'p' },
    pages: { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
  strict: true,
  allowPositionals: false,
})

const inputDir = values.input
const presetName = values.preset
const dryRun = values['dry-run'] ?? false
const explicitPages = values.pages?.split(',').map((p) => p.trim())

if (values.help || !inputDir || !presetName) {
  console.error('Usage: npm run import:react -- --input <src-dir> --preset <PresetName>')
  console.error('')
  console.error('Required:')
  console.error('  --input, -i   Path to Figma Make project src/ directory')
  console.error('  --preset, -p  Name for the preset (PascalCase, e.g. ClientSite)')
  console.error('')
  console.error('Optional:')
  console.error('  --pages       Comma-separated page names (default: auto-detect)')
  console.error('  --dry-run     Print plan without writing files')
  process.exit(1)
}

if (!/^[A-Z][a-zA-Z0-9]+$/.test(presetName)) {
  console.error(`Error: Preset name "${presetName}" must be PascalCase (e.g. ClientSite)`)
  process.exit(1)
}

const inputPath = path.resolve(inputDir)
if (!fs.existsSync(inputPath)) {
  console.error(`Error: Input directory not found: ${inputPath}`)
  process.exit(1)
}

// =============================================================================
// Naming Helpers
// =============================================================================

function toKebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function toDisplay(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
}

function toCamel(name: string): string {
  return name.charAt(0).toLowerCase() + name.slice(1)
}

/** Ensure PascalCase — if already PascalCase, return as-is */
function toPascal(name: string): string {
  // Already PascalCase
  if (/^[A-Z][a-zA-Z0-9]*$/.test(name)) return name
  // kebab-case or snake_case
  return name
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}

/**
 * Derive a PascalCase section name from a component name.
 * Strips common suffixes like "Section", "Component", "Page".
 */
function toSectionName(componentName: string): string {
  const pascal = toPascal(componentName)
  // Don't strip if it would leave nothing
  const stripped = pascal.replace(/(Section|Component|Page)$/, '')
  return stripped || pascal
}

// =============================================================================
// Constants
// =============================================================================

const ROOT = process.cwd()
const ENGINE = path.join(ROOT, 'engine')
const SECTIONS_DIR = path.join(ENGINE, 'content/sections/patterns')
const SECTION_REGISTRY = path.join(ENGINE, 'content/sections/registry.ts')
const CHROME_REGISTRY = path.join(ENGINE, 'content/chrome/pattern-registry.ts')
const CHROME_PATTERNS_DIR = path.join(ENGINE, 'content/chrome/patterns')
const STYLES_CSS = path.join(ENGINE, 'styles.css')
const PRESETS_DIR = path.join(ENGINE, 'presets')
const PRESETS_INDEX = path.join(ENGINE, 'presets/index.ts')

const presetKebab = toKebab(presetName)
const presetCamel = toCamel(presetName)
const presetDisplay = toDisplay(presetName)

// =============================================================================
// File Reading Helpers
// =============================================================================

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8')
}

function findFiles(dir: string, ext: string): string[] {
  const results: string[] = []
  if (!fs.existsSync(dir)) return results
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findFiles(full, ext))
    } else if (entry.name.endsWith(ext)) {
      results.push(full)
    }
  }
  return results
}

// =============================================================================
// Stage 1: Analyze
// =============================================================================

interface ComponentRef {
  componentName: string
  filePath: string
}

interface PageInfo {
  name: string
  filePath: string
  sections: ComponentRef[]
}

interface SiteMap {
  chrome: {
    header?: ComponentRef
    footer?: ComponentRef
  }
  pages: PageInfo[]
  /** All component files referenced (for dependency analysis) */
  componentFiles: Map<string, string>
}

function log(msg: string): void {
  console.log(msg)
}

function logSection(title: string): void {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`  ${title}`)
  console.log('='.repeat(60))
}

/**
 * Find all .tsx and .jsx files in the input directory, build a map of
 * component name -> file path.
 */
function buildComponentMap(srcDir: string): Map<string, string> {
  const map = new Map<string, string>()
  const files = [
    ...findFiles(srcDir, '.tsx'),
    ...findFiles(srcDir, '.jsx'),
  ]
  for (const file of files) {
    const basename = path.basename(file, path.extname(file))
    // Skip index files — they usually re-export
    if (basename === 'index') continue
    // Skip test files
    if (basename.includes('.test') || basename.includes('.spec')) continue
    map.set(basename, file)
  }
  return map
}

/**
 * Extract imported component names from a file.
 * Looks for: import { X, Y } from '...' and import X from '...'
 * Returns map of componentName -> importPath
 */
function extractImports(source: string): Map<string, string> {
  const imports = new Map<string, string>()

  // Named imports: import { X, Y as Z } from '...'
  const namedRe = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g
  let match: RegExpExecArray | null
  while ((match = namedRe.exec(source)) !== null) {
    const names = match[1].split(',').map((n) => n.trim())
    const importPath = match[2]
    for (const name of names) {
      // Handle "X as Y" — we want the local name (Y)
      const parts = name.split(/\s+as\s+/)
      const localName = (parts[1] || parts[0]).trim()
      if (localName && /^[A-Z]/.test(localName)) {
        imports.set(localName, importPath)
      }
    }
  }

  // Default imports: import X from '...'
  const defaultRe = /import\s+([A-Z][a-zA-Z0-9]*)\s+from\s+['"]([^'"]+)['"]/g
  while ((match = defaultRe.exec(source)) !== null) {
    imports.set(match[1], match[2])
  }

  return imports
}

/**
 * Extract JSX component usage from source.
 * Looks for <ComponentName followed by space, > or /
 * Returns component names in order of appearance.
 */
function extractJsxComponents(source: string): string[] {
  const components: string[] = []
  const seen = new Set<string>()
  // Match <ComponentName but not <div, <span, etc (lowercase)
  const re = /<([A-Z][a-zA-Z0-9]*)\b/g
  let match: RegExpExecArray | null
  while ((match = re.exec(source)) !== null) {
    const name = match[1]
    if (!seen.has(name)) {
      seen.add(name)
      components.push(name)
    }
  }
  return components
}

/**
 * Find the layout component (wraps all pages, renders <Outlet />).
 */
function findLayoutFile(srcDir: string, componentMap: Map<string, string>): string | null {
  // Strategy 1: Look for Layout.tsx explicitly
  if (componentMap.has('Layout')) return componentMap.get('Layout')!

  // Strategy 2: Look for files containing <Outlet
  for (const [, filePath] of componentMap) {
    const source = readFile(filePath)
    if (source.includes('<Outlet') || source.includes('<Outlet/>') || source.includes('<Outlet />')) {
      return filePath
    }
  }

  // Strategy 3: Look for routes.tsx and find the layout component referenced there
  const routesFiles = [
    path.join(srcDir, 'app', 'routes.tsx'),
    path.join(srcDir, 'app', 'routes.jsx'),
    path.join(srcDir, 'routes.tsx'),
    path.join(srcDir, 'routes.jsx'),
  ]

  for (const routeFile of routesFiles) {
    if (fs.existsSync(routeFile)) {
      const source = readFile(routeFile)
      // Look for element: <Layout> or Component: Layout
      const layoutMatch = source.match(/element:\s*<(\w+)/)
        || source.match(/Component:\s*(\w+)/)
      if (layoutMatch && componentMap.has(layoutMatch[1])) {
        return componentMap.get(layoutMatch[1])!
      }
    }
  }

  return null
}

/**
 * Analyze layout file to find chrome components (rendered outside <Outlet />).
 */
function extractChromeFromLayout(
  layoutPath: string,
  componentMap: Map<string, string>,
): { header?: ComponentRef; footer?: ComponentRef } {
  const source = readFile(layoutPath)
  const result: { header?: ComponentRef; footer?: ComponentRef } = {}

  // Find the <Outlet /> position
  const outletIdx = source.search(/<Outlet\s*\/?>/)
  if (outletIdx === -1) return result

  // Get all JSX components used in the file
  const imports = extractImports(source)

  // Find the JSX/return block
  const returnIdx = source.lastIndexOf('return', source.indexOf('<'))
  if (returnIdx === -1) return result

  const beforeOutlet = source.slice(returnIdx, outletIdx)
  const afterOutlet = source.slice(outletIdx)

  // Components before <Outlet> are likely headers/navs
  const beforeComponents = extractJsxComponents(beforeOutlet)
  for (const comp of beforeComponents) {
    // Skip non-component imports (e.g. Outlet itself, motion.div, etc.)
    if (comp === 'Outlet' || comp === 'ScrollRestoration') continue
    if (imports.has(comp) || componentMap.has(comp)) {
      const filePath = componentMap.get(comp)
      if (filePath) {
        result.header = { componentName: comp, filePath }
        break // Take the first one as the header
      }
    }
  }

  // Components after <Outlet> are likely footers
  const afterComponents = extractJsxComponents(afterOutlet)
  for (const comp of afterComponents) {
    if (comp === 'Outlet' || comp === 'ScrollRestoration') continue
    if (imports.has(comp) || componentMap.has(comp)) {
      const filePath = componentMap.get(comp)
      if (filePath) {
        result.footer = { componentName: comp, filePath }
        break // Take the first one as the footer
      }
    }
  }

  return result
}

/**
 * Find page files in the project.
 */
function findPageFiles(srcDir: string, componentMap: Map<string, string>): string[] {
  const pagesDirs = [
    path.join(srcDir, 'app', 'pages'),
    path.join(srcDir, 'pages'),
    path.join(srcDir, 'app', 'routes'),
  ]

  for (const dir of pagesDirs) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir)
        .filter((f) => f.endsWith('.tsx') || f.endsWith('.jsx'))
        .filter((f) => !f.startsWith('_') && !f.startsWith('.'))
        .map((f) => path.join(dir, f))
      if (files.length > 0) return files
    }
  }

  // Fallback: look for files that look like pages (contain section-like components)
  const potentialPages: string[] = []
  for (const [name, filePath] of componentMap) {
    if (name.endsWith('Page') || name.endsWith('Home') || name.endsWith('About')) {
      potentialPages.push(filePath)
    }
  }

  return potentialPages
}

/**
 * Extract section components used in a page file.
 * Sections are top-level components rendered in the page's JSX return.
 */
function extractSectionsFromPage(
  pageFilePath: string,
  componentMap: Map<string, string>,
  chromeComponents: Set<string>,
): ComponentRef[] {
  const source = readFile(pageFilePath)
  const imports = extractImports(source)
  const jsxComponents = extractJsxComponents(source)

  const sections: ComponentRef[] = []

  // Common non-section components to skip
  const skipNames = new Set([
    'Outlet', 'Link', 'Router', 'Route', 'Routes',
    'ScrollRestoration', 'AnimatePresence', 'Fragment',
    'Helmet', 'Head', 'SEO', 'Meta',
    // motion components
    'motion', 'LazyMotion', 'AnimatePresence',
    // providers
    'ThemeProvider', 'Provider', 'QueryClientProvider',
  ])

  for (const comp of jsxComponents) {
    if (skipNames.has(comp)) continue
    if (chromeComponents.has(comp)) continue

    // Check if it's an imported component with a known file
    const filePath = componentMap.get(comp)
    if (filePath) {
      sections.push({ componentName: comp, filePath })
    }
  }

  return sections
}

/**
 * Stage 1: Analyze the Figma Make project structure.
 */
function analyzeProject(srcDir: string): SiteMap {
  logSection('Stage 1: Analyzing project structure')
  log(`Input: ${srcDir}`)

  const componentMap = buildComponentMap(srcDir)
  log(`Found ${componentMap.size} components`)

  // Find layout
  const layoutPath = findLayoutFile(srcDir, componentMap)
  let chrome: SiteMap['chrome'] = {}

  if (layoutPath) {
    log(`Layout: ${path.relative(srcDir, layoutPath)}`)
    chrome = extractChromeFromLayout(layoutPath, componentMap)
    if (chrome.header) log(`  Header: ${chrome.header.componentName} (${path.relative(srcDir, chrome.header.filePath)})`)
    if (chrome.footer) log(`  Footer: ${chrome.footer.componentName} (${path.relative(srcDir, chrome.footer.filePath)})`)
  } else {
    log('No layout file found — skipping chrome detection')
  }

  // Collect chrome component names for exclusion from sections
  const chromeComponents = new Set<string>()
  if (chrome.header) chromeComponents.add(chrome.header.componentName)
  if (chrome.footer) chromeComponents.add(chrome.footer.componentName)

  // Find pages
  const pageFiles = findPageFiles(srcDir, componentMap)
  log(`\nPages found: ${pageFiles.length}`)

  const pages: PageInfo[] = []
  for (const pageFile of pageFiles) {
    const basename = path.basename(pageFile, path.extname(pageFile))
    // Derive page name: "HomePage.tsx" -> "home", "AboutPage.tsx" -> "about"
    const pageName = basename
      .replace(/(Page|View)$/, '')
      .toLowerCase()
      || basename.toLowerCase()

    // If explicit pages were provided, skip pages not in the list
    if (explicitPages && !explicitPages.includes(pageName)) continue

    const sections = extractSectionsFromPage(pageFile, componentMap, chromeComponents)
    log(`  ${pageName} (${path.relative(srcDir, pageFile)}): ${sections.length} sections`)
    for (const s of sections) {
      log(`    - ${s.componentName} (${path.relative(srcDir, s.filePath)})`)
    }

    pages.push({ name: pageName, filePath: pageFile, sections })
  }

  if (pages.length === 0) {
    console.error('Error: No pages found in the project.')
    console.error('Looked in: app/pages/, pages/, app/routes/')
    console.error('Try specifying pages with --pages home,about')
    process.exit(1)
  }

  return { chrome, pages, componentFiles: componentMap }
}

// =============================================================================
// Stage 2: Generate Sections
// =============================================================================

/**
 * Adapt a Figma Make component for use as an engine section.
 *
 * Transformations:
 * - Replace `figma:asset/...` imports with placeholder comments
 * - Replace relative asset imports with TODO placeholders
 * - Wrap in forwardRef if not already
 * - Add WidgetBaseProps extension
 */
function adaptComponent(source: string, componentName: string, sourceFilePath: string): string {
  let adapted = source

  // 1. Replace figma:asset imports with placeholder
  adapted = adapted.replace(
    /import\s+(\w+)\s+from\s+['"]figma:asset\/([^'"]+)['"]/g,
    (_, varName, assetPath) => {
      return `// TODO: Replace with actual asset path\nconst ${varName} = '/assets/${path.basename(assetPath)}'`
    },
  )

  // 2. Replace relative image/asset imports with placeholders
  adapted = adapted.replace(
    /import\s+(\w+)\s+from\s+['"](\.\.\/)*(\.\/)?([^'"]+\.(png|jpg|jpeg|gif|svg|webp|avif|mp4|webm))['"]/g,
    (_, varName, _up1, _up2, assetPath) => {
      return `// TODO: Replace with actual asset path\nconst ${varName} = '/assets/${path.basename(assetPath)}'`
    },
  )

  // 3. Remove or adapt project-specific imports that won't resolve
  // Remove imports from paths that clearly won't exist in engine
  adapted = adapted.replace(
    /import\s+.*\s+from\s+['"]@\/(?!components\/ui)[^'"]+['"]\s*;?\n?/g,
    (match) => `// TODO: Adapt import — ${match.trim()}\n`,
  )

  // 4. Check if component already uses forwardRef
  const hasForwardRef = adapted.includes('forwardRef')

  // 5. Add WidgetBaseProps import if not present
  if (!adapted.includes('WidgetBaseProps')) {
    // Find the first import line and add our import before it
    const firstImportIdx = adapted.search(/^import\s/m)
    if (firstImportIdx !== -1) {
      adapted = adapted.slice(0, firstImportIdx)
        + `import type { WidgetBaseProps } from '../../../../content/widgets/types'\n`
        + adapted.slice(firstImportIdx)
    }
  }

  // 6. If the component is a simple function/const export but not forwardRef,
  //    we need to check if it exports a default or named component.
  //    The factory only needs the component to be importable — forwardRef is nice but not strictly required.
  //    We add a comment if forwardRef is missing.
  if (!hasForwardRef) {
    // Add a comment at the top
    adapted = `// Note: Consider wrapping with forwardRef for full engine integration\n` + adapted
  }

  return adapted
}

/**
 * Collect files that a component depends on.
 * Scans imports and finds local (relative) files that also need to be copied.
 */
function collectLocalDependencies(
  sourceFilePath: string,
  srcDir: string,
  visited: Set<string> = new Set(),
): string[] {
  if (visited.has(sourceFilePath)) return []
  visited.add(sourceFilePath)

  if (!fs.existsSync(sourceFilePath)) return []
  const source = readFile(sourceFilePath)
  const deps: string[] = []
  const sourceDir = path.dirname(sourceFilePath)

  // Match relative imports: import ... from './...' or '../...'
  const importRe = /from\s+['"](\.[^'"]+)['"]/g
  let match: RegExpExecArray | null
  while ((match = importRe.exec(source)) !== null) {
    const importPath = match[1]
    // Skip asset imports
    if (/\.(png|jpg|jpeg|gif|svg|webp|avif|mp4|webm|css)$/.test(importPath)) continue

    // Resolve the import path
    const resolved = resolveImportPath(sourceDir, importPath)
    if (resolved && !visited.has(resolved)) {
      // Only include files within src/ (not node_modules)
      if (resolved.startsWith(srcDir)) {
        deps.push(resolved)
        // Recursively collect dependencies
        deps.push(...collectLocalDependencies(resolved, srcDir, visited))
      }
    }
  }

  return deps
}

/**
 * Resolve a relative import to an actual file path.
 * Tries .tsx, .ts, .jsx, .js extensions and /index variations.
 */
function resolveImportPath(fromDir: string, importPath: string): string | null {
  const base = path.resolve(fromDir, importPath)
  const candidates = [
    base + '.tsx',
    base + '.ts',
    base + '.jsx',
    base + '.js',
    path.join(base, 'index.tsx'),
    path.join(base, 'index.ts'),
    path.join(base, 'index.jsx'),
    path.join(base, 'index.js'),
    base, // exact match (e.g. .css imports that we already handle)
  ]
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate
  }
  return null
}

interface GeneratedSection {
  /** PascalCase name for the section pattern */
  name: string
  /** kebab-case name */
  kebab: string
  /** Files to write: path -> content */
  files: Map<string, string>
}

/**
 * Collect CSS files imported by a component and its dependencies.
 */
function collectCssImports(
  sourceFilePath: string,
  srcDir: string,
  visited: Set<string> = new Set(),
): string[] {
  if (visited.has(sourceFilePath)) return []
  visited.add(sourceFilePath)

  if (!fs.existsSync(sourceFilePath)) return []
  const source = readFile(sourceFilePath)
  const cssFiles: string[] = []
  const sourceDir = path.dirname(sourceFilePath)

  // Match CSS imports: import './styles.css' or import '../theme.css'
  const cssImportRe = /(?:import\s+['"]|from\s+['"])(\.[^'"]+\.css)['"]/g
  let match: RegExpExecArray | null
  while ((match = cssImportRe.exec(source)) !== null) {
    const cssPath = path.resolve(sourceDir, match[1])
    if (fs.existsSync(cssPath)) {
      cssFiles.push(cssPath)
    }
  }

  // Also check local TS/TSX dependencies for their CSS
  const importRe = /from\s+['"](\.[^'"]+)['"]/g
  while ((match = importRe.exec(source)) !== null) {
    const importPath = match[1]
    if (/\.css$/.test(importPath)) continue
    const resolved = resolveImportPath(sourceDir, importPath)
    if (resolved && resolved.startsWith(srcDir)) {
      cssFiles.push(...collectCssImports(resolved, srcDir, visited))
    }
  }

  return cssFiles
}

/**
 * Generate a section pattern from a Figma Make component.
 */
function generateSection(
  ref: ComponentRef,
  srcDir: string,
): GeneratedSection {
  const sectionName = toSectionName(ref.componentName)
  const kebab = toKebab(sectionName)
  const display = toDisplay(sectionName)
  const patternDir = path.join(SECTIONS_DIR, sectionName)

  if (fs.existsSync(patternDir)) {
    log(`  SKIP: Section "${sectionName}" already exists at ${patternDir}`)
    return { name: sectionName, kebab, files: new Map() }
  }

  const files = new Map<string, string>()

  // Read and adapt the source component
  const originalSource = readFile(ref.filePath)
  const adaptedSource = adaptComponent(originalSource, ref.componentName, ref.filePath)

  // --- component.tsx ---
  files.set(
    path.join(patternDir, 'component.tsx'),
    adaptedSource,
  )

  // --- Collect local dependencies ---
  const deps = collectLocalDependencies(ref.filePath, srcDir)
  const depsDir = path.join(patternDir, 'deps')

  for (const depPath of deps) {
    const relativeToSrc = path.relative(srcDir, depPath)
    // Flatten into deps/ directory, preserving directory structure from src
    const targetPath = path.join(depsDir, relativeToSrc)
    let depSource = readFile(depPath)

    // Adapt the dependency: fix figma:asset imports
    depSource = depSource.replace(
      /import\s+(\w+)\s+from\s+['"]figma:asset\/([^'"]+)['"]/g,
      (_, varName, assetPath) => {
        return `// TODO: Replace with actual asset path\nconst ${varName} = '/assets/${path.basename(assetPath)}'`
      },
    )

    files.set(targetPath, depSource)
  }

  // --- Collect CSS ---
  const cssFiles = collectCssImports(ref.filePath, srcDir)
  let combinedCss = `/**\n * ${sectionName} section styles.\n * Imported from Figma Make project.\n */\n\n`
  for (const cssPath of cssFiles) {
    const cssContent = readFile(cssPath)
    const relativeCssPath = path.relative(srcDir, cssPath)
    combinedCss += `/* Source: ${relativeCssPath} */\n${cssContent}\n\n`
  }

  // --- index.ts ---
  files.set(
    path.join(patternDir, 'index.ts'),
    `/**
 * ${sectionName} — Imported React component section.
 * Wraps a Figma Make component as an engine section via ReactSection.
 */

import type { SectionSchema } from '../../../../schema'
import { registerScopedWidget } from '../../../widgets/registry'
import { createReactSection, type ReactSectionProps } from '../ReactSection'
import { ${ref.componentName} } from './component'

// Register the React component as a scoped widget
registerScopedWidget('${sectionName}__Component', ${ref.componentName})

// Export a typed factory
export function create${sectionName}Section(props?: Partial<ReactSectionProps>): SectionSchema {
  return {
    ...createReactSection({
      id: props?.id ?? '${kebab}',
      label: props?.label ?? '${display}',
      component: '${sectionName}__Component',
      props: props?.props,
      constrained: props?.constrained,
      colorMode: props?.colorMode,
      sectionHeight: props?.sectionHeight,
      style: props?.style,
      className: props?.className,
      paddingTop: props?.paddingTop,
      paddingBottom: props?.paddingBottom,
      paddingLeft: props?.paddingLeft,
      paddingRight: props?.paddingRight,
    }),
    patternId: '${sectionName}',
  }
}
`,
  )

  // --- meta.ts ---
  files.set(
    path.join(patternDir, 'meta.ts'),
    `import { defineSectionMeta } from '../../../../schema/meta'
import type { ReactSectionProps } from '../ReactSection/meta'

export const meta = defineSectionMeta<ReactSectionProps>({
  id: '${sectionName}',
  name: '${display}',
  description: 'Imported from Figma Make project',
  category: 'section',
  sectionCategory: 'content',
  unique: false,
  icon: 'section',
  tags: ['content', 'react', 'import'],
  component: false,
  ownedFields: ['layout', 'className'],
  settings: {},
})
`,
  )

  // --- types.ts ---
  files.set(
    path.join(patternDir, 'types.ts'),
    `/**
 * ${sectionName} types — delegates to ReactSectionProps.
 */

export type { ReactSectionProps } from '../ReactSection/meta'
`,
  )

  // --- content.ts ---
  files.set(
    path.join(patternDir, 'content.ts'),
    `import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { ReactSectionProps } from '../ReactSection/meta'

export const content: SectionContentDeclaration<Partial<ReactSectionProps>> = {
  label: '${display}',
  description: 'Imported from Figma Make project. Content is managed by the component itself.',
  contentFields: [],
  sampleContent: {},
}
`,
  )

  // --- styles.css ---
  files.set(
    path.join(patternDir, 'styles.css'),
    combinedCss || `/**\n * ${sectionName} section styles.\n * Imported from Figma Make project.\n */\n\n.section-${kebab} {\n  font-family: var(--font-body, sans-serif);\n}\n`,
  )

  // --- {Name}.stories.tsx ---
  files.set(
    path.join(patternDir, `${sectionName}.stories.tsx`),
    `import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { create${sectionName}Section } from './index'
import { content } from './content'
import type { ReactSectionProps } from '../ReactSection/meta'

// Side-effect import to register the scoped widget
import './index'

const config = sectionStoryConfig(meta, create${sectionName}Section)
export default {
  ...config,
  title: 'Imported/${display}',
  parameters: { ...config.parameters, a11y: { test: 'error' } },
}

export const Default = { args: sectionStoryArgs(meta, content.sampleContent as Partial<ReactSectionProps>, create${sectionName}Section) }
`,
  )

  return { name: sectionName, kebab, files }
}

/**
 * Register a section in the section registry.
 */
function registerSection(sectionName: string): void {
  let registry = readFile(SECTION_REGISTRY)

  // Check if already registered
  if (registry.includes(`meta as ${sectionName}Meta`)) {
    log(`  SKIP: ${sectionName} already in registry`)
    return
  }

  // 1. Add meta import
  const metaImportLine = `import { meta as ${sectionName}Meta } from './patterns/${sectionName}/meta'`
  const lastMetaImport = registry.lastIndexOf("import { meta as ")
  const lastMetaImportEnd = registry.indexOf('\n', lastMetaImport)
  registry =
    registry.slice(0, lastMetaImportEnd + 1) +
    metaImportLine +
    '\n' +
    registry.slice(lastMetaImportEnd + 1)

  // 2. Add registry entry
  const registryEntry = `  ${sectionName}: createEntry('${sectionName}', ${sectionName}Meta as SectionMeta,\n    async () => (await import('./patterns/${sectionName}')).create${sectionName}Section),`
  const closingBrace = registry.indexOf('\n}', registry.indexOf('export const sectionRegistry'))
  registry =
    registry.slice(0, closingBrace) +
    '\n' +
    registryEntry +
    registry.slice(closingBrace)

  // 3. Add factory re-export
  const factoryExport = `export { create${sectionName}Section } from './patterns/${sectionName}'`
  const lastFactoryExport = registry.lastIndexOf("export { create")
  const lastFactoryExportEnd = registry.indexOf('\n', lastFactoryExport)
  registry =
    registry.slice(0, lastFactoryExportEnd + 1) +
    factoryExport +
    '\n' +
    registry.slice(lastFactoryExportEnd + 1)

  // Note: Skip type re-export for --react sections (ReactSectionProps already exported)

  if (dryRun) {
    log(`  DRY-RUN: Would register ${sectionName} in ${SECTION_REGISTRY}`)
  } else {
    fs.writeFileSync(SECTION_REGISTRY, registry)
    log(`  Registered ${sectionName} in section registry`)
  }
}

/**
 * Register a section's CSS in engine/styles.css.
 */
function registerSectionCss(sectionName: string): void {
  let styles = readFile(STYLES_CSS)

  const importLine = `@import './content/sections/patterns/${sectionName}/styles.css' layer(sections);`

  // Check if already registered
  if (styles.includes(importLine)) {
    log(`  SKIP: ${sectionName} CSS already in styles.css`)
    return
  }

  const lastSectionImport = styles.lastIndexOf("@import './content/sections/patterns/")
  const lastSectionImportEnd = styles.indexOf('\n', lastSectionImport)
  styles =
    styles.slice(0, lastSectionImportEnd + 1) +
    importLine +
    '\n' +
    styles.slice(lastSectionImportEnd + 1)

  if (dryRun) {
    log(`  DRY-RUN: Would add ${sectionName} CSS to styles.css`)
  } else {
    fs.writeFileSync(STYLES_CSS, styles)
    log(`  Registered ${sectionName} CSS in styles.css`)
  }
}

// =============================================================================
// Stage 3: Generate Chrome
// =============================================================================

interface GeneratedChrome {
  name: string
  kebab: string
  slot: 'header' | 'footer'
  files: Map<string, string>
}

/**
 * Generate a chrome pattern from a Figma Make layout component.
 * Uses ReactSection-style passthrough: registers the component as a scoped widget
 * and wraps it in a chrome region configuration.
 */
function generateChrome(
  ref: ComponentRef,
  slot: 'header' | 'footer',
  srcDir: string,
): GeneratedChrome {
  // Derive chrome name: e.g. "NavigationBar" -> keep as-is, but ensure PascalCase
  const chromeName = toPascal(ref.componentName.replace(/(Section|Component)$/, ''))
  const kebab = toKebab(chromeName)
  const display = toDisplay(chromeName)
  const patternDir = path.join(CHROME_PATTERNS_DIR, chromeName)

  if (fs.existsSync(patternDir)) {
    log(`  SKIP: Chrome pattern "${chromeName}" already exists`)
    return { name: chromeName, kebab, slot, files: new Map() }
  }

  const files = new Map<string, string>()

  // Read and adapt the source component
  const originalSource = readFile(ref.filePath)
  const adaptedSource = adaptComponent(originalSource, ref.componentName, ref.filePath)

  // --- component.tsx ---
  files.set(path.join(patternDir, 'component.tsx'), adaptedSource)

  // --- Collect local dependencies ---
  const deps = collectLocalDependencies(ref.filePath, srcDir)
  const depsDir = path.join(patternDir, 'deps')
  for (const depPath of deps) {
    const relativeToSrc = path.relative(srcDir, depPath)
    const targetPath = path.join(depsDir, relativeToSrc)
    let depSource = readFile(depPath)
    depSource = depSource.replace(
      /import\s+(\w+)\s+from\s+['"]figma:asset\/([^'"]+)['"]/g,
      (_, varName, assetPath) => {
        return `// TODO: Replace with actual asset path\nconst ${varName} = '/assets/${path.basename(assetPath)}'`
      },
    )
    files.set(targetPath, depSource)
  }

  // --- Collect CSS ---
  const cssFiles = collectCssImports(ref.filePath, srcDir)
  let combinedCss = `/**\n * ${chromeName} chrome pattern styles.\n * Imported from Figma Make project.\n */\n\n`
  for (const cssPath of cssFiles) {
    const cssContent = readFile(cssPath)
    const relativeCssPath = path.relative(srcDir, cssPath)
    combinedCss += `/* Source: ${relativeCssPath} */\n${cssContent}\n\n`
  }

  // --- index.ts ---
  // For chrome, we register as a scoped widget and create a region config
  // that renders it via a single widget reference
  files.set(
    path.join(patternDir, 'index.ts'),
    `/**
 * ${chromeName} — Imported Figma Make ${slot} chrome pattern.
 * Wraps a React component as an engine chrome region.
 */

import type { PresetRegionConfig } from '../../../../presets/types'
import { registerScopedWidget } from '../../../widgets/registry'
import { ${ref.componentName} } from './component'
import type { ${chromeName}Props } from './types'

// Register the React component as a scoped widget
registerScopedWidget('${chromeName}__Component', ${ref.componentName})

/**
 * Creates a ${chromeName} ${slot} region configuration.
 */
export function create${chromeName}Region(props?: ${chromeName}Props): PresetRegionConfig {
  return {
    widgets: [
      {
        id: '${kebab}-root',
        type: '${chromeName}__Component',
        props: props?.componentProps ?? {},
      },
    ],
    layout: {
      justify: 'stretch',
      align: 'stretch',
      padding: '0',
      ...props?.layout,
    },
    ...(props?.overlay != null && { overlay: props.overlay }),
    ...(props?.style && { style: props.style }),
  }
}
`,
  )

  // --- types.ts ---
  files.set(
    path.join(patternDir, 'types.ts'),
    `import type { CSSProperties } from 'react'
import type { RegionLayout } from '../../../../schema/chrome'

export interface ${chromeName}Props {
  /** Props to pass to the underlying React component */
  componentProps?: Record<string, unknown>
  /** Layout overrides */
  layout?: Partial<RegionLayout>
  /** Float over content (default: true for header) */
  overlay?: boolean
  /** Inline styles for the region wrapper */
  style?: CSSProperties
}
`,
  )

  // --- meta.ts ---
  files.set(
    path.join(patternDir, 'meta.ts'),
    `import { defineChromeMeta } from '../../../../schema/meta'
import type { ${chromeName}Props } from './types'

export const meta = defineChromeMeta<${chromeName}Props>({
  id: '${chromeName}',
  name: '${display}',
  description: 'Imported from Figma Make project',
  category: 'chrome-pattern',
  chromeSlot: '${slot}',
  icon: '${slot}',
  tags: ['chrome', '${slot}', 'import'],
  component: false,
  settings: {},
})
`,
  )

  // --- content.ts ---
  files.set(
    path.join(patternDir, 'content.ts'),
    `import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { ${chromeName}Props } from './types'

export const content: SectionContentDeclaration<Partial<${chromeName}Props>> = {
  label: '${display}',
  description: 'Imported from Figma Make project. Content is managed by the component itself.',
  contentFields: [],
  sampleContent: {},
}
`,
  )

  // --- styles.css ---
  files.set(
    path.join(patternDir, 'styles.css'),
    combinedCss || `/**\n * ${chromeName} chrome pattern styles.\n * Imported from Figma Make project.\n */\n\n.${kebab} {\n  /* Pattern-specific styles */\n}\n`,
  )

  // --- {Name}.stories.tsx ---
  const chromeTitleGroup = slot === 'header' ? 'Headers' : 'Footers'
  files.set(
    path.join(patternDir, `${chromeName}.stories.tsx`),
    `import { chromePatternStoryConfig, chromePatternStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { create${chromeName}Region } from './index'
import { content } from './content'
import type { ${chromeName}Props } from './types'

// Side-effect import to register the scoped widget
import './index'

const previewProps = content.sampleContent as Partial<${chromeName}Props>
const config = chromePatternStoryConfig(meta, create${chromeName}Region, previewProps)
export default {
  ...config,
  title: 'Imported/${chromeTitleGroup}/${display}',
  parameters: { ...config.parameters, a11y: { test: 'error' } },
}

export const Default = { args: chromePatternStoryArgs(meta, previewProps, create${chromeName}Region) }
`,
  )

  return { name: chromeName, kebab, slot, files }
}

/**
 * Register a chrome pattern in the chrome pattern registry.
 */
function registerChrome(chromeName: string): void {
  let registry = readFile(CHROME_REGISTRY)

  // Check if already registered
  if (registry.includes(`meta as ${chromeName}Meta`)) {
    log(`  SKIP: ${chromeName} already in chrome registry`)
    return
  }

  // 1. Add meta import
  const metaImportLine = `import { meta as ${chromeName}Meta } from './patterns/${chromeName}/meta'`
  const lastMetaImport = registry.lastIndexOf("import { meta as ")
  const lastMetaImportEnd = registry.indexOf('\n', lastMetaImport)
  registry =
    registry.slice(0, lastMetaImportEnd + 1) +
    metaImportLine +
    '\n' +
    registry.slice(lastMetaImportEnd + 1)

  // 2. Add registry entry
  const registryEntry = `  ${chromeName}: {\n    meta: ${chromeName}Meta as ChromePatternMeta,\n    getFactory: async () => (await import('./patterns/${chromeName}')).create${chromeName}Region,\n  },`
  const closingBrace = registry.indexOf('\n}', registry.indexOf('export const chromePatternRegistry'))
  registry =
    registry.slice(0, closingBrace) +
    '\n' +
    registryEntry +
    registry.slice(closingBrace)

  // 3. Add factory re-export
  const factoryExport = `export { create${chromeName}Region } from './patterns/${chromeName}'`
  const lastFactoryExport = registry.lastIndexOf("export { create")
  const lastFactoryExportEnd = registry.indexOf('\n', lastFactoryExport)
  registry =
    registry.slice(0, lastFactoryExportEnd + 1) +
    factoryExport +
    '\n' +
    registry.slice(lastFactoryExportEnd + 1)

  // 4. Add type re-export
  const typeExport = `export type { ${chromeName}Props } from './patterns/${chromeName}/types'`
  registry = registry.trimEnd() + '\n' + typeExport + '\n'

  if (dryRun) {
    log(`  DRY-RUN: Would register ${chromeName} in chrome registry`)
  } else {
    fs.writeFileSync(CHROME_REGISTRY, registry)
    log(`  Registered ${chromeName} in chrome pattern registry`)
  }
}

/**
 * Register a chrome pattern's CSS in engine/styles.css.
 */
function registerChromeCss(chromeName: string): void {
  let styles = readFile(STYLES_CSS)

  const importLine = `@import './content/chrome/patterns/${chromeName}/styles.css' layer(chrome);`

  if (styles.includes(importLine)) {
    log(`  SKIP: ${chromeName} CSS already in styles.css`)
    return
  }

  const lastChromePatternImport = styles.lastIndexOf("@import './content/chrome/patterns/")
  if (lastChromePatternImport !== -1) {
    const lastChromePatternEnd = styles.indexOf('\n', lastChromePatternImport)
    styles =
      styles.slice(0, lastChromePatternEnd + 1) +
      importLine +
      '\n' +
      styles.slice(lastChromePatternEnd + 1)
  }

  if (dryRun) {
    log(`  DRY-RUN: Would add ${chromeName} CSS to styles.css`)
  } else {
    fs.writeFileSync(STYLES_CSS, styles)
    log(`  Registered ${chromeName} CSS in styles.css`)
  }
}

// =============================================================================
// Stage 4: Generate Preset
// =============================================================================

function generatePreset(
  siteMap: SiteMap,
  generatedSections: Map<string, GeneratedSection>,
  generatedChrome: { header?: GeneratedChrome; footer?: GeneratedChrome },
): Map<string, string> {
  const presetDir = path.join(PRESETS_DIR, presetKebab)
  const pagesDir = path.join(presetDir, 'pages')
  const files = new Map<string, string>()

  if (fs.existsSync(presetDir)) {
    log(`  SKIP: Preset "${presetKebab}" already exists at ${presetDir}`)
    return files
  }

  // --- pages/{page}.ts ---
  for (const page of siteMap.pages) {
    const pageId = page.name.toLowerCase()
    const slug = pageId === 'home' ? '/' : `/${pageId}`

    // Build section factory calls
    const sectionImports: string[] = []
    const sectionCalls: string[] = []

    for (const section of page.sections) {
      const sectionName = toSectionName(section.componentName)
      const kebab = toKebab(sectionName)

      sectionImports.push(
        `import { create${sectionName}Section } from '../../../content/sections/patterns/${sectionName}'`,
      )
      // Side-effect import for scoped widget registration
      sectionImports.push(
        `import '../../../content/sections/patterns/${sectionName}/index'`,
      )
      sectionCalls.push(
        `    create${sectionName}Section({ id: '${kebab}' }),`,
      )
    }

    const uniqueImports = [...new Set(sectionImports)]

    files.set(
      path.join(pagesDir, `${pageId}.ts`),
      `import type { PageSchema } from '../../../schema/page'
${uniqueImports.join('\n')}

export const ${pageId}PageTemplate: PageSchema = {
  id: '${pageId}',
  slug: '${slug}',
  head: {
    title: '{{ content.head.title }}',
    description: '{{ content.head.description }}',
  },
  sections: [
${sectionCalls.join('\n')}
  ],
}
`,
    )
  }

  // --- content-contract.ts ---
  files.set(
    path.join(presetDir, 'content-contract.ts'),
    `import { buildContentContract } from '../content-utils'

export const ${presetCamel}ContentContract = buildContentContract({
  head: {
    label: 'Page Head',
    contentFields: [
      { path: 'title', type: 'text', label: 'Page Title' },
      { path: 'description', type: 'textarea', label: 'Page Description' },
    ],
    sampleContent: {
      title: '${presetDisplay} Site',
      description: 'A ${presetDisplay.toLowerCase()} site built with Creativeshire Engine.',
    },
  },
  // ReactSection components manage their own content.
  // As you progressively extract content into CMS fields,
  // add section content declarations here.
})
`,
  )

  // --- sample-content.ts ---
  files.set(
    path.join(presetDir, 'sample-content.ts'),
    `import { buildSampleContent } from '../content-utils'

export const ${presetCamel}SampleContent = buildSampleContent({
  head: {
    label: 'Page Head',
    contentFields: [
      { path: 'title', type: 'text', label: 'Page Title' },
      { path: 'description', type: 'textarea', label: 'Page Description' },
    ],
    sampleContent: {
      title: '${presetDisplay} Site',
      description: 'A ${presetDisplay.toLowerCase()} site built with Creativeshire Engine.',
    },
  },
})
`,
  )

  // --- index.ts ---
  const pageImports = siteMap.pages
    .map((p) => `import { ${p.name.toLowerCase()}PageTemplate } from './pages/${p.name.toLowerCase()}'`)
    .join('\n')

  const pageEntries = siteMap.pages
    .map((p) => `      ${p.name.toLowerCase()}: ${p.name.toLowerCase()}PageTemplate,`)
    .join('\n')

  // Build chrome config
  let chromeImports = ''
  let headerConfig = "'hidden'"
  let footerConfig = "'hidden'"

  if (generatedChrome.header && generatedChrome.header.files.size > 0) {
    chromeImports += `import { create${generatedChrome.header.name}Region } from '../../content/chrome/patterns/${generatedChrome.header.name}'\n`
    // Side-effect import for scoped widget registration
    chromeImports += `import '../../content/chrome/patterns/${generatedChrome.header.name}/index'\n`
    headerConfig = `{
          ...create${generatedChrome.header.name}Region(),
          overlay: true,
        }`
  }

  if (generatedChrome.footer && generatedChrome.footer.files.size > 0) {
    chromeImports += `import { create${generatedChrome.footer.name}Region } from '../../content/chrome/patterns/${generatedChrome.footer.name}'\n`
    // Side-effect import for scoped widget registration
    chromeImports += `import '../../content/chrome/patterns/${generatedChrome.footer.name}/index'\n`
    footerConfig = `create${generatedChrome.footer.name}Region()`
  }

  files.set(
    path.join(presetDir, 'index.ts'),
    `/**
 * ${presetDisplay} Preset
 * Imported from Figma Make project.
 */

import type { SitePreset } from '../types'
import { registerPreset, type PresetMeta } from '../registry'
${pageImports}
${chromeImports}import { ${presetCamel}ContentContract } from './content-contract'
import { ${presetCamel}SampleContent } from './sample-content'

/**
 * ${presetDisplay} preset metadata for UI display.
 */
export const ${presetCamel}Meta: PresetMeta = {
  id: '${presetKebab}',
  name: '${presetDisplay}',
  description: 'Imported from Figma Make project.',
}

/**
 * ${presetDisplay} preset - complete site configuration.
 */
export const ${presetCamel}Preset: SitePreset = {
  content: {
    id: '${presetKebab}-content',
    name: '${presetDisplay}',
    pages: {
${pageEntries}
    },
    chrome: {
      regions: {
        header: ${headerConfig},
        footer: ${footerConfig},
      },
      overlays: {},
    },
    contentContract: ${presetCamel}ContentContract,
    sampleContent: ${presetCamel}SampleContent,
  },
  experience: {
    base: 'simple',
  },
  theme: {
    id: '${presetKebab}-theme',
    name: '${presetDisplay}',
    theme: {
      colorTheme: 'contrast',
      scrollbar: { type: 'thin' },
      smoothScroll: { enabled: true },
      sectionTransition: {
        fadeDuration: '0.15s',
        fadeEasing: 'ease-out',
      },
    },
  },
}

// Auto-register on module load
registerPreset(${presetCamel}Meta, ${presetCamel}Preset)

// Content contract export
export { ${presetCamel}ContentContract } from './content-contract'

// Export sample content for dev preview
export { ${presetCamel}SampleContent } from './sample-content'
`,
  )

  return files
}

/**
 * Register the preset in presets/index.ts.
 */
function registerPresetInIndex(): void {
  let presetsIndex = readFile(PRESETS_INDEX)

  // Check if already registered
  if (presetsIndex.includes(`${presetCamel}Preset`)) {
    log(`  SKIP: Preset already registered in presets/index.ts`)
    return
  }

  const presetExportLine = `export { ${presetCamel}Preset, ${presetCamel}Meta, ${presetCamel}ContentContract } from './${presetKebab}'`

  // Find the last preset export before ensurePresetsRegistered
  const ensureIdx = presetsIndex.indexOf('export function ensurePresetsRegistered')
  const lastExportBeforeEnsure = presetsIndex.lastIndexOf("export {", ensureIdx)
  const lastExportBeforeEnsureEnd = presetsIndex.indexOf('\n', lastExportBeforeEnsure)

  presetsIndex =
    presetsIndex.slice(0, lastExportBeforeEnsureEnd + 1) +
    presetExportLine +
    '\n' +
    presetsIndex.slice(lastExportBeforeEnsureEnd + 1)

  if (dryRun) {
    log(`  DRY-RUN: Would register preset in presets/index.ts`)
  } else {
    fs.writeFileSync(PRESETS_INDEX, presetsIndex)
    log(`  Registered preset in presets/index.ts`)
  }
}

// =============================================================================
// Stage 5: Asset Handling
// =============================================================================

interface AssetReport {
  figmaAssets: string[]
  localAssets: string[]
}

function analyzeAssets(siteMap: SiteMap): AssetReport {
  const figmaAssets: string[] = []
  const localAssets: string[] = []
  const seen = new Set<string>()

  // Collect all component files to scan
  const filesToScan: string[] = []
  for (const page of siteMap.pages) {
    for (const section of page.sections) {
      filesToScan.push(section.filePath)
    }
  }
  if (siteMap.chrome.header) filesToScan.push(siteMap.chrome.header.filePath)
  if (siteMap.chrome.footer) filesToScan.push(siteMap.chrome.footer.filePath)

  for (const filePath of filesToScan) {
    if (!fs.existsSync(filePath)) continue
    const source = readFile(filePath)

    // Find figma:asset imports
    const figmaRe = /figma:asset\/([^'"]+)/g
    let match: RegExpExecArray | null
    while ((match = figmaRe.exec(source)) !== null) {
      const asset = match[1]
      if (!seen.has(asset)) {
        seen.add(asset)
        figmaAssets.push(asset)
      }
    }

    // Find local asset imports (exclude figma:asset which we already captured)
    const localRe = /from\s+['"]([^'"]+\.(png|jpg|jpeg|gif|svg|webp|avif|mp4|webm))['"]/g
    while ((match = localRe.exec(source)) !== null) {
      const asset = match[1]
      if (!seen.has(asset) && !asset.startsWith('figma:')) {
        seen.add(asset)
        localAssets.push(asset)
      }
    }
  }

  return { figmaAssets, localAssets }
}

// =============================================================================
// Main Pipeline
// =============================================================================

function writeFiles(files: Map<string, string>): number {
  let count = 0
  for (const [filePath, content] of files) {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(filePath, content)
    count++
  }
  return count
}

function main(): void {
  console.log(`\nCreativeshire Engine — Import React Project`)
  console.log(`Preset: ${presetName} (${presetKebab})`)
  console.log(`Input:  ${inputPath}`)
  if (dryRun) console.log('MODE:   DRY RUN (no files will be written)')

  // ─── Stage 1: Analyze ─────────────────────────────────────────────────
  const siteMap = analyzeProject(inputPath)

  // ─── Stage 2: Generate Sections ───────────────────────────────────────
  logSection('Stage 2: Generating section patterns')

  const allSections = new Set<string>()
  const generatedSections = new Map<string, GeneratedSection>()

  for (const page of siteMap.pages) {
    for (const section of page.sections) {
      const sectionName = toSectionName(section.componentName)
      if (allSections.has(sectionName)) continue
      allSections.add(sectionName)

      log(`\n  Section: ${sectionName}`)
      const generated = generateSection(section, inputPath)
      generatedSections.set(sectionName, generated)

      if (generated.files.size > 0) {
        if (dryRun) {
          log(`    DRY-RUN: Would create ${generated.files.size} files`)
          for (const filePath of generated.files.keys()) {
            log(`      ${path.relative(ROOT, filePath)}`)
          }
        } else {
          const count = writeFiles(generated.files)
          log(`    Created ${count} files`)
          registerSection(sectionName)
          registerSectionCss(sectionName)
        }
      }
    }
  }

  // ─── Stage 3: Generate Chrome ─────────────────────────────────────────
  logSection('Stage 3: Generating chrome patterns')

  const generatedChromeResult: { header?: GeneratedChrome; footer?: GeneratedChrome } = {}

  if (siteMap.chrome.header) {
    log(`\n  Header: ${siteMap.chrome.header.componentName}`)
    const header = generateChrome(siteMap.chrome.header, 'header', inputPath)
    generatedChromeResult.header = header

    if (header.files.size > 0) {
      if (dryRun) {
        log(`    DRY-RUN: Would create ${header.files.size} files`)
        for (const filePath of header.files.keys()) {
          log(`      ${path.relative(ROOT, filePath)}`)
        }
      } else {
        const count = writeFiles(header.files)
        log(`    Created ${count} files`)
        registerChrome(header.name)
        registerChromeCss(header.name)
      }
    }
  } else {
    log('  No header chrome detected')
  }

  if (siteMap.chrome.footer) {
    log(`\n  Footer: ${siteMap.chrome.footer.componentName}`)
    const footer = generateChrome(siteMap.chrome.footer, 'footer', inputPath)
    generatedChromeResult.footer = footer

    if (footer.files.size > 0) {
      if (dryRun) {
        log(`    DRY-RUN: Would create ${footer.files.size} files`)
        for (const filePath of footer.files.keys()) {
          log(`      ${path.relative(ROOT, filePath)}`)
        }
      } else {
        const count = writeFiles(footer.files)
        log(`    Created ${count} files`)
        registerChrome(footer.name)
        registerChromeCss(footer.name)
      }
    }
  } else {
    log('  No footer chrome detected')
  }

  // ─── Stage 4: Generate Preset ─────────────────────────────────────────
  logSection('Stage 4: Generating preset')

  const presetFiles = generatePreset(siteMap, generatedSections, generatedChromeResult)

  if (presetFiles.size > 0) {
    if (dryRun) {
      log(`  DRY-RUN: Would create ${presetFiles.size} preset files`)
      for (const filePath of presetFiles.keys()) {
        log(`    ${path.relative(ROOT, filePath)}`)
      }
    } else {
      const count = writeFiles(presetFiles)
      log(`  Created ${count} preset files`)
      registerPresetInIndex()
    }
  }

  // ─── Stage 5: Asset Report ────────────────────────────────────────────
  logSection('Stage 5: Asset report')

  const assets = analyzeAssets(siteMap)

  if (assets.figmaAssets.length > 0) {
    log(`\n  Figma assets (need manual replacement):`)
    for (const asset of assets.figmaAssets) {
      log(`    - figma:asset/${asset}`)
    }
  }

  if (assets.localAssets.length > 0) {
    log(`\n  Local assets (need to be copied to public/):`)
    for (const asset of assets.localAssets) {
      log(`    - ${asset}`)
    }
  }

  if (assets.figmaAssets.length === 0 && assets.localAssets.length === 0) {
    log('  No assets detected (or all inline)')
  }

  // ─── Summary ──────────────────────────────────────────────────────────
  logSection('Summary')

  const sectionCount = allSections.size
  const chromeCount = (generatedChromeResult.header?.files.size ? 1 : 0) + (generatedChromeResult.footer?.files.size ? 1 : 0)
  const pageCount = siteMap.pages.length

  log(`  Sections:  ${sectionCount}`)
  log(`  Chrome:    ${chromeCount}`)
  log(`  Pages:     ${pageCount}`)
  log(`  Preset:    ${presetKebab}`)

  if (dryRun) {
    log(`\n  DRY RUN — no files were written.`)
    log(`  Run without --dry-run to generate files.`)
  } else {
    log(`\nNext steps:`)
    log(`  1. Review imported components in engine/content/sections/patterns/`)
    log(`  2. Fix any TODO comments (asset paths, adapter imports)`)
    log(`  3. Run: npm run test:arch`)
    log(`  4. Run: npm run storybook`)
    log(`  5. Check Storybook for each section under "Imported/" category`)
    log(`  6. Progressively extract hardcoded content into CMS fields`)
  }
}

main()
