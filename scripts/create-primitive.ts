/**
 * Scaffold a new effect primitive (timeline) and auto-register it.
 *
 * Usage:
 *   npm run create:primitive slide-up
 *   npm run create:primitive zoom-in
 *
 * Creates: engine/experience/timeline/primitives/{id}.ts
 * Registers in: engine/experience/timeline/primitives/index.ts (2 insertions)
 */

import fs from 'fs'
import path from 'path'
import {
  toCamelFromKebab,
  toDisplayFromKebab,
  ensureNotExists,
  logCreated,
  logRegistered,
  logNextSteps,
} from './scaffold-utils'

// =============================================================================
// CLI Parsing
// =============================================================================

const id = process.argv[2]

if (!id) {
  console.error('Usage: npx tsx scripts/create-primitive.ts <id>')
  console.error('  Example: npm run create:primitive slide-up')
  process.exit(1)
}

if (!/^[a-z][a-z0-9-]*$/.test(id)) {
  console.error(`Error: Primitive id "${id}" must be kebab-case (e.g. slide-up, zoom-in)`)
  process.exit(1)
}

const camel = toCamelFromKebab(id)
const display = toDisplayFromKebab(id)

// =============================================================================
// Paths
// =============================================================================

const ROOT = process.cwd()
const ENGINE = path.join(ROOT, 'engine')
const PRIMITIVES_DIR = path.join(ENGINE, 'experience/timeline/primitives')
const PRIMITIVE_FILE = path.join(PRIMITIVES_DIR, `${id}.ts`)
const BARREL = path.join(PRIMITIVES_DIR, 'index.ts')

ensureNotExists(PRIMITIVE_FILE, `Primitive "${id}"`)

// =============================================================================
// Generate File
// =============================================================================

fs.writeFileSync(
  PRIMITIVE_FILE,
  `/**
 * ${display} effect primitive.
 * TODO: Describe this effect.
 *
 * Supports GSAP realization. Add CSS realization if needed.
 */

import type { EffectPrimitive } from './types'
import { registerEffect } from './registry'

const ${camel}: EffectPrimitive = {
  id: '${id}',
  name: '${display}',

  defaults: {
    duration: 0.4,
    ease: 'power2.inOut',
  },

  gsap: {
    getInitialState: () => ({
      // TODO: Define initial GSAP state
      opacity: 0,
    }),

    getFinalState: () => ({
      // TODO: Define final GSAP state
      opacity: 1,
    }),
  },

  // Uncomment for CSS class-based realization:
  // css: {
  //   forwardClass: '${id}--forward',
  //   reverseClass: '${id}--reverse',
  //   effect: '${id}',
  // },
}

// Auto-register on module load
registerEffect(${camel})

export default ${camel}
`,
)

logCreated('primitive', PRIMITIVE_FILE)

// =============================================================================
// Auto-register in primitives/index.ts (2 insertions)
// =============================================================================

let barrel = fs.readFileSync(BARREL, 'utf-8')

// 1. Side-effect import — after the last side-effect import
const importLine = `import './${id}'`
const lastSideEffect = barrel.lastIndexOf("import './")
if (lastSideEffect !== -1) {
  const lineEnd = barrel.indexOf('\n', lastSideEffect)
  barrel =
    barrel.slice(0, lineEnd + 1) +
    importLine +
    '\n' +
    barrel.slice(lineEnd + 1)
} else {
  // No existing side-effect imports — add at top of file
  barrel = importLine + '\n' + barrel
}

// 2. Re-export — after the last explicit re-export
const reExportLine = `export { default as ${camel} } from './${id}'`
const lastReExport = barrel.lastIndexOf("export { default as ")
if (lastReExport !== -1) {
  const lineEnd = barrel.indexOf('\n', lastReExport)
  barrel =
    barrel.slice(0, lineEnd + 1) +
    reExportLine +
    '\n' +
    barrel.slice(lineEnd + 1)
} else {
  // No existing re-exports — append
  barrel = barrel.trimEnd() + '\n\n' + reExportLine + '\n'
}

fs.writeFileSync(BARREL, barrel)
logRegistered(BARREL)

// =============================================================================
// Done
// =============================================================================

console.log(`\nDone! Primitive "${id}" scaffolded and registered.`)
logNextSteps([
  `Edit ${PRIMITIVE_FILE} — implement GSAP states and/or CSS realization`,
  'Add story export in engine/experience/timeline/primitives/Primitives.stories.tsx with parameters: { a11y: { test: \'error\' } }',
  'Run: npm run test:arch',
])
