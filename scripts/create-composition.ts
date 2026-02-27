/**
 * Scaffold a new experience composition and auto-register it.
 *
 * Usage:
 *   npm run create:composition cover-parallax
 *   npm run create:composition cover-parallax -- --category scroll-driven
 *
 * Creates: meta.ts, index.ts
 * Registers in: engine/experience/compositions/index.ts (5 insertions)
 */

import fs from 'fs'
import path from 'path'
import {
  toCamelFromKebab,
  toPascalFromKebab,
  toDisplayFromKebab,
  ensureNotExists,
  logCreated,
  logRegistered,
  logNextSteps,
} from './scaffold-utils'

// =============================================================================
// CLI Parsing
// =============================================================================

const args = process.argv.slice(2)
const id = args.find((a) => !a.startsWith('--'))

if (!id) {
  console.error('Usage: npx tsx scripts/create-composition.ts <id> [--category <cat>]')
  console.error('  Example: npm run create:composition cover-parallax -- --category scroll-driven')
  process.exit(1)
}

if (!/^[a-z][a-z0-9-]*$/.test(id)) {
  console.error(`Error: Composition id "${id}" must be kebab-case (e.g. cover-parallax)`)
  process.exit(1)
}

const catIdx = args.indexOf('--category')
const VALID_CATEGORIES = ['presentation', 'scroll-driven', 'physics', 'simple'] as const
const category = catIdx !== -1 && args[catIdx + 1] ? args[catIdx + 1] : 'scroll-driven'

if (!VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])) {
  console.error(`Error: --category must be one of: ${VALID_CATEGORIES.join(', ')}`)
  process.exit(1)
}

const camel = toCamelFromKebab(id)
const pascal = toPascalFromKebab(id)
const display = toDisplayFromKebab(id)

// =============================================================================
// Paths
// =============================================================================

const ROOT = process.cwd()
const ENGINE = path.join(ROOT, 'engine')
const COMP_DIR = path.join(ENGINE, 'experience/compositions', id)
const BARREL = path.join(ENGINE, 'experience/compositions/index.ts')

ensureNotExists(COMP_DIR, `Composition "${id}"`)

// =============================================================================
// Generate Files
// =============================================================================

fs.mkdirSync(COMP_DIR, { recursive: true })

// --- meta.ts ---
fs.writeFileSync(
  path.join(COMP_DIR, 'meta.ts'),
  `/**
 * ${display} composition metadata.
 * Loaded eagerly for UI listings without loading full composition.
 */

import { defineCompositionMeta } from '../registry'

export const meta = defineCompositionMeta({
  id: '${id}',
  name: '${display}',
  description: 'TODO: Describe this composition.',
  icon: 'animation',
  tags: ['${id}'],
  category: '${category}',
})
`,
)

// --- index.ts ---
fs.writeFileSync(
  path.join(COMP_DIR, 'index.ts'),
  `/**
 * ${display} composition.
 * TODO: Describe how this composition orchestrates sections.
 */

import type { ExperienceComposition } from '../types'

export const ${camel}Composition: ExperienceComposition = {
  id: '${id}',
  name: '${display}',
  description: 'TODO: Describe this composition.',
  icon: 'animation',
  tags: ['${id}'],
  category: '${category}',

  sectionBehaviours: {
    // TODO: Define default behaviour assignments per section role
    // hero: [{ behaviour: 'scroll/fade' }],
  },

  // TODO: Configure presentation model if needed
  // presentation: { model: 'stacking' },

  // TODO: Configure navigation inputs if needed
  // navigation: { inputs: { wheel: { enabled: true } } },
}
`,
)

logCreated('composition', COMP_DIR)

// =============================================================================
// Auto-register in compositions/index.ts (5 insertions)
// =============================================================================

let barrel = fs.readFileSync(BARREL, 'utf-8')

// Detect naming convention: barrel may use "Composition" or "Experience" naming
const usesComposition = barrel.includes('registerLazyComposition') || barrel.includes('Composition }')
const suffix = usesComposition ? 'Composition' : 'Experience'
const registerFn = usesComposition ? 'registerLazyComposition' : 'registerLazyExperience'

// 1. Meta import — after the last meta import line
const metaImportLine = `import { meta as ${camel}Meta } from './${id}/meta'`
const lastMetaImport = barrel.lastIndexOf("import { meta as ")
const lastMetaImportEnd = barrel.indexOf('\n', lastMetaImport)
barrel =
  barrel.slice(0, lastMetaImportEnd + 1) +
  metaImportLine +
  '\n' +
  barrel.slice(lastMetaImportEnd + 1)

// 2. Meta re-export — find the line that re-exports metas and append
const metaReExportPattern = 'export { simpleMeta,'
const metaReExportStart = barrel.indexOf(metaReExportPattern)
if (metaReExportStart !== -1) {
  const metaReExportLineEnd = barrel.indexOf('\n', metaReExportStart)
  const metaReExportLine = barrel.slice(metaReExportStart, metaReExportLineEnd)
  const closingBrace = metaReExportLine.lastIndexOf('}')
  const absClosingBrace = metaReExportStart + closingBrace
  barrel =
    barrel.slice(0, absClosingBrace) +
    `, ${camel}Meta ` +
    barrel.slice(absClosingBrace)
}

// 3. Lazy registration — after the last registerLazy* block
// Each block spans 3 lines:
//   registerLazy*(xxxMeta, () =>
//     import('./xxx').then((m) => m.xxx*)
//   )
const lazyRegLine = `${registerFn}(${camel}Meta, () =>\n  import('./${id}').then((m) => m.${camel}${suffix})\n)`

// Build regex that matches the register function used in this barrel
const escapedFn = registerFn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const lazyRegPattern = new RegExp(
  `${escapedFn}\\([^)]+,\\s*\\(\\)\\s*=>\\s*\\n\\s*import\\('[^']+'\\)\\.then\\(\\(m\\)\\s*=>\\s*m\\.\\w+\\)\\s*\\n\\)`,
  'g'
)
let lastLazyMatch: RegExpExecArray | null = null
let lazyMatch: RegExpExecArray | null
while ((lazyMatch = lazyRegPattern.exec(barrel)) !== null) {
  lastLazyMatch = lazyMatch
}

if (lastLazyMatch) {
  const insertPos = lastLazyMatch.index + lastLazyMatch[0].length
  barrel =
    barrel.slice(0, insertPos) +
    '\n' + lazyRegLine +
    barrel.slice(insertPos)
}

// 4. Direct export — after the last direct export (non-alias)
// Direct: export { xxxExperience } from './xxx'  OR  export { xxxComposition } from './xxx'
// Alias:  export { xxxComposition as xxxExperience } from './xxx'
const directExportLine = `export { ${camel}${suffix} } from './${id}'`
const directExportPattern = new RegExp(`^export \\{ \\w+${suffix} \\} from '\\.\\/`, 'gm')
let lastDirectMatch: RegExpExecArray | null = null
let directMatch: RegExpExecArray | null
while ((directMatch = directExportPattern.exec(barrel)) !== null) {
  lastDirectMatch = directMatch
}

if (lastDirectMatch) {
  const lineEnd = barrel.indexOf('\n', lastDirectMatch.index)
  barrel =
    barrel.slice(0, lineEnd + 1) +
    directExportLine +
    '\n' +
    barrel.slice(lineEnd + 1)
}

// 5. Deprecated alias — after the last deprecated alias export
// These look like: export { xxxComposition as xxxExperience } from './xxx'
const deprecatedLine = `export { ${camel}Composition as ${camel}Experience } from './${id}'`
const lastDeprecatedExport = barrel.lastIndexOf("Experience } from './")
if (lastDeprecatedExport !== -1) {
  const deprecatedLineEnd = barrel.indexOf('\n', lastDeprecatedExport)
  barrel =
    barrel.slice(0, deprecatedLineEnd + 1) +
    deprecatedLine +
    '\n' +
    barrel.slice(deprecatedLineEnd + 1)
}

fs.writeFileSync(BARREL, barrel)
logRegistered(BARREL)

// =============================================================================
// Done
// =============================================================================

console.log(`\nDone! Composition "${id}" scaffolded and registered.`)
logNextSteps([
  `Edit ${path.join(COMP_DIR, 'meta.ts')} — describe the composition`,
  `Edit ${path.join(COMP_DIR, 'index.ts')} — configure behaviours, presentation, navigation`,
  `Create ${path.join(COMP_DIR, pascal + '.stories.tsx')} with parameters: { a11y: { test: 'error' } }`,
  'Run: npm run test:arch',
])
