/**
 * Scaffold a new page transition and auto-register it.
 *
 * Usage:
 *   npm run create:transition wipe
 *   npm run create:transition wipe -- --category directional
 *
 * Creates: meta.ts, index.ts
 * Registers in: engine/experience/transitions/index.ts (3 insertions)
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
  console.error('Usage: npx tsx scripts/create-transition.ts <id> [--category <cat>]')
  console.error('  Example: npm run create:transition wipe -- --category directional')
  process.exit(1)
}

if (!/^[a-z][a-z0-9-]*$/.test(id)) {
  console.error(`Error: Transition id "${id}" must be kebab-case (e.g. wipe, slide-left)`)
  process.exit(1)
}

const catIdx = args.indexOf('--category')
const VALID_CATEGORIES = ['fade', 'directional', 'none'] as const
const category = catIdx !== -1 && args[catIdx + 1] ? args[catIdx + 1] : 'fade'

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
const TRANSITION_DIR = path.join(ENGINE, 'experience/transitions', id)
const BARREL = path.join(ENGINE, 'experience/transitions/index.ts')

ensureNotExists(TRANSITION_DIR, `Transition "${id}"`)

// =============================================================================
// Generate Files
// =============================================================================

fs.mkdirSync(TRANSITION_DIR, { recursive: true })

// --- meta.ts ---
fs.writeFileSync(
  path.join(TRANSITION_DIR, 'meta.ts'),
  `/**
 * ${display} page transition metadata.
 */

import { definePageTransitionMeta } from '../registry'

interface ${pascal}Settings {
  exitDuration: number
  entryDuration: number
}

export const meta = definePageTransitionMeta<${pascal}Settings>({
  id: '${id}',
  name: '${display}',
  description: 'TODO: Describe this page transition.',
  icon: '${id}',
  tags: ['${id}'],
  category: '${category}',
  settings: {
    exitDuration: {
      type: 'number',
      label: 'Exit Duration (ms)',
      description: 'Duration of the page exit animation',
      default: 400,
      min: 100,
      max: 2000,
    },
    entryDuration: {
      type: 'number',
      label: 'Entry Duration (ms)',
      description: 'Duration of the page entry animation',
      default: 400,
      min: 100,
      max: 2000,
    },
  },
})
`,
)

// --- index.ts ---
fs.writeFileSync(
  path.join(TRANSITION_DIR, 'index.ts'),
  `/**
 * ${display} page transition.
 * TODO: Describe how this transition works.
 */

import type { PageTransition } from '../types'
import { registerPageTransition } from '../registry'
import { meta } from './meta'

export const ${camel}PageTransition: PageTransition = {
  ...meta,
  defaults: {
    exitDuration: 400,
    entryDuration: 400,
    timeout: 2000,
  },
  respectReducedMotion: true,
  exitClass: 'page-transition--${id}-exiting',
  entryClass: 'page-transition--${id}-entering',
  // TODO: Set exitEffect/entryEffect if using effect primitives
  // exitEffect: '${id}',
  // entryEffect: '${id}',
  // effectMode: 'css',
}

// Auto-register on module load
registerPageTransition(${camel}PageTransition)
`,
)

logCreated('transition', TRANSITION_DIR)

// =============================================================================
// Auto-register in transitions/index.ts (3 insertions)
// =============================================================================

let barrel = fs.readFileSync(BARREL, 'utf-8')

// 1. Meta import — after the last meta import
const metaImportLine = `import { meta as ${camel}Meta } from './${id}/meta'`
const lastMetaImport = barrel.lastIndexOf("import { meta as ")
if (lastMetaImport !== -1) {
  const lineEnd = barrel.indexOf('\n', lastMetaImport)
  barrel =
    barrel.slice(0, lineEnd + 1) +
    metaImportLine +
    '\n' +
    barrel.slice(lineEnd + 1)
}

// 2. Meta re-export — after the last meta re-export line
const metaReExportLine = `export { ${camel}Meta }`
const lastMetaReExport = barrel.lastIndexOf('export { fadeMeta')
if (lastMetaReExport !== -1) {
  const lineEnd = barrel.indexOf('\n', lastMetaReExport)
  barrel =
    barrel.slice(0, lineEnd + 1) +
    metaReExportLine +
    '\n' +
    barrel.slice(lineEnd + 1)
} else {
  // Fallback: find any meta re-export
  const anyMetaReExport = barrel.lastIndexOf('Meta }')
  if (anyMetaReExport !== -1) {
    const lineEnd = barrel.indexOf('\n', anyMetaReExport)
    barrel =
      barrel.slice(0, lineEnd + 1) +
      metaReExportLine +
      '\n' +
      barrel.slice(lineEnd + 1)
  }
}

// 3. Eager export — after the last PageTransition export
const eagerExportLine = `export { ${camel}PageTransition } from './${id}'`
const lastPageTransitionExport = barrel.lastIndexOf("PageTransition } from './")
if (lastPageTransitionExport !== -1) {
  const lineEnd = barrel.indexOf('\n', lastPageTransitionExport)
  barrel =
    barrel.slice(0, lineEnd + 1) +
    eagerExportLine +
    '\n' +
    barrel.slice(lineEnd + 1)
}

fs.writeFileSync(BARREL, barrel)
logRegistered(BARREL)

// =============================================================================
// Done
// =============================================================================

console.log(`\nDone! Transition "${id}" scaffolded and registered.`)
logNextSteps([
  `Edit ${path.join(TRANSITION_DIR, 'meta.ts')} — describe the transition`,
  `Edit ${path.join(TRANSITION_DIR, 'index.ts')} — configure effects and CSS classes`,
  'Add CSS classes in engine/experience/navigation/page-transition.css',
  `Create ${path.join(TRANSITION_DIR, pascal + '.stories.tsx')} with parameters: { a11y: { test: 'error' } }`,
  'Run: npm run test:arch',
])
