#!/usr/bin/env npx tsx
/**
 * Engine Inventory Report
 *
 * Generates a comprehensive report of all engine components.
 *
 * Usage:
 *   npx tsx scripts/inventory.ts
 */

import fs from 'fs/promises'
import path from 'path'
import fg from 'fast-glob'

const ROOT = process.cwd()
const ENGINE = path.join(ROOT, 'engine')

interface ComponentInfo {
  name: string
  path: string
  hasIndex: boolean
  hasTypes: boolean
  hasMeta: boolean
  hasStyles: boolean
  hasDataBinding: boolean
  bindingProps: string[]
  /** Props marked as bindable: true in meta.ts (CMS-editable content props) */
  bindableProps: string[]
  files: string[]
}

interface CategoryInfo {
  category: string
  description: string
  components: ComponentInfo[]
}

/**
 * Data schema field information
 */
interface SchemaField {
  name: string
  type: string
  required: boolean
  description?: string
}

/**
 * Data schema (interface) information
 */
interface DataSchema {
  name: string
  description?: string
  fields: SchemaField[]
  sourcePath: string
  usedBy: string[]
}

/**
 * Extract data schemas (interfaces) from a types.ts file
 * Finds interfaces that are used as array item types
 */
async function extractDataSchemas(typesPath: string): Promise<DataSchema[]> {
  try {
    const content = await fs.readFile(typesPath, 'utf-8')
    const schemas: DataSchema[] = []

    // Find all interface definitions
    // Pattern: export interface Name { ... } or interface Name { ... }
    const interfaceRegex = /(?:export\s+)?interface\s+(\w+)\s*(?:extends\s+\w+\s*)?\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/g

    let match
    while ((match = interfaceRegex.exec(content)) !== null) {
      const [, name, body] = match

      // Skip interfaces that aren't CMS data schemas
      if (
        name.endsWith('Props') ||
        name.endsWith('Config') ||
        name.endsWith('Payload') ||      // Internal event payloads
        name.endsWith('Controls') ||      // Internal control interfaces
        name.endsWith('Styles') ||        // Internal style interfaces
        name === 'WidgetBaseProps' ||
        name === 'LayoutStyles'           // Internal layout helpers
      ) continue

      // Parse fields from the interface body
      const fields: SchemaField[] = []
      const fieldRegex = /\/\*\*\s*([^*]*(?:\*(?!\/)[^*]*)*)\*\/\s*(\w+)(\?)?:\s*([^;\n]+)/g

      let fieldMatch
      while ((fieldMatch = fieldRegex.exec(body)) !== null) {
        const [, comment, fieldName, optional, fieldType] = fieldMatch
        fields.push({
          name: fieldName,
          type: fieldType.trim(),
          required: !optional,
          description: comment?.replace(/\s*\*\s*/g, ' ').trim(),
        })
      }

      // Also match fields without JSDoc comments
      const simpleFieldRegex = /^\s*(\w+)(\?)?:\s*([^;\n]+)/gm
      while ((fieldMatch = simpleFieldRegex.exec(body)) !== null) {
        const [, fieldName, optional, fieldType] = fieldMatch
        // Skip if already added from JSDoc pattern
        if (!fields.some(f => f.name === fieldName)) {
          fields.push({
            name: fieldName,
            type: fieldType.trim(),
            required: !optional,
          })
        }
      }

      if (fields.length > 0) {
        schemas.push({
          name,
          fields,
          sourcePath: typesPath,
          usedBy: [],
        })
      }
    }

    return schemas
  } catch {
    return []
  }
}

/**
 * Detect data binding props in types.ts
 * Looks for patterns like: `propName: SomeType[] | string`
 * This indicates the prop accepts either an array OR a binding expression
 */
async function detectBindingProps(typesPath: string): Promise<string[]> {
  try {
    const content = await fs.readFile(typesPath, 'utf-8')
    const bindingProps: string[] = []

    // Match patterns like: propName: SomeType[] | string
    // or: propName: string | SomeType[]
    const regex = /(\w+):\s*(?:\w+\[\]\s*\|\s*string|string\s*\|\s*\w+\[\])/g
    let match
    while ((match = regex.exec(content)) !== null) {
      bindingProps.push(match[1])
    }

    return bindingProps
  } catch {
    return []
  }
}

/**
 * Detect bindable props from meta.ts
 * Looks for settings with `bindable: true` flag
 * These are CMS-editable content props (src, content, label, href, etc.)
 */
async function detectBindableProps(metaPath: string): Promise<string[]> {
  try {
    const content = await fs.readFile(metaPath, 'utf-8')
    const bindableProps: string[] = []

    // Strategy: Find all prop names followed by { ... bindable: true ... }
    // We need to handle nested objects, so we track brace depth

    const lines = content.split('\n')
    let currentProp: string | null = null
    let braceDepth = 0
    let inSettings = false
    let currentPropContent = ''

    for (const line of lines) {
      // Detect start of settings block
      if (line.includes('settings:') && line.includes('{')) {
        inSettings = true
        braceDepth = 1
        continue
      }

      if (!inSettings) continue

      // Count braces
      const openBraces = (line.match(/\{/g) || []).length
      const closeBraces = (line.match(/\}/g) || []).length

      // Detect new prop at depth 1 (direct child of settings)
      if (braceDepth === 1) {
        const propMatch = line.match(/^\s*(\w+):\s*\{/)
        if (propMatch) {
          currentProp = propMatch[1]
          currentPropContent = line
        }
      }

      braceDepth += openBraces - closeBraces

      // Accumulate content for current prop
      if (currentProp) {
        currentPropContent += '\n' + line
      }

      // End of current prop's object
      if (currentProp && braceDepth === 1 && closeBraces > 0) {
        if (/bindable:\s*true/.test(currentPropContent)) {
          bindableProps.push(currentProp)
        }
        currentProp = null
        currentPropContent = ''
      }

      // End of settings block
      if (braceDepth === 0) {
        break
      }
    }

    return bindableProps
  } catch {
    return []
  }
}

async function getComponentInfo(folderPath: string): Promise<ComponentInfo> {
  const name = path.basename(folderPath)
  const relPath = path.relative(ENGINE, folderPath).replace(/\\/g, '/')

  const files = await fg('*', { cwd: folderPath, onlyFiles: true })

  // Detect data binding props from types.ts (array props with | string)
  const typesPath = path.join(folderPath, 'types.ts')
  const bindingProps = await detectBindingProps(typesPath)

  // Detect bindable props from meta.ts (CMS-editable content props)
  const metaPath = path.join(folderPath, 'meta.ts')
  const bindableProps = await detectBindableProps(metaPath)

  return {
    name,
    path: relPath,
    hasIndex: files.some(f => f.startsWith('index.')),
    hasTypes: files.includes('types.ts'),
    hasMeta: files.includes('meta.ts'),
    hasStyles: files.some(f => f.endsWith('.css')),
    hasDataBinding: bindingProps.length > 0,
    bindingProps,
    bindableProps,
    files,
  }
}

async function getFolders(pattern: string): Promise<string[]> {
  return fg(pattern, {
    cwd: ENGINE,
    absolute: true,
    onlyDirectories: true,
  })
}

async function getFiles(pattern: string): Promise<string[]> {
  return fg(pattern, {
    cwd: ENGINE,
    absolute: true,
    onlyFiles: true,
  })
}

async function generateInventory(): Promise<CategoryInfo[]> {
  const categories: CategoryInfo[] = []

  // Widgets - Primitives
  const primitives = await getFolders('content/widgets/primitives/*')
  categories.push({
    category: 'Widgets: Primitives',
    description: 'Basic building blocks (Text, Image, Icon, Button, Link)',
    components: await Promise.all(primitives.map(getComponentInfo)),
  })

  // Widgets - Layout
  const layouts = await getFolders('content/widgets/layout/*')
  categories.push({
    category: 'Widgets: Layout',
    description: 'Structural containers (Flex, Stack, Grid, Split, Container, Box)',
    components: await Promise.all(layouts.map(getComponentInfo)),
  })

  // Widgets - Interactive
  const interactive = await getFolders('content/widgets/interactive/*')
  categories.push({
    category: 'Widgets: Interactive',
    description: 'Stateful React components (Video, VideoPlayer, EmailCopy, etc.)',
    components: await Promise.all(interactive.map(getComponentInfo)),
  })

  // Sections
  const sections = await getFolders('content/sections/patterns/*')
  categories.push({
    category: 'Sections',
    description: 'Page section patterns (Hero, About, FeaturedProjects, etc.)',
    components: await Promise.all(sections.map(getComponentInfo)),
  })

  // Chrome - Patterns
  const patterns = await getFolders('content/chrome/patterns/*')
  categories.push({
    category: 'Chrome: Patterns',
    description: 'Widget-based region factories (FixedNav, ContactFooter, etc.)',
    components: await Promise.all(patterns.map(getComponentInfo)),
  })

  // Chrome - Overlays
  const overlays = await getFolders('content/chrome/overlays/*')
  categories.push({
    category: 'Chrome: Overlays',
    description: 'Modal, CursorLabel, NavTimeline, SlideIndicators',
    components: await Promise.all(overlays.map(getComponentInfo)),
  })

  // Behaviours
  const behaviourFolders = ['scroll', 'hover', 'visibility', 'animation', 'interaction']
  const behaviours: ComponentInfo[] = []
  for (const trigger of behaviourFolders) {
    const files = await getFiles(`experience/behaviours/${trigger}/*.ts`)
    for (const file of files) {
      if (file.endsWith('index.ts') || file.endsWith('types.ts')) continue
      const name = path.basename(file, '.ts')
      behaviours.push({
        name: `${trigger}/${name}`,
        path: path.relative(ENGINE, file).replace(/\\/g, '/'),
        hasIndex: false,
        hasTypes: false,
        hasMeta: false,
        hasStyles: false,
        hasDataBinding: false,
        bindingProps: [],
        bindableProps: [],
        files: [path.basename(file)],
      })
    }
  }
  categories.push({
    category: 'Behaviours',
    description: 'L2 trigger-based behaviours (scroll/, hover/, visibility/, etc.)',
    components: behaviours,
  })

  // Effects
  const effectFiles = await getFiles('experience/effects/**/*.css')
  const effects: ComponentInfo[] = effectFiles
    .filter(f => !f.endsWith('index.css'))
    .map(file => ({
      name: path.relative(path.join(ENGINE, 'experience/effects'), file).replace(/\\/g, '/').replace('.css', ''),
      path: path.relative(ENGINE, file).replace(/\\/g, '/'),
      hasIndex: false,
      hasTypes: false,
      hasMeta: false,
      hasStyles: true,
      hasDataBinding: false,
      bindingProps: [],
      bindableProps: [],
      files: [path.basename(file)],
    }))
  categories.push({
    category: 'Effects',
    description: 'L2 CSS animations (fade, transform/, mask/, emphasis/)',
    components: effects,
  })

  // Experiences
  const experiences = await getFiles('experience/experiences/*.ts')
  categories.push({
    category: 'Experiences',
    description: 'Experience definitions (stacking, slideshow, infinite-carousel)',
    components: experiences
      .filter(f => !f.includes('index.ts') && !f.includes('types.ts') && !f.includes('registry.ts'))
      .map(file => ({
        name: path.basename(file, '.ts'),
        path: path.relative(ENGINE, file).replace(/\\/g, '/'),
        hasIndex: false,
        hasTypes: false,
        hasMeta: false,
        hasStyles: false,
        hasDataBinding: false,
        bindingProps: [],
        bindableProps: [],
        files: [path.basename(file)],
      })),
  })

  // Drivers
  const drivers = await getFiles('experience/drivers/*.ts')
  categories.push({
    category: 'Drivers',
    description: 'Infrastructure (ScrollDriver, MomentumDriver, SmoothScrollProvider)',
    components: drivers
      .filter(f => !f.includes('index.ts') && !f.includes('types.ts'))
      .map(file => ({
        name: path.basename(file, '.ts').replace('.tsx', ''),
        path: path.relative(ENGINE, file).replace(/\\/g, '/'),
        hasIndex: false,
        hasTypes: false,
        hasMeta: false,
        hasStyles: false,
        hasDataBinding: false,
        bindingProps: [],
        bindableProps: [],
        files: [path.basename(file)],
      })),
  })

  // Triggers
  const triggers = await getFiles('experience/triggers/*.ts')
  categories.push({
    category: 'Triggers',
    description: 'React hooks for behaviours (useScrollProgress, useIntersection, etc.)',
    components: triggers
      .filter(f => !f.includes('index.ts') && !f.includes('types.ts'))
      .map(file => ({
        name: path.basename(file, '.ts'),
        path: path.relative(ENGINE, file).replace(/\\/g, '/'),
        hasIndex: false,
        hasTypes: false,
        hasMeta: false,
        hasStyles: false,
        hasDataBinding: false,
        bindingProps: [],
        bindableProps: [],
        files: [path.basename(file)],
      })),
  })

  // Presets
  const presets = await getFolders('presets/*')
  categories.push({
    category: 'Presets',
    description: 'Site templates (noir, prism, loft)',
    components: await Promise.all(presets.map(async (p) => {
      const name = path.basename(p)
      const files = await fg('**/*', { cwd: p, onlyFiles: true })
      return {
        name,
        path: path.relative(ENGINE, p).replace(/\\/g, '/'),
        hasIndex: files.includes('index.ts'),
        hasTypes: false,
        hasMeta: false,
        hasStyles: files.some(f => f.endsWith('.css')),
        hasDataBinding: false,
        bindingProps: [],
        bindableProps: [],
        files: files.slice(0, 10).concat(files.length > 10 ? [`... +${files.length - 10} more`] : []),
      }
    })),
  })

  return categories
}

function generateMarkdown(categories: CategoryInfo[]): string {
  const lines: string[] = []

  lines.push('# Creativeshire Engine Inventory')
  lines.push('')
  lines.push(`**Generated:** ${new Date().toLocaleString()}`)
  lines.push('')

  // Summary
  const totalComponents = categories.reduce((sum, c) => sum + c.components.length, 0)
  lines.push('## Summary')
  lines.push('')
  lines.push('| Category | Count |')
  lines.push('|----------|-------|')
  for (const cat of categories) {
    lines.push(`| ${cat.category} | ${cat.components.length} |`)
  }
  lines.push(`| **Total** | **${totalComponents}** |`)
  lines.push('')

  // Details
  for (const cat of categories) {
    lines.push('---')
    lines.push('')
    lines.push(`## ${cat.category}`)
    lines.push('')
    lines.push(`> ${cat.description}`)
    lines.push('')

    if (cat.components.length === 0) {
      lines.push('*No components*')
      lines.push('')
      continue
    }

    // Check if this is a component category (has structure files)
    const hasStructure = cat.components.some(c => c.hasIndex || c.hasTypes || c.hasMeta)

    if (hasStructure) {
      // Always show CMS Editable column for consistency
      lines.push('| Component | Path | index | types | meta | styles | CMS Editable |')
      lines.push('|-----------|------|:-----:|:-----:|:----:|:------:|:-------------|')
      for (const comp of cat.components) {
        const idx = comp.hasIndex ? '✅' : '❌'
        const types = comp.hasTypes ? '✅' : '❌'
        const meta = comp.hasMeta ? '✅' : '❌'
        const styles = comp.hasStyles ? '✅' : '—'

        // Combine bindable (scalar) and binding (array) props
        const allBindable: string[] = []
        if (comp.bindableProps.length > 0) {
          allBindable.push(...comp.bindableProps)
        }
        if (comp.bindingProps.length > 0) {
          allBindable.push(...comp.bindingProps.map(p => `${p}[]`))
        }

        const editable = allBindable.length > 0 ? `\`${allBindable.join('`, `')}\`` : '—'
        lines.push(`| **${comp.name}** | \`${comp.path}\` | ${idx} | ${types} | ${meta} | ${styles} | ${editable} |`)
      }
    } else {
      lines.push('| Name | Path |')
      lines.push('|------|------|')
      for (const comp of cat.components) {
        lines.push(`| **${comp.name}** | \`${comp.path}\` |`)
      }
    }
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Collect all data schemas from types.ts files
 */
async function collectDataSchemas(): Promise<DataSchema[]> {
  const allSchemas: Map<string, DataSchema> = new Map()

  // Scan all types.ts files
  const typesFiles = await fg('content/**/types.ts', {
    cwd: ENGINE,
    absolute: true,
  })

  for (const file of typesFiles) {
    const schemas = await extractDataSchemas(file)
    const relPath = path.relative(ENGINE, file).replace(/\\/g, '/')
    const componentName = path.basename(path.dirname(file))

    for (const schema of schemas) {
      // Merge schemas with same name (might be defined in multiple places)
      if (allSchemas.has(schema.name)) {
        const existing = allSchemas.get(schema.name)!
        existing.usedBy.push(componentName)
      } else {
        schema.sourcePath = relPath
        schema.usedBy = [componentName]
        allSchemas.set(schema.name, schema)
      }
    }
  }

  return Array.from(allSchemas.values())
}

/**
 * Generate markdown for data schemas section
 */
function generateSchemasMarkdown(schemas: DataSchema[]): string {
  const lines: string[] = []

  lines.push('---')
  lines.push('')
  lines.push('## Data Schemas')
  lines.push('')
  lines.push('> TypeScript interfaces used in array props. These define the fields for CMS data entry.')
  lines.push('')

  // Sort schemas alphabetically
  const sortedSchemas = schemas.sort((a, b) => a.name.localeCompare(b.name))

  for (const schema of sortedSchemas) {
    lines.push(`### \`${schema.name}\``)
    lines.push('')
    lines.push(`**Used by:** ${schema.usedBy.join(', ')}`)
    lines.push('')
    lines.push('| Field | Type | Required | Description |')
    lines.push('|-------|------|:--------:|-------------|')

    for (const field of schema.fields) {
      const req = field.required ? '✅' : '—'
      const desc = field.description || '—'
      // Escape pipe characters in type
      const typeStr = field.type.replace(/\|/g, '\\|')
      lines.push(`| \`${field.name}\` | \`${typeStr}\` | ${req} | ${desc} |`)
    }

    lines.push('')
  }

  return lines.join('\n')
}

async function main() {
  console.log('📦 Generating Engine Inventory...\n')

  const categories = await generateInventory()
  const schemas = await collectDataSchemas()

  let markdown = generateMarkdown(categories)

  // Add data schemas section
  if (schemas.length > 0) {
    markdown += '\n' + generateSchemasMarkdown(schemas)
  }

  // Write report
  const reportsDir = path.join(ROOT, 'scripts', 'reports')
  await fs.mkdir(reportsDir, { recursive: true })

  const outputPath = path.join(reportsDir, 'inventory.md')
  await fs.writeFile(outputPath, markdown, 'utf-8')

  console.log(`✅ Report written to: ${outputPath}`)

  // Print summary
  const totalComponents = categories.reduce((sum, c) => sum + c.components.length, 0)
  console.log(`\n📊 Total: ${totalComponents} components across ${categories.length} categories`)
  console.log(`📋 Data Schemas: ${schemas.length} types`)
}

main().catch(console.error)
