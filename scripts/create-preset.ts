/**
 * Scaffold a new preset and auto-register it.
 *
 * Usage:
 *   npm run create:preset Minimal
 *   npm run create:preset Minimal -- --pages home,about
 */

import fs from 'fs'
import path from 'path'

// =============================================================================
// Helpers
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

// =============================================================================
// CLI Parsing
// =============================================================================

const args = process.argv.slice(2)
const name = args.find((a) => !a.startsWith('--'))

if (!name) {
  console.error('Usage: npx tsx scripts/create-preset.ts <Name> [--pages home,about]')
  process.exit(1)
}

if (!/^[A-Z][a-zA-Z0-9]+$/.test(name)) {
  console.error(`Error: Preset name "${name}" must be PascalCase (e.g. Minimal, DarkPortfolio)`)
  process.exit(1)
}

const pagesIdx = args.indexOf('--pages')
const pageNames = pagesIdx !== -1 && args[pagesIdx + 1]
  ? args[pagesIdx + 1].split(',').map((p) => p.trim())
  : ['home']

const kebab = toKebab(name)
const camel = toCamel(name)
const display = toDisplay(name)

// =============================================================================
// Paths
// =============================================================================

const ROOT = process.cwd()
const ENGINE = path.join(ROOT, 'engine')
const PRESET_DIR = path.join(ENGINE, 'presets', kebab)
const PAGES_DIR = path.join(PRESET_DIR, 'pages')
const PRESETS_INDEX = path.join(ENGINE, 'presets/index.ts')

if (fs.existsSync(PRESET_DIR)) {
  console.error(`Error: Preset "${kebab}" already exists at ${PRESET_DIR}`)
  process.exit(1)
}

// =============================================================================
// Generate Files
// =============================================================================

fs.mkdirSync(PAGES_DIR, { recursive: true })

// --- pages/{page}.ts ---
for (const pageName of pageNames) {
  const pageId = pageName.toLowerCase()
  const slug = pageId === 'home' ? '/' : `/${pageId}`

  fs.writeFileSync(
    path.join(PAGES_DIR, `${pageId}.ts`),
    `import type { PageSchema } from '../../../schema/page'

export const ${pageId}PageTemplate: PageSchema = {
  id: '${pageId}',
  slug: '${slug}',
  head: {
    title: '{{ content.head.title }}',
    description: '{{ content.head.description }}',
  },
  sections: [
    // TODO: Add section factories here
    // Example:
    //   createHeroVideoSection({ colorMode: 'dark' }),
    //   createAboutBioSection({ colorMode: 'light' }),
  ],
}
`,
  )
}

// --- content-contract.ts ---
const contractImports = pageNames.map((p) => `// import { content as ${p}Content } from '../../content/sections/patterns/TODO/content'`).join('\n')

fs.writeFileSync(
  path.join(PRESET_DIR, 'content-contract.ts'),
  `import { buildContentContract } from '../content-utils'

// TODO: Import section content declarations
${contractImports}

export const ${camel}ContentContract = buildContentContract({
  head: {
    label: 'Page Head',
    contentFields: [
      { path: 'title', type: 'text', label: 'Page Title' },
      { path: 'description', type: 'textarea', label: 'Page Description' },
    ],
    sampleContent: {
      title: '${display} Site',
      description: 'A ${display.toLowerCase()} site built with Creativeshire Engine.',
    },
  },
  // TODO: Add section content declarations
  // hero: { ...heroVideoContent },
  // about: { ...aboutBioContent },
})
`,
)

// --- sample-content.ts ---
fs.writeFileSync(
  path.join(PRESET_DIR, 'sample-content.ts'),
  `import { buildSampleContent } from '../content-utils'

export const ${camel}SampleContent = buildSampleContent({
  head: {
    label: 'Page Head',
    contentFields: [
      { path: 'title', type: 'text', label: 'Page Title' },
      { path: 'description', type: 'textarea', label: 'Page Description' },
    ],
    sampleContent: {
      title: '${display} Site',
      description: 'A ${display.toLowerCase()} site built with Creativeshire Engine.',
    },
  },
  // TODO: Add section content declarations (must match content-contract.ts)
})
`,
)

// --- index.ts ---
const pageImports = pageNames
  .map((p) => `import { ${p.toLowerCase()}PageTemplate } from './pages/${p.toLowerCase()}'`)
  .join('\n')

const pageEntries = pageNames
  .map((p) => `      ${p.toLowerCase()}: ${p.toLowerCase()}PageTemplate,`)
  .join('\n')

fs.writeFileSync(
  path.join(PRESET_DIR, 'index.ts'),
  `/**
 * ${display} Preset
 * TODO: Describe this preset.
 */

import type { SitePreset } from '../types'
import { registerPreset, type PresetMeta } from '../registry'
${pageImports}
import { ${camel}ContentContract } from './content-contract'
import { ${camel}SampleContent } from './sample-content'

/**
 * ${display} preset metadata for UI display.
 */
export const ${camel}Meta: PresetMeta = {
  id: '${kebab}',
  name: '${display}',
  description: 'TODO: Describe this preset.',
}

/**
 * ${display} preset - complete site configuration.
 */
export const ${camel}Preset: SitePreset = {
  content: {
    id: '${kebab}-content',
    name: '${display}',
    pages: {
${pageEntries}
    },
    chrome: {
      regions: {
        header: 'hidden',
        footer: 'hidden',
      },
      overlays: {},
    },
    contentContract: ${camel}ContentContract,
    sampleContent: ${camel}SampleContent,
  },
  experience: {
    base: 'simple',
    // TODO: Add behaviour overrides if needed
    // overrides: {
    //   sectionBehaviours: { hero: [{ behaviour: 'scroll/fade' }] },
    // },
  },
  theme: {
    id: '${kebab}-theme',
    name: '${display}',
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
registerPreset(${camel}Meta, ${camel}Preset)

// Content contract export
export { ${camel}ContentContract } from './content-contract'

// Export sample content for dev preview
export { ${camel}SampleContent } from './sample-content'
`,
)

console.log(`Created preset: ${PRESET_DIR}`)

// =============================================================================
// Auto-register in presets/index.ts
// =============================================================================

let presetsIndex = fs.readFileSync(PRESETS_INDEX, 'utf-8')

// 1. Add preset export line after the last preset export
const presetExportLine = `export { ${camel}Preset, ${camel}Meta, ${camel}ContentContract } from './${kebab}'`
const lastPresetExport = presetsIndex.lastIndexOf('export {')
const lastPresetExportLineEnd = presetsIndex.indexOf('\n', lastPresetExport)

// Find the correct block: preset exports are before ensurePresetsRegistered
const ensureIdx = presetsIndex.indexOf('export function ensurePresetsRegistered')
const lastExportBeforeEnsure = presetsIndex.lastIndexOf("export {", ensureIdx)
const lastExportBeforeEnsureEnd = presetsIndex.indexOf('\n', lastExportBeforeEnsure)

presetsIndex =
  presetsIndex.slice(0, lastExportBeforeEnsureEnd + 1) +
  presetExportLine +
  '\n' +
  presetsIndex.slice(lastExportBeforeEnsureEnd + 1)

fs.writeFileSync(PRESETS_INDEX, presetsIndex)
console.log(`Registered in: ${PRESETS_INDEX}`)

console.log(`\nDone! Preset "${kebab}" scaffolded and registered.`)
console.log('Next steps:')
console.log(`  1. Edit ${path.join(PRESET_DIR, 'content-contract.ts')} — import section content declarations`)
for (const pageName of pageNames) {
  console.log(`  2. Edit ${path.join(PAGES_DIR, `${pageName.toLowerCase()}.ts`)} — add section factories + bindings`)
}
console.log(`  3. Edit ${path.join(PRESET_DIR, 'sample-content.ts')} — provide preview data`)
console.log(`  4. Edit ${path.join(PRESET_DIR, 'index.ts')} — configure experience, chrome, theme`)
console.log(`  5. Run: npm run test:arch`)
