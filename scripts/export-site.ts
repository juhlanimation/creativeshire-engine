/**
 * Site Export Script
 *
 * Exports a preset into a standalone, hostable Next.js project.
 * The exported project is a complete app that renders a site
 * from the preset with editable content.
 *
 * Usage:
 *   npm run export:site <preset-id> -- --output <path>
 *   npm run export:site noir -- --output ../my-client-site
 *   npm run export:site noir -- --output ../my-client-site --update
 *
 * Options:
 *   --output, -o   Output directory (required)
 *   --update       Update mode: preserve content.json, regenerate structural files
 *   --name         Site name for package.json (default: derived from output dir)
 *   --git-url      Engine git URL (default: current repo origin)
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

// =============================================================================
// Import engine modules (these run at script time, not in the exported project)
// =============================================================================

// Ensure themes are registered (themes auto-register on import)
import '../engine/themes/index'
// Ensure presets are registered
import '../engine/presets/index'

import { getPreset, getPresetMeta, getPresetIds } from '../engine/presets/registry'
import type { SitePreset } from '../engine/presets/types'

// Export generators
import { generateContentJson, generateContentSchema } from './export/generate-content'
import {
  generateLayout,
  generateProviders,
  generateLibSite,
  generateHomePage,
  generateDynamicPage,
} from './export/generate-app'
import { generateGlobalsCss } from './export/generate-styles'
import {
  generatePackageJson,
  generateNextConfig,
  generateTsConfig,
  generateTailwindConfig,
  generatePostcssConfig,
  generateEngineJson,
} from './export/generate-boilerplate'
import { generateReadme } from './export/generate-readme'

// =============================================================================
// CLI Argument Parsing
// =============================================================================

interface ExportOptions {
  presetId: string
  outputDir: string
  updateMode: boolean
  siteName: string
  gitUrl: string
}

function parseArgs(): ExportOptions {
  const args = process.argv.slice(2)

  // First positional arg is preset ID
  const presetId = args.find(a => !a.startsWith('-'))
  if (!presetId) {
    console.error('Usage: npm run export:site <preset-id> -- --output <path>')
    console.error('')
    console.error('Available presets:')
    for (const id of getPresetIds()) {
      const meta = getPresetMeta(id)
      console.error(`  ${id}  — ${meta?.name ?? ''}`)
    }
    process.exit(1)
  }

  // Parse flags
  let outputDir = ''
  let updateMode = false
  let siteName = ''
  let gitUrl = ''

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if ((arg === '--output' || arg === '-o') && args[i + 1]) {
      outputDir = args[++i]
    } else if (arg === '--update') {
      updateMode = true
    } else if (arg === '--name' && args[i + 1]) {
      siteName = args[++i]
    } else if (arg === '--git-url' && args[i + 1]) {
      gitUrl = args[++i]
    }
  }

  if (!outputDir) {
    console.error('Error: --output <path> is required')
    process.exit(1)
  }

  // Resolve output to absolute path
  outputDir = path.resolve(outputDir)

  // Derive site name from output directory if not provided
  if (!siteName) {
    siteName = path.basename(outputDir)
  }

  // Derive git URL from current repo if not provided
  if (!gitUrl) {
    try {
      const origin = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim()
      // Convert SSH to HTTPS format if needed, append version tag
      gitUrl = origin
    } catch {
      gitUrl = 'github:creativeshire/creativeshire-engine'
    }
  }

  return { presetId, outputDir, updateMode, siteName, gitUrl }
}

// =============================================================================
// File Writing Helpers
// =============================================================================

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function writeFile(filePath: string, content: string, label: string): void {
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`  Created: ${path.relative(process.cwd(), filePath)}  (${label})`)
}

function writeIfNotExists(filePath: string, content: string, label: string): void {
  if (fs.existsSync(filePath)) {
    console.log(`  Skipped: ${path.relative(process.cwd(), filePath)}  (preserved existing ${label})`)
    return
  }
  writeFile(filePath, content, label)
}

// =============================================================================
// Media File Extraction & Copying
// =============================================================================

/** Known media file extensions to detect in content values. */
const MEDIA_EXTENSIONS = new Set([
  '.webp', '.webm', '.mp4', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.avif',
  '.mov', '.avi', '.ico', '.bmp', '.tiff',
])

/**
 * Recursively scan an object for string values that look like local media paths.
 * Returns deduplicated list of paths (e.g. ['/images/photo.webp', '/videos/hero.webm']).
 */
function extractMediaPaths(obj: unknown): string[] {
  const paths = new Set<string>()

  function walk(value: unknown): void {
    if (typeof value === 'string') {
      // Local path: starts with / and has a media extension
      if (value.startsWith('/')) {
        const ext = path.extname(value).toLowerCase()
        if (MEDIA_EXTENSIONS.has(ext)) {
          paths.add(value)
        }
      }
      return
    }
    if (Array.isArray(value)) {
      for (const item of value) walk(item)
      return
    }
    if (value && typeof value === 'object') {
      for (const v of Object.values(value as Record<string, unknown>)) walk(v)
    }
  }

  walk(obj)
  return [...paths].sort()
}

/**
 * Copy media files referenced in sample content from engine public/ to output public/.
 * Skips files that don't exist in the source (external URLs resolved to local paths won't match).
 */
function copyMediaFiles(
  sampleContent: Record<string, unknown>,
  engineRoot: string,
  outputDir: string,
): void {
  const mediaPaths = extractMediaPaths(sampleContent)
  if (mediaPaths.length === 0) return

  let copied = 0
  let skipped = 0
  let totalBytes = 0

  for (const mediaPath of mediaPaths) {
    // mediaPath is like '/clients/logo.webp' → source is engine/public/clients/logo.webp
    const srcFile = path.join(engineRoot, 'public', mediaPath)
    const destFile = path.join(outputDir, 'public', mediaPath)

    if (!fs.existsSync(srcFile)) {
      skipped++
      continue
    }

    ensureDir(path.dirname(destFile))

    // Skip if destination already exists and has same size (idempotent)
    if (fs.existsSync(destFile)) {
      const srcStat = fs.statSync(srcFile)
      const destStat = fs.statSync(destFile)
      if (srcStat.size === destStat.size) {
        skipped++
        continue
      }
    }

    fs.copyFileSync(srcFile, destFile)
    totalBytes += fs.statSync(srcFile).size
    copied++
  }

  // Format size nicely
  const sizeStr = totalBytes > 1024 * 1024
    ? `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`
    : `${(totalBytes / 1024).toFixed(0)} KB`

  if (copied > 0) {
    console.log(`  Copied: ${copied} media files (${sizeStr})`)
  }
  if (skipped > 0) {
    console.log(`  Skipped: ${skipped} media files (already exist or not found)`)
  }
}

// =============================================================================
// Preset Style Detection
// =============================================================================

function hasPresetStyles(presetId: string): boolean {
  const stylesPath = path.resolve(__dirname, `../engine/presets/${presetId}/styles.css`)
  return fs.existsSync(stylesPath)
}

// =============================================================================
// Content Title/Description Extraction
// =============================================================================

function extractSiteMeta(preset: SitePreset): { title: string; description: string } {
  const sample = preset.content.sampleContent
  const head = sample?.head as Record<string, unknown> | undefined
  return {
    title: (head?.title as string) ?? preset.content.name,
    description: (head?.description as string) ?? `Site built with the ${preset.content.name} preset.`,
  }
}

// =============================================================================
// Update Mode: Detect Content Changes
// =============================================================================

function reportContentChanges(outputDir: string, preset: SitePreset): void {
  const contentPath = path.join(outputDir, 'content', 'content.json')
  if (!fs.existsSync(contentPath)) return

  const existing = JSON.parse(fs.readFileSync(contentPath, 'utf-8')) as Record<string, unknown>
  const fresh = preset.content.sampleContent

  const existingKeys = new Set(flattenKeys(existing))
  const freshKeys = new Set(flattenKeys(fresh))

  const added = [...freshKeys].filter(k => !existingKeys.has(k))
  const removed = [...existingKeys].filter(k => !freshKeys.has(k))

  if (added.length === 0 && removed.length === 0) {
    console.log('\n  Content contract unchanged — no field updates needed.')
    return
  }

  if (added.length > 0) {
    console.log('\n  New content fields (add to content.json):')
    for (const key of added) {
      console.log(`    + ${key}`)
    }
  }

  if (removed.length > 0) {
    console.log('\n  Removed content fields (can delete from content.json):')
    for (const key of removed) {
      console.log(`    - ${key}`)
    }
  }
}

function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...flattenKeys(value as Record<string, unknown>, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

// =============================================================================
// Main Export
// =============================================================================

function main(): void {
  const opts = parseArgs()
  const { presetId, outputDir, updateMode, siteName, gitUrl } = opts

  // Validate preset exists
  const preset = getPreset(presetId)
  if (!preset) {
    console.error(`Error: Preset "${presetId}" not found.`)
    console.error('Available presets:')
    for (const id of getPresetIds()) {
      console.error(`  ${id}`)
    }
    process.exit(1)
  }

  const meta = getPresetMeta(presetId)
  const presetName = meta?.name ?? preset.content.name
  const contract = preset.content.contentContract
  const { title: siteTitle, description: siteDescription } = extractSiteMeta(preset)
  const presetHasStyles = hasPresetStyles(presetId)

  // Read engine version from package.json
  const enginePkg = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8')
  )
  const engineVersion = enginePkg.version ?? '0.1.0'

  console.log('')
  console.log(`Exporting site from preset: ${presetId} (${presetName})`)
  console.log(`Output: ${outputDir}`)
  console.log(`Mode: ${updateMode ? 'update (preserving content.json)' : 'fresh export'}`)
  console.log('')

  // Check for existing export in update mode
  if (updateMode) {
    const engineJsonPath = path.join(outputDir, '.engine.json')
    if (!fs.existsSync(engineJsonPath)) {
      console.error('Error: --update specified but no .engine.json found in output directory.')
      console.error('Run without --update for a fresh export.')
      process.exit(1)
    }
    reportContentChanges(outputDir, preset)
  }

  // Check output exists for fresh export
  if (!updateMode && fs.existsSync(outputDir)) {
    const files = fs.readdirSync(outputDir)
    if (files.length > 0 && !files.every(f => f.startsWith('.'))) {
      console.error(`Error: Output directory ${outputDir} is not empty.`)
      console.error('Use --update to update an existing export, or choose an empty directory.')
      process.exit(1)
    }
  }

  // ── Content files ──────────────────────────────────────────────────────
  console.log('Content:')

  if (updateMode) {
    console.log('  Skipped: content/content.json  (preserved in update mode)')
  } else {
    writeFile(
      path.join(outputDir, 'content', 'content.json'),
      JSON.stringify(generateContentJson(preset.content.sampleContent), null, 2) + '\n',
      'editable content',
    )
  }

  writeFile(
    path.join(outputDir, 'content-schema.json'),
    JSON.stringify(generateContentSchema(contract), null, 2) + '\n',
    'content field reference',
  )

  // ── App files ──────────────────────────────────────────────────────────
  console.log('\nApp:')

  writeFile(
    path.join(outputDir, 'app', 'layout.tsx'),
    generateLayout(preset, siteTitle, siteDescription),
    'root layout',
  )

  writeFile(
    path.join(outputDir, 'app', 'globals.css'),
    generateGlobalsCss(presetId, presetHasStyles),
    'global styles',
  )

  writeFile(
    path.join(outputDir, 'app', 'providers.tsx'),
    generateProviders(),
    'engine providers',
  )

  writeFile(
    path.join(outputDir, 'app', 'page.tsx'),
    generateHomePage(),
    'home page',
  )

  // Only generate dynamic route if preset has multiple pages
  const pageSlugs = Object.values(preset.content.pages).map(p => p.slug)
  const hasMultiplePages = pageSlugs.some(s => s !== '/')
  if (hasMultiplePages) {
    writeFile(
      path.join(outputDir, 'app', '[slug]', 'page.tsx'),
      generateDynamicPage(),
      'dynamic page route',
    )
  }

  // ── Lib files ──────────────────────────────────────────────────────────
  console.log('\nLib:')

  writeFile(
    path.join(outputDir, 'lib', 'site.ts'),
    generateLibSite(presetId),
    'site resolution',
  )

  // ── Boilerplate ────────────────────────────────────────────────────────
  console.log('\nBoilerplate:')

  writeFile(
    path.join(outputDir, 'package.json'),
    generatePackageJson(siteName, gitUrl),
    'package.json',
  )

  writeFile(
    path.join(outputDir, 'next.config.ts'),
    generateNextConfig(),
    'Next.js config',
  )

  writeFile(
    path.join(outputDir, 'tsconfig.json'),
    generateTsConfig(),
    'TypeScript config',
  )

  writeFile(
    path.join(outputDir, 'tailwind.config.ts'),
    generateTailwindConfig(),
    'Tailwind config',
  )

  writeFile(
    path.join(outputDir, 'postcss.config.mjs'),
    generatePostcssConfig(),
    'PostCSS config',
  )

  writeFile(
    path.join(outputDir, '.engine.json'),
    generateEngineJson(presetId, engineVersion),
    'export metadata',
  )

  // ── Media files ──────────────────────────────────────────────────────────
  console.log('\nMedia:')
  const engineRoot = path.resolve(__dirname, '..')
  copyMediaFiles(preset.content.sampleContent, engineRoot, outputDir)

  // ── README ──────────────────────────────────────────────────────────────
  console.log('\nDocs:')

  writeFile(
    path.join(outputDir, 'README.md'),
    generateReadme(presetId, presetName, contract),
    'README',
  )

  // ── .gitignore ──────────────────────────────────────────────────────────
  writeIfNotExists(
    path.join(outputDir, '.gitignore'),
    generateGitignore(),
    '.gitignore',
  )

  // ── Done ────────────────────────────────────────────────────────────────
  console.log('')
  console.log('Export complete! Next steps:')
  console.log('')
  console.log(`  cd ${path.relative(process.cwd(), outputDir)}`)
  console.log('  npm install')
  console.log('  npm run dev')
  console.log('')
  console.log('Edit content/content.json to customize your site.')
  console.log('')
}

function generateGitignore(): string {
  return `# dependencies
node_modules/
.pnp
.pnp.js

# next.js
.next/
out/

# build
dist/

# misc
.DS_Store
*.tsbuildinfo
next-env.d.ts

# env
.env*.local
`
}

// Run
main()
