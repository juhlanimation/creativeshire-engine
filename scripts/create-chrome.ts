/**
 * Scaffold a new chrome pattern and auto-register it.
 *
 * Usage:
 *   npm run create:chrome StickyNav -- --slot header
 *   npm run create:chrome DrawerMenu -- --slot overlay
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

// =============================================================================
// CLI Parsing
// =============================================================================

const args = process.argv.slice(2)
const name = args.find((a) => !a.startsWith('--'))

if (!name) {
  console.error('Usage: npx tsx scripts/create-chrome.ts <Name> --slot <header|footer|overlay>')
  process.exit(1)
}

if (!/^[A-Z][a-zA-Z0-9]+$/.test(name)) {
  console.error(`Error: Chrome pattern name "${name}" must be PascalCase (e.g. StickyNav)`)
  process.exit(1)
}

const slotIdx = args.indexOf('--slot')
const slot = slotIdx !== -1 && args[slotIdx + 1] ? args[slotIdx + 1] : 'header'

const validSlots = ['header', 'footer', 'overlay']
if (!validSlots.includes(slot)) {
  console.error(`Error: Invalid slot "${slot}". Must be one of: ${validSlots.join(', ')}`)
  process.exit(1)
}

const isOverlay = slot === 'overlay'
const display = toDisplay(name)
const kebab = toKebab(name)

// =============================================================================
// Paths
// =============================================================================

const ROOT = process.cwd()
const ENGINE = path.join(ROOT, 'engine')
const PATTERN_DIR = path.join(ENGINE, 'content/chrome/patterns', name)
const REGISTRY = path.join(ENGINE, 'content/chrome/pattern-registry.ts')
const STYLES_CSS = path.join(ENGINE, 'styles.css')

if (fs.existsSync(PATTERN_DIR)) {
  console.error(`Error: Chrome pattern "${name}" already exists at ${PATTERN_DIR}`)
  process.exit(1)
}

// =============================================================================
// Generate Files
// =============================================================================

fs.mkdirSync(PATTERN_DIR, { recursive: true })

// --- index.ts ---
if (isOverlay) {
  fs.writeFileSync(
    path.join(PATTERN_DIR, 'index.ts'),
    `/**
 * ${name} chrome pattern — factory function for overlay.
 *
 * Structure:
 * - TODO: Describe widget/component hierarchy
 */

import type { PresetOverlayConfig } from '../../../../presets/types'
import type { ${name}Props } from './types'

/**
 * Creates a ${name} overlay configuration.
 *
 * @param props - Overlay configuration
 * @returns PresetOverlayConfig for the overlay slot
 */
export function create${name}Overlay(props?: ${name}Props): PresetOverlayConfig {
  return {
    component: '${name}',
    props: {
      // TODO: Add overlay props
      ...props,
    },
  }
}
`,
  )
} else {
  fs.writeFileSync(
    path.join(PATTERN_DIR, 'index.ts'),
    `/**
 * ${name} chrome pattern — factory function for ${slot} region.
 *
 * Structure:
 * - TODO: Describe widget hierarchy
 */

import type { PresetRegionConfig } from '../../../../presets/types'
import type { ${name}Props } from './types'

/**
 * Creates a ${name} ${slot} region configuration.
 *
 * @param props - Region configuration
 * @returns PresetRegionConfig for the ${slot} region
 */
export function create${name}Region(props?: ${name}Props): PresetRegionConfig {
  return {
    widgets: [
      // TODO: Add widget schemas
    ],
    layout: {
      justify: 'space-between',
      align: 'center',
      padding: '1.5rem 2rem',
      ...props?.layout,
    },
    ...(props?.overlay != null && { overlay: props.overlay }),
    ...(props?.style && { style: props.style }),
  }
}
`,
  )
}

// --- types.ts ---
if (isOverlay) {
  fs.writeFileSync(
    path.join(PATTERN_DIR, 'types.ts'),
    `/**
 * ${name} chrome pattern types.
 * Overlay pattern.
 */

export interface ${name}Props {
  // === Content ===
  // TODO: Add content props
}
`,
  )
} else {
  fs.writeFileSync(
    path.join(PATTERN_DIR, 'types.ts'),
    `/**
 * ${name} chrome pattern types.
 * ${display} region pattern.
 */

import type { CSSProperties } from 'react'
import type { RegionLayout } from '../../../../schema/chrome'

export interface ${name}Props {
  // === Content ===
  // TODO: Add content props

  // === Layout ===
  layout?: Partial<RegionLayout>
  overlay?: boolean
  style?: CSSProperties
}
`,
  )
}

// --- meta.ts ---
const chromeSlotValue = isOverlay ? 'null' : `'${slot}'`
fs.writeFileSync(
  path.join(PATTERN_DIR, 'meta.ts'),
  `import { defineChromeMeta } from '../../../../schema/meta'
import type { ${name}Props } from './types'

export const meta = defineChromeMeta<${name}Props>({
  id: '${name}',
  name: '${display}',
  description: 'TODO: Describe this chrome pattern',
  category: 'chrome-pattern',
  chromeSlot: ${chromeSlotValue},
  icon: '${isOverlay ? 'overlay' : slot}',
  tags: ['chrome', '${isOverlay ? 'overlay' : slot}'],
  component: false,
  settings: {
    // TODO: Add settings
  },
})
`,
)

// --- content.ts ---
fs.writeFileSync(
  path.join(PATTERN_DIR, 'content.ts'),
  `import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { ${name}Props } from './types'

export const content: SectionContentDeclaration<Partial<${name}Props>> = {
  label: '${display}',
  description: 'TODO: Describe this chrome pattern',
  contentFields: [
    // TODO: Declare CMS content fields
  ],
  sampleContent: {
    // TODO: Provide demo data
  },
}
`,
)

// --- preview.ts ---
fs.writeFileSync(
  path.join(PATTERN_DIR, 'preview.ts'),
  `import type { ${name}Props } from './types'

export const previewProps: Partial<${name}Props> = {
  // TODO: Add preview data
}
`,
)

// --- styles.css (only for region patterns, not overlays) ---
if (!isOverlay) {
  fs.writeFileSync(
    path.join(PATTERN_DIR, 'styles.css'),
    `/**
 * ${name} chrome pattern styles.
 *
 * Chrome patterns handle ONLY layout (flex, padding, colors via CSS classes).
 * The chrome renderer wrapper handles ALL positioning.
 * Patterns must NOT set position, top, left, right, z-index.
 *
 * Use cqw/cqh units, NOT vw/vh.
 */

.${kebab} {
  /* Pattern-specific styles here */
}
`,
  )
}

// --- {Name}.stories.tsx (regions only — overlay stories are too custom to scaffold) ---
if (!isOverlay) {
  const CHROME_TITLE_MAP: Record<string, string> = { header: 'Headers', footer: 'Footers' }
  const chromeTitleGroup = CHROME_TITLE_MAP[slot] ?? 'Chrome'
  fs.writeFileSync(
    path.join(PATTERN_DIR, `${name}.stories.tsx`),
    `import { chromePatternStoryConfig, chromePatternStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { create${name}Region } from './index'
import { content } from './content'
import type { ${name}Props } from './types'

const previewProps = content.sampleContent as Partial<${name}Props>
const config = chromePatternStoryConfig(meta, create${name}Region, previewProps)
export default {
  ...config,
  title: '${chromeTitleGroup}/${display}',
  parameters: { ...config.parameters, a11y: { test: 'error' } },
}

export const Default = { args: chromePatternStoryArgs(meta, previewProps, create${name}Region) }
`,
  )
}

console.log(`Created chrome pattern: ${PATTERN_DIR}`)

// =============================================================================
// Auto-register in pattern-registry.ts
// =============================================================================

let registry = fs.readFileSync(REGISTRY, 'utf-8')

// 1. Add meta import — after the last meta import line
const metaImportLine = `import { meta as ${name}Meta } from './patterns/${name}/meta'`
const lastMetaImport = registry.lastIndexOf("import { meta as ")
const lastMetaImportEnd = registry.indexOf('\n', lastMetaImport)
registry =
  registry.slice(0, lastMetaImportEnd + 1) +
  metaImportLine +
  '\n' +
  registry.slice(lastMetaImportEnd + 1)

// 2. Add registry entry — before the closing } of chromePatternRegistry
const factoryName = isOverlay ? `create${name}Overlay` : `create${name}Region`
const registryEntry = `  ${name}: {\n    meta: ${name}Meta as ChromePatternMeta,\n    getFactory: async () => (await import('./patterns/${name}')).${factoryName},\n  },`
const closingBrace = registry.indexOf('\n}', registry.indexOf('export const chromePatternRegistry'))
registry =
  registry.slice(0, closingBrace) +
  '\n' +
  registryEntry +
  registry.slice(closingBrace)

// 3. Add factory re-export — after the last factory re-export
const factoryExport = `export { ${factoryName} } from './patterns/${name}'`
const lastFactoryExport = registry.lastIndexOf("export { create")
const lastFactoryExportEnd = registry.indexOf('\n', lastFactoryExport)
registry =
  registry.slice(0, lastFactoryExportEnd + 1) +
  factoryExport +
  '\n' +
  registry.slice(lastFactoryExportEnd + 1)

// 4. Add type re-export — at the very end
const typeExport = `export type { ${name}Props } from './patterns/${name}/types'`
registry = registry.trimEnd() + '\n' + typeExport + '\n'

fs.writeFileSync(REGISTRY, registry)
console.log(`Registered in: ${REGISTRY}`)

// =============================================================================
// Auto-register CSS in engine/styles.css (only for region patterns)
// =============================================================================

if (!isOverlay) {
  let styles = fs.readFileSync(STYLES_CSS, 'utf-8')

  // Find the chrome Patterns section and append after the last pattern import
  const chromePatternImport = `@import './content/chrome/patterns/${name}/styles.css' layer(chrome);`
  // Find the last chrome pattern CSS import
  const lastChromePatternImport = styles.lastIndexOf("@import './content/chrome/patterns/")
  if (lastChromePatternImport !== -1) {
    const lastChromePatternEnd = styles.indexOf('\n', lastChromePatternImport)
    styles =
      styles.slice(0, lastChromePatternEnd + 1) +
      chromePatternImport +
      '\n' +
      styles.slice(lastChromePatternEnd + 1)
  }

  fs.writeFileSync(STYLES_CSS, styles)
  console.log(`CSS registered in: ${STYLES_CSS}`)
}

console.log(`\nDone! Chrome pattern "${name}" (${slot}) scaffolded and registered.`)
console.log('Next steps:')
console.log(`  1. Edit ${path.join(PATTERN_DIR, 'types.ts')} — add content props`)
console.log(`  2. Edit ${path.join(PATTERN_DIR, 'meta.ts')} — add settings`)
console.log(`  3. Edit ${path.join(PATTERN_DIR, 'index.ts')} — build widget tree`)
console.log(`  4. Edit ${path.join(PATTERN_DIR, 'content.ts')} — declare CMS fields`)
console.log(`  5. Run: npm run test:arch`)
