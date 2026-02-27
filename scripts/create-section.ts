/**
 * Scaffold a new section pattern and auto-register it.
 *
 * Usage:
 *   npm run create:section ProjectHero
 *   npm run create:section ProjectHero -- --category hero
 *   npm run create:section CustomHero -- --react
 *   npm run create:section CustomHero -- --react --category hero
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
  console.error('Usage: npx tsx scripts/create-section.ts <Name> [--category <cat>] [--react]')
  process.exit(1)
}

if (!/^[A-Z][a-zA-Z0-9]+$/.test(name)) {
  console.error(`Error: Section name "${name}" must be PascalCase (e.g. ProjectHero)`)
  process.exit(1)
}

const catIdx = args.indexOf('--category')
const category = catIdx !== -1 && args[catIdx + 1] ? args[catIdx + 1] : 'content'
const isReact = args.includes('--react')

const kebab = toKebab(name)
const display = toDisplay(name)

// =============================================================================
// Paths
// =============================================================================

const ROOT = process.cwd()
const ENGINE = path.join(ROOT, 'engine')
const PATTERN_DIR = path.join(ENGINE, 'content/sections/patterns', name)
const REGISTRY = path.join(ENGINE, 'content/sections/registry.ts')
const STYLES_CSS = path.join(ENGINE, 'styles.css')

if (fs.existsSync(PATTERN_DIR)) {
  console.error(`Error: Section pattern "${name}" already exists at ${PATTERN_DIR}`)
  process.exit(1)
}

// =============================================================================
// Generate Files
// =============================================================================

fs.mkdirSync(PATTERN_DIR, { recursive: true })

if (isReact) {
  // =========================================================================
  // --react variant: React component section wrapping ReactSection
  // =========================================================================

  // --- component.tsx ---
  fs.writeFileSync(
    path.join(PATTERN_DIR, 'component.tsx'),
    `/**
 * ${name} — Custom React component.
 *
 * This component is rendered as an engine section via ReactSection.
 * It handles its own layout, styling, and internal state.
 *
 * Engine theme variables are available via CSS: var(--text-primary), etc.
 * Tailwind utility classes work: className="flex items-center gap-4"
 */

import { forwardRef } from 'react'
import type { WidgetBaseProps } from '../../../../content/widgets/types'

export interface ${name}ComponentProps extends WidgetBaseProps {
  // TODO: Add component props
}

export const ${name}Component = forwardRef<HTMLDivElement, ${name}ComponentProps>(
  function ${name}Component(props, ref) {
    return (
      <div ref={ref} className="section-${kebab}">
        {/* TODO: Your React component content */}
        <h2 style={{ color: 'var(--text-primary)' }}>${display} Section</h2>
      </div>
    )
  },
)
`,
  )

  // --- index.ts (--react variant) ---
  fs.writeFileSync(
    path.join(PATTERN_DIR, 'index.ts'),
    `/**
 * ${name} — React component section.
 * Wraps a custom React component as an engine section via ReactSection.
 */

import type { SectionSchema } from '../../../../schema'
import { registerScopedWidget } from '../../../widgets/registry'
import { createReactSection, type ReactSectionProps } from '../ReactSection'
import { ${name}Component } from './component'

// Register the React component as a scoped widget
registerScopedWidget('${name}__Component', ${name}Component)

// Export a typed factory
export function create${name}Section(props?: Partial<ReactSectionProps>): SectionSchema {
  return {
    ...createReactSection({
      id: props?.id ?? '${kebab}',
      label: props?.label ?? '${display}',
      component: '${name}__Component',
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
    patternId: '${name}',
  }
}
`,
  )

  // --- meta.ts (--react variant, minimal) ---
  fs.writeFileSync(
    path.join(PATTERN_DIR, 'meta.ts'),
    `import { defineSectionMeta } from '../../../../schema/meta'
import type { ReactSectionProps } from '../ReactSection/meta'

export const meta = defineSectionMeta<ReactSectionProps>({
  id: '${name}',
  name: '${display}',
  description: 'Custom React component section',
  category: 'section',
  sectionCategory: '${category}',
  unique: false,
  icon: 'section',
  tags: ['${category}', 'react'],
  component: false,
  ownedFields: ['layout', 'className'],
  settings: {},
})
`,
  )

  // --- types.ts (--react variant, re-export ReactSectionProps) ---
  fs.writeFileSync(
    path.join(PATTERN_DIR, 'types.ts'),
    `/**
 * ${name} types — delegates to ReactSectionProps.
 */

export type { ReactSectionProps } from '../ReactSection/meta'
`,
  )

  // --- content.ts (--react variant, minimal) ---
  fs.writeFileSync(
    path.join(PATTERN_DIR, 'content.ts'),
    `import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { ReactSectionProps } from '../ReactSection/meta'

export const content: SectionContentDeclaration<Partial<ReactSectionProps>> = {
  label: '${display}',
  description: 'Custom React component section. Content is managed by the component itself.',
  contentFields: [],
  sampleContent: {},
}
`,
  )

  // --- styles.css ---
  fs.writeFileSync(
    path.join(PATTERN_DIR, 'styles.css'),
    `/**
 * ${name} section styles.
 *
 * Available theme variables:
 *   var(--text-primary), var(--text-secondary)
 *   var(--bg-primary), var(--bg-secondary)
 *   var(--spacing-sm), var(--spacing-md), var(--spacing-lg), var(--spacing-xl)
 *   var(--font-heading), var(--font-body)
 *
 * Use cqw/cqh units, NOT vw/vh.
 */

.section-${kebab} {
  font-family: var(--font-body, sans-serif);
}
`,
  )

  // --- {Name}.stories.tsx (--react variant) ---
  const sectionTitleCategory = category.charAt(0).toUpperCase() + category.slice(1)
  fs.writeFileSync(
    path.join(PATTERN_DIR, `${name}.stories.tsx`),
    `import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { create${name}Section } from './index'
import { content } from './content'
import type { ReactSectionProps } from '../ReactSection/meta'

// Side-effect import to register the scoped widget
import './index'

const config = sectionStoryConfig(meta, create${name}Section)
export default {
  ...config,
  title: '${sectionTitleCategory}/${display}',
  parameters: { ...config.parameters, a11y: { test: 'error' } },
}

export const Default = { args: sectionStoryArgs(meta, content.sampleContent as Partial<ReactSectionProps>, create${name}Section) }
`,
  )

  console.log(`Created --react section pattern: ${PATTERN_DIR}`)
} else {
  // =========================================================================
  // Standard variant: widget-tree factory section (3-file consolidated)
  //
  // Files:
  //   definition.ts  — Props interface + meta + content declaration
  //   index.ts       — Factory function (imports from definition.ts)
  //   styles.css     — Section CSS
  //   {Name}.stories.tsx — Storybook story
  // =========================================================================

  // --- definition.ts (props + meta + content) ---
  fs.writeFileSync(
    path.join(PATTERN_DIR, 'definition.ts'),
    `import { defineSectionMeta } from '../../../../schema/meta'
import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { BaseSectionProps } from '../base'

// =============================================================================
// Props
// =============================================================================

export interface ${name}Props extends BaseSectionProps {
  // === Content ===
  // TODO: Add content props (use binding expressions for CMS)

  // === Media ===
  // TODO: Add media props if needed
}

// =============================================================================
// Meta
// =============================================================================

export const meta = defineSectionMeta<${name}Props>({
  id: '${name}',
  name: '${display}',
  description: 'TODO: Describe this section pattern',
  category: 'section',
  sectionCategory: '${category}',
  unique: false,
  icon: 'section',
  tags: ['${category}'],
  component: false,
  ownedFields: ['layout', 'className'],
  settings: {
    // TODO: Add settings
  },
})

// =============================================================================
// Content
// =============================================================================

export const content: SectionContentDeclaration<Partial<${name}Props>> = {
  label: '${display}',
  description: 'TODO: Describe this section',

  contentFields: [
    // TODO: Declare CMS content fields with relative paths.
  ],

  sampleContent: {
    // TODO: Provide concrete demo data for previews and development.
  },
}
`,
  )

  // --- index.ts ---
  fs.writeFileSync(
    path.join(PATTERN_DIR, 'index.ts'),
    `/**
 * ${name} pattern - factory function.
 *
 * Structure:
 * - TODO: Describe widget hierarchy
 */

import type { SectionSchema, WidgetSchema } from '../../../../schema'
import { applyMetaDefaults } from '../../../../schema/settings'
import { meta } from './definition'
import type { ${name}Props } from './definition'

export type { ${name}Props }

export function create${name}Section(rawProps?: ${name}Props): SectionSchema {
  const p = applyMetaDefaults(meta, rawProps ?? {})

  // TODO: Build widgets
  const widgets: WidgetSchema[] = []

  return {
    id: p.id ?? '${kebab}',
    patternId: '${name}',
    label: p.label ?? '${display}',
    constrained: p.constrained,
    colorMode: p.colorMode,
    layout: { type: 'stack', direction: 'column', align: 'start' },
    style: p.style,
    className: p.className,
    paddingTop: p.paddingTop,
    paddingBottom: p.paddingBottom,
    paddingLeft: p.paddingLeft,
    paddingRight: p.paddingRight,
    sectionHeight: p.sectionHeight ?? 'auto',
    widgets,
  }
}
`,
  )

  // --- styles.css ---
  fs.writeFileSync(
    path.join(PATTERN_DIR, 'styles.css'),
    `/**
 * ${name} section styles.
 *
 * Available theme variables:
 *   var(--text-primary), var(--text-secondary)
 *   var(--bg-primary), var(--bg-secondary)
 *   var(--spacing-sm), var(--spacing-md), var(--spacing-lg), var(--spacing-xl)
 *   var(--font-heading), var(--font-body)
 *
 * Use cqw/cqh units, NOT vw/vh.
 */

.section-${kebab} {
  /* Section-specific styles here */
}
`,
  )

  // --- {Name}.stories.tsx ---
  const sectionTitleCategory = category.charAt(0).toUpperCase() + category.slice(1)
  fs.writeFileSync(
    path.join(PATTERN_DIR, `${name}.stories.tsx`),
    `import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta, content } from './definition'
import { create${name}Section } from './index'
import type { ${name}Props } from './definition'

const config = sectionStoryConfig(meta, create${name}Section)
export default {
  ...config,
  title: '${sectionTitleCategory}/${display}',
  parameters: { ...config.parameters, a11y: { test: 'error' } },
}

export const Default = { args: sectionStoryArgs(meta, content.sampleContent as Partial<${name}Props>, create${name}Section) }
`,
  )

  console.log(`Created section pattern: ${PATTERN_DIR}`)
}

// =============================================================================
// Auto-register in registry.ts
// =============================================================================

let registry = fs.readFileSync(REGISTRY, 'utf-8')

// 1. Add meta import — after the last meta import line
// New consolidated sections use definition.ts; --react sections still use meta.ts
const metaImportSource = isReact ? 'meta' : 'definition'
const metaImportLine = `import { meta as ${name}Meta } from './patterns/${name}/${metaImportSource}'`
const lastMetaImport = registry.lastIndexOf("import { meta as ")
const lastMetaImportEnd = registry.indexOf('\n', lastMetaImport)
registry =
  registry.slice(0, lastMetaImportEnd + 1) +
  metaImportLine +
  '\n' +
  registry.slice(lastMetaImportEnd + 1)

// 2. Add registry entry — before the closing } of sectionRegistry
const registryEntry = `  ${name}: createEntry('${name}', ${name}Meta as SectionMeta,\n    async () => (await import('./patterns/${name}')).create${name}Section),`
const closingBrace = registry.indexOf('\n}', registry.indexOf('export const sectionRegistry'))
registry =
  registry.slice(0, closingBrace) +
  '\n' +
  registryEntry +
  registry.slice(closingBrace)

// 3. Add factory re-export — after the last factory re-export
const factoryExport = `export { create${name}Section } from './patterns/${name}'`
const lastFactoryExport = registry.lastIndexOf("export { create")
const lastFactoryExportEnd = registry.indexOf('\n', lastFactoryExport)
registry =
  registry.slice(0, lastFactoryExportEnd + 1) +
  factoryExport +
  '\n' +
  registry.slice(lastFactoryExportEnd + 1)

// 4. Add type re-export — at the very end
// For --react, skip since ReactSectionProps is already exported from ReactSection/types
// New consolidated sections export types from definition.ts
if (!isReact) {
  const typeExport = `export type { ${name}Props } from './patterns/${name}/definition'`
  registry = registry.trimEnd() + '\n' + typeExport + '\n'
}

fs.writeFileSync(REGISTRY, registry)
console.log(`Registered in: ${REGISTRY}`)

// =============================================================================
// Auto-register CSS in engine/styles.css
// =============================================================================

let styles = fs.readFileSync(STYLES_CSS, 'utf-8')

// Find the last section pattern CSS import and append after it
const sectionCssImport = `@import './content/sections/patterns/${name}/styles.css' layer(sections);`
const lastSectionImport = styles.lastIndexOf("@import './content/sections/patterns/")
const lastSectionImportEnd = styles.indexOf('\n', lastSectionImport)
styles =
  styles.slice(0, lastSectionImportEnd + 1) +
  sectionCssImport +
  '\n' +
  styles.slice(lastSectionImportEnd + 1)

fs.writeFileSync(STYLES_CSS, styles)
console.log(`CSS registered in: ${STYLES_CSS}`)

console.log(`\nDone! Section "${name}" scaffolded and registered.`)
if (isReact) {
  console.log('Next steps:')
  console.log(`  1. Edit ${path.join(PATTERN_DIR, 'component.tsx')} — build your React component`)
  console.log(`  2. Run: npm run test:arch`)
} else {
  console.log('Next steps:')
  console.log(`  1. Edit ${path.join(PATTERN_DIR, 'definition.ts')} — add props, settings, and content fields`)
  console.log(`  2. Edit ${path.join(PATTERN_DIR, 'index.ts')} — build widget tree`)
  console.log(`  3. Run: npm run test:arch`)
}
