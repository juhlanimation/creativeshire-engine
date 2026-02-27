/**
 * Scaffold a new CSS effect and auto-register it.
 *
 * Usage:
 *   npm run create:effect transform/flip
 *   npm run create:effect emphasis/shake
 */

import fs from 'fs'
import path from 'path'

// =============================================================================
// CLI Parsing
// =============================================================================

const fullPath = process.argv[2]

if (!fullPath || !fullPath.includes('/')) {
  console.error('Usage: npx tsx scripts/create-effect.ts <mechanism>/<name>')
  console.error('  Example: npm run create:effect transform/flip')
  process.exit(1)
}

const [mechanism, name] = fullPath.split('/')

if (!mechanism || !name) {
  console.error('Error: Must provide mechanism/name (e.g. transform/flip)')
  process.exit(1)
}

if (!/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error(`Error: Effect name "${name}" must be kebab-case (e.g. flip, scale-up)`)
  process.exit(1)
}

// =============================================================================
// Paths
// =============================================================================

const ROOT = process.cwd()
const ENGINE = path.join(ROOT, 'engine')
const EFFECTS_DIR = path.join(ENGINE, 'experience/effects')
const MECHANISM_DIR = path.join(EFFECTS_DIR, mechanism)
const CSS_FILE = path.join(MECHANISM_DIR, `${name}.css`)
const INDEX_CSS = path.join(EFFECTS_DIR, 'index.css')

if (fs.existsSync(CSS_FILE)) {
  console.error(`Error: Effect "${fullPath}" already exists at ${CSS_FILE}`)
  process.exit(1)
}

// =============================================================================
// Generate File
// =============================================================================

fs.mkdirSync(MECHANISM_DIR, { recursive: true })

fs.writeFileSync(
  CSS_FILE,
  `/**
 * ${mechanism}/${name} effect.
 *
 * Consumes CSS variables set by behaviours.
 * Define HOW the values animate, not WHAT the values are.
 *
 * Pattern: [data-effect~="${name}"] { ... }
 */

[data-effect~="${name}"] {
  /* TODO: Define animation using behaviour CSS variables */
  /* Example: opacity: var(--section-opacity, 1); */
  /* Example: transition: opacity var(--fade-duration, 300ms) ease-out; */
}
`,
)

// --- {Name}.stories.tsx ---
const effectPascal = name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join('')
const effectDisplay = name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
const mechanismDisplay = mechanism.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

fs.writeFileSync(
  path.join(MECHANISM_DIR, `${effectPascal}.stories.tsx`),
  `import React from 'react'
import { EffectCSSPreview } from '../../../../.storybook/helpers/EffectCSSPreview'
import { EngineDecorator } from '../../../../.storybook/helpers/EngineDecorator'

export default {
  title: '${mechanismDisplay}/${effectDisplay}',
  parameters: { layout: 'padded', a11y: { test: 'error' } },
  decorators: [EngineDecorator],
}

export const ${effectPascal.replace(/\s/g, '')} = {
  render: () => (
    <EffectCSSPreview
      effectName="${name}"
      cssVariables={[
        // TODO: Define CSS variables this effect consumes
        // { name: '--${name}-value', initial: '0', final: '1', description: 'TODO' },
      ]}
    />
  ),
}
`,
)

console.log(`Created effect: ${CSS_FILE}`)

// =============================================================================
// Auto-register in index.css
// =============================================================================

let indexCss = fs.readFileSync(INDEX_CSS, 'utf-8')

const mechanismUpper = mechanism.toUpperCase().replace(/-/g, ' ')
const sectionHeader = `/* =============================================================================\n * ${mechanismUpper}`
const importLine = `@import './${mechanism}/${name}.css';`

// Check if the mechanism section already exists
if (indexCss.includes(sectionHeader)) {
  // Find the section and append the import after the last import in that section
  const sectionStart = indexCss.indexOf(sectionHeader)

  // Find the next section header or end of meaningful content
  const nextSectionPattern = '/* ============================================================================='
  const afterSection = indexCss.indexOf(nextSectionPattern, sectionStart + sectionHeader.length)

  // Find the last @import before the next section (or EOF)
  const searchEnd = afterSection !== -1 ? afterSection : indexCss.length
  const sectionSlice = indexCss.slice(sectionStart, searchEnd)
  const lastImportInSection = sectionSlice.lastIndexOf("@import '")

  if (lastImportInSection !== -1) {
    const absPos = sectionStart + lastImportInSection
    const lineEnd = indexCss.indexOf('\n', absPos)
    indexCss =
      indexCss.slice(0, lineEnd + 1) +
      importLine +
      '\n' +
      indexCss.slice(lineEnd + 1)
  } else {
    // No imports in this section yet — add after the section header block
    const headerEnd = indexCss.indexOf(' */\n', sectionStart)
    if (headerEnd !== -1) {
      const insertPos = headerEnd + ' */\n'.length
      indexCss =
        indexCss.slice(0, insertPos) +
        importLine +
        '\n' +
        indexCss.slice(insertPos)
    }
  }
} else {
  // New mechanism section — find the widget-specific effects comment at the end
  // or just append before it
  const widgetComment = '/* Widget-specific effects'
  const widgetCommentPos = indexCss.indexOf(widgetComment)

  const newSection = `\n/* =============================================================================\n * ${mechanismUpper} (${mechanism.charAt(0).toUpperCase() + mechanism.slice(1).replace(/-/g, ' ')})\n * ============================================================================= */\n${importLine}\n`

  if (widgetCommentPos !== -1) {
    indexCss =
      indexCss.slice(0, widgetCommentPos) +
      newSection +
      '\n' +
      indexCss.slice(widgetCommentPos)
  } else {
    // No widget comment — just append at end
    indexCss = indexCss.trimEnd() + '\n' + newSection
  }
}

fs.writeFileSync(INDEX_CSS, indexCss)
console.log(`Registered in: ${INDEX_CSS}`)

console.log(`\nDone! Effect "${mechanism}/${name}" scaffolded and registered.`)
console.log('Next steps:')
console.log(`  1. Edit ${CSS_FILE} — define the animation`)
console.log(`  2. Run: npm run test:arch`)
