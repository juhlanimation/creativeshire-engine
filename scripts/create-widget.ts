/**
 * Scaffold a new global widget and auto-register it.
 *
 * Usage:
 *   npm run create:widget ContactBar -- --category interactive
 *   npm run create:widget Accordion -- --category interactive
 *
 * Creates: index.tsx, types.ts, meta.ts, styles.css
 * Registers in: widgets/registry.ts, widgets/meta-registry.ts, engine/styles.css
 */

import fs from 'fs'
import path from 'path'
import {
  toKebab,
  toDisplay,
  ensureNotExists,
  insertAfterLastMatch,
  logCreated,
  logRegistered,
  logNextSteps,
} from './scaffold-utils'

// =============================================================================
// CLI Parsing
// =============================================================================

const args = process.argv.slice(2)
const name = args.find((a) => !a.startsWith('--'))

if (!name) {
  console.error('Usage: npx tsx scripts/create-widget.ts <Name> --category <category>')
  console.error('  Categories: primitives, layout, interactive, repeaters')
  process.exit(1)
}

if (!/^[A-Z][a-zA-Z0-9]+$/.test(name)) {
  console.error(`Error: Widget name "${name}" must be PascalCase (e.g. ContactBar, Accordion)`)
  process.exit(1)
}

const catIdx = args.indexOf('--category')
const category = catIdx !== -1 && args[catIdx + 1] ? args[catIdx + 1] : null

const VALID_CATEGORIES = ['primitives', 'layout', 'interactive', 'repeaters'] as const
type WidgetCategory = (typeof VALID_CATEGORIES)[number]

if (!category || !VALID_CATEGORIES.includes(category as WidgetCategory)) {
  console.error(`Error: --category is required. Must be one of: ${VALID_CATEGORIES.join(', ')}`)
  process.exit(1)
}

const kebab = toKebab(name)
const display = toDisplay(name)

// Map folder names to meta category values
const META_CATEGORY_MAP: Record<string, string> = {
  primitives: 'primitive',
  layout: 'layout',
  interactive: 'interactive',
  repeaters: 'repeater',
}
const metaCategory = META_CATEGORY_MAP[category] ?? category

// =============================================================================
// Paths
// =============================================================================

const ROOT = process.cwd()
const ENGINE = path.join(ROOT, 'engine')
const WIDGET_DIR = path.join(ENGINE, 'content/widgets', category, name)
const REGISTRY = path.join(ENGINE, 'content/widgets/registry.ts')
const META_REGISTRY = path.join(ENGINE, 'content/widgets/meta-registry.ts')
const STYLES_CSS = path.join(ENGINE, 'styles.css')

ensureNotExists(WIDGET_DIR, `Widget "${name}"`)

// =============================================================================
// Category Comment Anchors
// =============================================================================

// These map folder categories to the comment anchors in registry files
const REGISTRY_IMPORT_ANCHOR: Record<string, string> = {
  primitives: '// Primitives (leaf nodes)',
  layout: '// Layout (containers)',
  interactive: '// Interactive (stateful widgets)',
  repeaters: '// Repeaters (array-to-widget)',
}

const REGISTRY_ENTRY_ANCHOR: Record<string, string> = {
  primitives: '// Primitives',
  layout: '// Layout',
  interactive: '// Interactive',
  repeaters: '// Repeaters',
}

// Relative import paths from registry.ts to category folder
const IMPORT_PATH_PREFIX: Record<string, string> = {
  primitives: './primitives',
  layout: './layout',
  interactive: './interactive',
  repeaters: './repeaters',
}

// =============================================================================
// Generate Files
// =============================================================================

fs.mkdirSync(WIDGET_DIR, { recursive: true })

// --- index.tsx ---
fs.writeFileSync(
  path.join(WIDGET_DIR, 'index.tsx'),
  `'use client'

/**
 * ${name} widget — TODO: describe.
 */

import React, { memo, forwardRef } from 'react'
import type { ${name}Props } from './types'
import './styles.css'

const ${name} = memo(forwardRef<HTMLElement, ${name}Props>(function ${name}(
  {
    className,
    style,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={['${kebab}', className].filter(Boolean).join(' ')}
      style={style}
      data-behaviour={dataBehaviour}
    >
      {/* TODO: Implement widget */}
    </div>
  )
}))

export default ${name}
`,
)

// --- types.ts ---
fs.writeFileSync(
  path.join(WIDGET_DIR, 'types.ts'),
  `/**
 * ${name} widget types.
 */

import type { WidgetBaseProps } from '../../types'

export interface ${name}Props extends WidgetBaseProps {
  // TODO: Add widget-specific props
}
`,
)

// --- meta.ts ---
fs.writeFileSync(
  path.join(WIDGET_DIR, 'meta.ts'),
  `/**
 * ${name} widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { ${name}Props } from './types'

export const meta = defineMeta<${name}Props>({
  id: '${name}',
  name: '${display}',
  description: 'TODO: Describe this widget',
  category: '${metaCategory}',
  icon: 'component',
  tags: ['${kebab}'],
  component: true,

  settings: {
    // TODO: Add settings
  },
})
`,
)

// --- styles.css ---
fs.writeFileSync(
  path.join(WIDGET_DIR, 'styles.css'),
  `/**
 * ${name} widget styles.
 *
 * Available theme variables:
 *   var(--text-primary), var(--text-secondary)
 *   var(--bg-primary), var(--bg-secondary)
 *   var(--spacing-sm), var(--spacing-md), var(--spacing-lg), var(--spacing-xl)
 *
 * Use cqw/cqh units, NOT vw/vh.
 */

.${kebab} {
  /* Widget-specific styles here */
}
`,
)

// --- {Name}.stories.tsx ---
const widgetTitleCategory = category.charAt(0).toUpperCase() + category.slice(1)
fs.writeFileSync(
  path.join(WIDGET_DIR, `${name}.stories.tsx`),
  `import { widgetStoryConfig, widgetStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'

const config = widgetStoryConfig('${name}', meta)
export default {
  ...config,
  title: '${widgetTitleCategory}/${display}',
  parameters: { ...config.parameters, a11y: { test: 'error' } },
}

export const Default = { args: widgetStoryArgs('${name}', meta) }
`,
)

logCreated('widget', WIDGET_DIR)

// =============================================================================
// Auto-register in widgets/registry.ts
// =============================================================================

let registry = fs.readFileSync(REGISTRY, 'utf-8')

// 1. Add component import — after the last import in matching category block
const importLine = `import ${name} from './${category}/${name}'`
const categoryImportAnchor = REGISTRY_IMPORT_ANCHOR[category]

// Find all imports for this category and insert after the last one
const importPrefix = `import ${''}`  // avoid self-match
const categoryImportStart = registry.indexOf(categoryImportAnchor)
if (categoryImportStart !== -1) {
  // Find the next category comment or the type/eslint line to know where this category's imports end
  const categoryKeys = Object.keys(REGISTRY_IMPORT_ANCHOR)
  const currentCatIdx = categoryKeys.indexOf(category)
  let categoryImportEnd: number

  if (currentCatIdx < categoryKeys.length - 1) {
    // Find start of next category's comment
    const nextAnchor = REGISTRY_IMPORT_ANCHOR[categoryKeys[currentCatIdx + 1]]
    categoryImportEnd = registry.indexOf(nextAnchor, categoryImportStart)
  } else {
    // Last category — find the eslint or type line
    categoryImportEnd = registry.indexOf('// eslint-disable-next', categoryImportStart)
    if (categoryImportEnd === -1) categoryImportEnd = registry.indexOf('type WidgetComponent', categoryImportStart)
  }

  // Find the last import line before this boundary
  const blockSlice = registry.slice(categoryImportStart, categoryImportEnd)
  const lastImportInBlock = blockSlice.lastIndexOf('\nimport ')
  if (lastImportInBlock !== -1) {
    const absolutePos = categoryImportStart + lastImportInBlock
    const lineEnd = registry.indexOf('\n', absolutePos + 1)
    registry = registry.slice(0, lineEnd + 1) + importLine + '\n' + registry.slice(lineEnd + 1)
  }
}

// 2. Add entry in widgetRegistry object — after the last entry in matching category block
const entryAnchor = REGISTRY_ENTRY_ANCHOR[category]
const registryObjStart = registry.indexOf('export const widgetRegistry')
if (registryObjStart !== -1) {
  const categoryEntryStart = registry.indexOf(entryAnchor, registryObjStart)
  if (categoryEntryStart !== -1) {
    // Find entries for this category — they end at the next category comment or closing brace
    const categoryEntryKeys = Object.keys(REGISTRY_ENTRY_ANCHOR)
    const currentEntryIdx = categoryEntryKeys.indexOf(category)
    let categoryEntryEnd: number

    if (currentEntryIdx < categoryEntryKeys.length - 1) {
      const nextEntryAnchor = REGISTRY_ENTRY_ANCHOR[categoryEntryKeys[currentEntryIdx + 1]]
      categoryEntryEnd = registry.indexOf(nextEntryAnchor, categoryEntryStart + 1)
    } else {
      categoryEntryEnd = registry.indexOf('\n}', categoryEntryStart)
    }

    // Find the last non-empty line in this category block
    const entryBlock = registry.slice(categoryEntryStart, categoryEntryEnd)
    const entryLines = entryBlock.split('\n')
    let lastEntryLineOffset = 0
    for (let i = entryLines.length - 1; i >= 0; i--) {
      const trimmed = entryLines[i].trim()
      if (trimmed && !trimmed.startsWith('//')) {
        lastEntryLineOffset = entryBlock.indexOf(entryLines[i])
        break
      }
    }

    const absoluteEntryPos = categoryEntryStart + lastEntryLineOffset
    const entryLineEnd = registry.indexOf('\n', absoluteEntryPos)
    registry = registry.slice(0, entryLineEnd + 1) + `  ${name},\n` + registry.slice(entryLineEnd + 1)
  }
}

fs.writeFileSync(REGISTRY, registry)
logRegistered(REGISTRY)

// =============================================================================
// Auto-register in widgets/meta-registry.ts
// =============================================================================

let metaRegistry = fs.readFileSync(META_REGISTRY, 'utf-8')

// 1. Add meta import — after the last import in matching category block
// Meta-registry uses the same category comments as registry
const metaImportLine = `import { meta as ${name}Meta } from './${category}/${name}/meta'`

// Find category comment in imports section
const metaCategoryComments: Record<string, string> = {
  primitives: '// Primitives',
  layout: '// Layout',
  interactive: '// Interactive',
  repeaters: '// Repeaters',
}
const metaCategoryComment = metaCategoryComments[category]
const metaImportSection = metaRegistry.indexOf(metaCategoryComment)

if (metaImportSection !== -1) {
  const metaCategoryKeys = Object.keys(metaCategoryComments)
  const currentMetaCatIdx = metaCategoryKeys.indexOf(category)
  let metaCategoryEnd: number

  if (currentMetaCatIdx < metaCategoryKeys.length - 1) {
    const nextMetaAnchor = metaCategoryComments[metaCategoryKeys[currentMetaCatIdx + 1]]
    // Find the next category comment AFTER our current one
    metaCategoryEnd = metaRegistry.indexOf(nextMetaAnchor, metaImportSection + metaCategoryComment.length)
  } else {
    // Last category — find the widgetMetaRegistry declaration
    metaCategoryEnd = metaRegistry.indexOf('export const widgetMetaRegistry', metaImportSection)
  }

  // Only look in the imports area (before widgetMetaRegistry)
  const registryDeclPos = metaRegistry.indexOf('export const widgetMetaRegistry')
  if (metaCategoryEnd > registryDeclPos) {
    metaCategoryEnd = registryDeclPos
  }

  const metaBlockSlice = metaRegistry.slice(metaImportSection, metaCategoryEnd)
  const lastMetaImport = metaBlockSlice.lastIndexOf('\nimport ')
  if (lastMetaImport !== -1) {
    const absoluteMetaPos = metaImportSection + lastMetaImport
    const metaLineEnd = metaRegistry.indexOf('\n', absoluteMetaPos + 1)
    metaRegistry = metaRegistry.slice(0, metaLineEnd + 1) + metaImportLine + '\n' + metaRegistry.slice(metaLineEnd + 1)
  }
}

// 2. Add entry in widgetMetaRegistry object — same approach as component registry
const metaRegistryObjStart = metaRegistry.indexOf('export const widgetMetaRegistry')
if (metaRegistryObjStart !== -1) {
  const metaEntryComments: Record<string, string> = {
    primitives: '// Primitives',
    layout: '// Layout',
    interactive: '// Interactive',
    repeaters: '// Repeaters',
  }
  const metaEntryAnchor = metaEntryComments[category]
  // Find this category's comment inside the registry object (after the declaration)
  const metaCategoryEntryStart = metaRegistry.indexOf(metaEntryAnchor, metaRegistryObjStart)

  if (metaCategoryEntryStart !== -1) {
    const metaEntryKeys = Object.keys(metaEntryComments)
    const currentMetaEntryIdx = metaEntryKeys.indexOf(category)
    let metaCategoryEntryEnd: number

    if (currentMetaEntryIdx < metaEntryKeys.length - 1) {
      const nextMetaEntryAnchor = metaEntryComments[metaEntryKeys[currentMetaEntryIdx + 1]]
      metaCategoryEntryEnd = metaRegistry.indexOf(nextMetaEntryAnchor, metaCategoryEntryStart + 1)
    } else {
      metaCategoryEntryEnd = metaRegistry.indexOf('} as const', metaCategoryEntryStart)
    }

    const metaEntryBlock = metaRegistry.slice(metaCategoryEntryStart, metaCategoryEntryEnd)
    const metaEntryLines = metaEntryBlock.split('\n')
    let lastMetaEntryOffset = 0
    for (let i = metaEntryLines.length - 1; i >= 0; i--) {
      const trimmed = metaEntryLines[i].trim()
      if (trimmed && !trimmed.startsWith('//')) {
        lastMetaEntryOffset = metaEntryBlock.indexOf(metaEntryLines[i])
        break
      }
    }

    const absoluteMetaEntryPos = metaCategoryEntryStart + lastMetaEntryOffset
    const metaEntryLineEnd = metaRegistry.indexOf('\n', absoluteMetaEntryPos)
    metaRegistry = metaRegistry.slice(0, metaEntryLineEnd + 1) + `  ${name}: ${name}Meta,\n` + metaRegistry.slice(metaEntryLineEnd + 1)
  }
}

fs.writeFileSync(META_REGISTRY, metaRegistry)
logRegistered(META_REGISTRY)

// =============================================================================
// Auto-register CSS in engine/styles.css
// =============================================================================

let styles = fs.readFileSync(STYLES_CSS, 'utf-8')

const cssImportLine = `@import './content/widgets/${category}/${name}/styles.css' layer(widgets);`

// Find the appropriate place to insert based on category
const CSS_CATEGORY_ANCHORS: Record<string, string> = {
  primitives: '/* Primitives */',
  layout: '/* Layout */',
  interactive: '/* Interactive */',
  repeaters: '/* Interactive */', // Repeaters go after interactive
}

// For primitives/layout/interactive: insert after last import in that sub-section
// For repeaters: insert after last repeater import (which follows interactive)
if (category === 'repeaters') {
  // Find last repeater import
  const lastRepeaterImport = styles.lastIndexOf("@import './content/widgets/repeaters/")
  if (lastRepeaterImport !== -1) {
    const lineEnd = styles.indexOf('\n', lastRepeaterImport)
    styles = styles.slice(0, lineEnd + 1) + cssImportLine + '\n' + styles.slice(lineEnd + 1)
  } else {
    // No repeater imports yet — insert after the last interactive import
    const lastInteractiveImport = styles.lastIndexOf("@import './content/widgets/interactive/")
    if (lastInteractiveImport !== -1) {
      const lineEnd = styles.indexOf('\n', lastInteractiveImport)
      styles = styles.slice(0, lineEnd + 1) + cssImportLine + '\n' + styles.slice(lineEnd + 1)
    }
  }
} else {
  // Find last import for this category
  const searchPattern = `@import './content/widgets/${category}/`
  const lastCategoryImport = styles.lastIndexOf(searchPattern)
  if (lastCategoryImport !== -1) {
    const lineEnd = styles.indexOf('\n', lastCategoryImport)
    styles = styles.slice(0, lineEnd + 1) + cssImportLine + '\n' + styles.slice(lineEnd + 1)
  }
}

fs.writeFileSync(STYLES_CSS, styles)
logRegistered(STYLES_CSS)

// =============================================================================
// Done
// =============================================================================

console.log(`\nDone! Widget "${name}" scaffolded and registered.`)
logNextSteps([
  `Edit ${path.join(WIDGET_DIR, 'types.ts')} — add widget-specific props`,
  `Edit ${path.join(WIDGET_DIR, 'meta.ts')} — add settings`,
  `Edit ${path.join(WIDGET_DIR, 'index.tsx')} — implement component`,
  `Edit ${path.join(WIDGET_DIR, 'styles.css')} — add styles`,
  'Run: npm run test:arch',
])
