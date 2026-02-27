/**
 * Scaffold a new behaviour and auto-register it.
 *
 * Usage:
 *   npm run create:behaviour scroll/parallax
 *   npm run create:behaviour hover/glow
 */

import fs from 'fs'
import path from 'path'

// =============================================================================
// Helpers
// =============================================================================

function toDisplay(str: string): string {
  // 'parallax' → 'Parallax', 'fade-out' → 'Fade Out'
  return str
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function toCamel(category: string, name: string): string {
  // scroll + parallax → scrollParallax
  // scroll + fade-out → scrollFadeOut
  const camelName = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  return category + camelName.charAt(0).toUpperCase() + camelName.slice(1)
}

// =============================================================================
// CLI Parsing
// =============================================================================

const fullPath = process.argv[2]

if (!fullPath || !fullPath.includes('/')) {
  console.error('Usage: npx tsx scripts/create-behaviour.ts <category>/<name>')
  console.error('  Example: npm run create:behaviour scroll/parallax')
  process.exit(1)
}

const [category, name] = fullPath.split('/')

if (!category || !name) {
  console.error('Error: Must provide category/name (e.g. scroll/parallax)')
  process.exit(1)
}

if (!/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error(`Error: Behaviour name "${name}" must be kebab-case (e.g. parallax, fade-out)`)
  process.exit(1)
}

const camelName = toCamel(category, name)
const displayCategory = toDisplay(category)
const displayName = toDisplay(name)
const fullDisplayName = `${displayCategory} ${displayName}`

// =============================================================================
// Paths
// =============================================================================

const ROOT = process.cwd()
const ENGINE = path.join(ROOT, 'engine')
const BEHAVIOURS = path.join(ENGINE, 'experience/behaviours')
const BEHAVIOUR_DIR = path.join(BEHAVIOURS, category, name)
const CATEGORY_BARREL = path.join(BEHAVIOURS, category, 'index.ts')
const ROOT_BARREL = path.join(BEHAVIOURS, 'index.ts')

if (fs.existsSync(BEHAVIOUR_DIR)) {
  console.error(`Error: Behaviour "${fullPath}" already exists at ${BEHAVIOUR_DIR}`)
  process.exit(1)
}

const categoryExists = fs.existsSync(path.join(BEHAVIOURS, category))
const categoryBarrelExists = fs.existsSync(CATEGORY_BARREL)

// =============================================================================
// Generate Files
// =============================================================================

fs.mkdirSync(BEHAVIOUR_DIR, { recursive: true })

// --- meta.ts ---
fs.writeFileSync(
  path.join(BEHAVIOUR_DIR, 'meta.ts'),
  `import { defineBehaviourMeta } from '../../registry'

export const meta = defineBehaviourMeta({
  id: '${category}/${name}',
  name: '${fullDisplayName}',
  description: 'TODO: Describe what state this behaviour computes',
  icon: 'animation',
  tags: ['${category}', '${name}'],
  category: '${category}',
})
`,
)

// --- index.ts ---
fs.writeFileSync(
  path.join(BEHAVIOUR_DIR, 'index.ts'),
  `/**
 * ${category}/${name} behaviour - TODO: describe.
 *
 * CSS Variables Output:
 * - --${name}-xxx: TODO: document outputs
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'
import { meta } from './meta'

const ${camelName}: Behaviour = {
  ...meta,
  requires: ['prefersReducedMotion'],

  cssTemplate: \`
    /* TODO: Define CSS that reads variables from compute() */
  \`,

  compute: (state, options, element) => {
    if (state.prefersReducedMotion) {
      return {
        // TODO: reduced motion fallback values
      }
    }

    return {
      // TODO: compute CSS variable values from state
    }
  },
}

registerBehaviour(${camelName})
export default ${camelName}
`,
)

// --- {Name}.stories.tsx ---
const pascalName = name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join('')
fs.writeFileSync(
  path.join(BEHAVIOUR_DIR, `${pascalName}.stories.tsx`),
  `import React from 'react'
import { behaviourStoryConfig, behaviourStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { SectionBehaviourPreview } from '../../../../../.storybook/helpers/SectionBehaviourPreview'
import { content } from '../../../../content/sections/patterns/HeroTitle/content'
import { createHeroTitleSection } from '../../../../content/sections/patterns/HeroTitle'
import type { HeroTitleProps } from '../../../../content/sections/patterns/HeroTitle/types'
import behaviour from './index'

const config = behaviourStoryConfig(behaviour)
export default {
  ...config,
  title: '${displayCategory}/${displayName}',
  parameters: { ...config.parameters, a11y: { test: 'error' } },
}

export const Default = {
  args: behaviourStoryArgs(behaviour),
  render: (args: Record<string, unknown>) => (
    <SectionBehaviourPreview
      behaviour={behaviour}
      args={args}
      section={createHeroTitleSection(content.sampleContent as HeroTitleProps)}
    />
  ),
}
`,
)

console.log(`Created behaviour: ${BEHAVIOUR_DIR}`)

// =============================================================================
// Auto-register in category barrel
// =============================================================================

if (categoryBarrelExists) {
  // Existing category barrel — append import + export
  let barrel = fs.readFileSync(CATEGORY_BARREL, 'utf-8')

  // Find the last side-effect import and add after it
  const importLine = `import './${name}'`
  const exportLine = `export { default as ${camelName} } from './${name}'`

  // Find last side-effect import (import './')
  const lastSideEffectImport = barrel.lastIndexOf("import './")
  if (lastSideEffectImport !== -1) {
    const lastSideEffectEnd = barrel.indexOf('\n', lastSideEffectImport)
    barrel =
      barrel.slice(0, lastSideEffectEnd + 1) +
      importLine +
      '\n' +
      barrel.slice(lastSideEffectEnd + 1)
  } else {
    // No side-effect imports yet, prepend
    barrel = importLine + '\n' + barrel
  }

  // Find last re-export and add after it
  const lastExport = barrel.lastIndexOf('export { default as ')
  if (lastExport !== -1) {
    const lastExportEnd = barrel.indexOf('\n', lastExport)
    barrel =
      barrel.slice(0, lastExportEnd + 1) +
      exportLine +
      '\n' +
      barrel.slice(lastExportEnd + 1)
  } else {
    // No re-exports yet, append
    barrel = barrel.trimEnd() + '\n\n' + exportLine + '\n'
  }

  fs.writeFileSync(CATEGORY_BARREL, barrel)
  console.log(`Updated category barrel: ${CATEGORY_BARREL}`)
} else {
  // New category barrel
  const barrelContent = `/**
 * ${displayCategory}-based behaviours.
 * Triggered by ${category} state.
 */

// Auto-register by importing
import './${name}'

// Re-export for explicit imports
export { default as ${camelName} } from './${name}'
`
  fs.writeFileSync(CATEGORY_BARREL, barrelContent)
  console.log(`Created category barrel: ${CATEGORY_BARREL}`)
}

// =============================================================================
// Auto-register in root barrel
// =============================================================================

let rootBarrel = fs.readFileSync(ROOT_BARREL, 'utf-8')

if (!categoryExists) {
  // New category — add side-effect import and re-export section

  // Add side-effect import after the last category import
  const lastCategoryImport = rootBarrel.lastIndexOf("import './" )
  const lastCategoryImportLineEnd = rootBarrel.indexOf('\n', lastCategoryImport)

  // Find the comment block before, or just add after the last import
  const newImportBlock = `\n// ${displayCategory}-based triggers\nimport './${category}'`
  rootBarrel =
    rootBarrel.slice(0, lastCategoryImportLineEnd + 1) +
    newImportBlock +
    '\n' +
    rootBarrel.slice(lastCategoryImportLineEnd + 1)

  // Add re-exports at the end (before the trailing newline)
  const newExportBlock = `\n// ${displayCategory} behaviours\nexport { ${camelName} } from './${category}'`
  rootBarrel = rootBarrel.trimEnd() + '\n' + newExportBlock + '\n'
} else {
  // Existing category — update the re-export block for that category
  // Find the export block for this category (look for the re-export from the category)
  const categoryExportPattern = `from './${category}'`
  const lastCategoryExport = rootBarrel.lastIndexOf(categoryExportPattern)

  if (lastCategoryExport !== -1) {
    const lastCategoryExportEnd = rootBarrel.indexOf('\n', lastCategoryExport)

    // Check if this is a multi-export line like `export { scrollFade, scrollFadeOut } from './scroll'`
    // Find the start of that line
    const lineStart = rootBarrel.lastIndexOf('\n', lastCategoryExport) + 1
    const existingLine = rootBarrel.slice(lineStart, lastCategoryExportEnd)

    // Parse existing exports from the line
    const exportsMatch = existingLine.match(/export\s*\{([^}]+)\}/)
    if (exportsMatch) {
      const existingExports = exportsMatch[1].trim()
      const newExports = `${existingExports}, ${camelName}`
      const newLine = `export { ${newExports} } from './${category}'`

      rootBarrel =
        rootBarrel.slice(0, lineStart) +
        newLine +
        rootBarrel.slice(lastCategoryExportEnd)
    } else {
      // Fallback: just add a new export line
      rootBarrel =
        rootBarrel.slice(0, lastCategoryExportEnd + 1) +
        `export { ${camelName} } from './${category}'\n` +
        rootBarrel.slice(lastCategoryExportEnd + 1)
    }
  } else {
    // Category exists but no re-exports section — add one
    const newExportBlock = `\n// ${displayCategory} behaviours\nexport { ${camelName} } from './${category}'`
    rootBarrel = rootBarrel.trimEnd() + '\n' + newExportBlock + '\n'
  }
}

fs.writeFileSync(ROOT_BARREL, rootBarrel)
console.log(`Updated root barrel: ${ROOT_BARREL}`)

console.log(`\nDone! Behaviour "${category}/${name}" scaffolded and registered.`)
console.log('Next steps:')
console.log(`  1. Edit ${path.join(BEHAVIOUR_DIR, 'meta.ts')} — describe the behaviour`)
console.log(`  2. Edit ${path.join(BEHAVIOUR_DIR, 'index.ts')} — implement compute()`)
console.log(`  3. Run: npm run test:arch`)
