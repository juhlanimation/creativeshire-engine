/**
 * Scaffold a new intro sequence and auto-register it.
 *
 * Usage:
 *   npm run create:intro scroll-gate
 *   npm run create:intro scroll-gate -- --pattern timed
 *
 * Creates: engine/intro/sequences/{id}.ts
 * Registers in: engine/intro/sequences/index.ts (1 insertion)
 */

import fs from 'fs'
import path from 'path'
import {
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
  console.error('Usage: npx tsx scripts/create-intro.ts <id> [--pattern <pattern>]')
  console.error('  Example: npm run create:intro scroll-gate -- --pattern timed')
  process.exit(1)
}

if (!/^[a-z][a-z0-9-]*$/.test(id)) {
  console.error(`Error: Intro id "${id}" must be kebab-case (e.g. scroll-gate, fade-in)`)
  process.exit(1)
}

const patternIdx = args.indexOf('--pattern')
const VALID_PATTERNS = ['video-gate', 'timed', 'scroll-reveal', 'sequence-timed'] as const
const pattern = patternIdx !== -1 && args[patternIdx + 1] ? args[patternIdx + 1] : 'timed'

if (!VALID_PATTERNS.includes(pattern as (typeof VALID_PATTERNS)[number])) {
  console.error(`Error: --pattern must be one of: ${VALID_PATTERNS.join(', ')}`)
  process.exit(1)
}

const display = toDisplayFromKebab(id)

// =============================================================================
// Paths
// =============================================================================

const ROOT = process.cwd()
const ENGINE = path.join(ROOT, 'engine')
const SEQUENCES_DIR = path.join(ENGINE, 'intro/sequences')
const SEQUENCE_FILE = path.join(SEQUENCES_DIR, `${id}.ts`)
const BARREL = path.join(SEQUENCES_DIR, 'index.ts')

ensureNotExists(SEQUENCE_FILE, `Intro sequence "${id}"`)

// =============================================================================
// Generate File — follows video-hero-gate.ts / wait.ts structure
// =============================================================================

// Pattern-specific default settings
const PATTERN_SETTINGS: Record<string, { settings: string; configSettings: string }> = {
  'video-gate': {
    settings: `    source: { type: 'text', label: 'Video Selector', default: '#hero-video video', description: 'CSS selector for the hero video element' },
    targetTime: { type: 'number', label: 'Target Time', default: 3.0, min: 0, step: 0.1, description: 'Video time (seconds) to trigger reveal' },
    revealDuration: { type: 'number', label: 'Reveal Duration', default: 50, min: 0, description: 'Reveal animation duration (ms)' },
    contentVisible: { type: 'toggle', label: 'Content Visible', default: true, description: 'Show content during gate' },`,
    configSettings: `    source: '#hero-video video',
    targetTime: 3.0,
    revealDuration: 50,
    contentVisible: true,`,
  },
  'timed': {
    settings: `    duration: { type: 'number', label: 'Duration', default: 2000, min: 0, step: 100, description: 'Wait time before reveal (ms)' },
    revealDuration: { type: 'number', label: 'Reveal Duration', default: 50, min: 0, description: 'Reveal animation duration (ms)' },`,
    configSettings: `    duration: 2000,
    revealDuration: 50,`,
  },
  'scroll-reveal': {
    settings: `    threshold: { type: 'number', label: 'Scroll Threshold', default: 0.1, min: 0, max: 1, step: 0.05, description: 'Scroll position (0-1) to trigger reveal' },
    revealDuration: { type: 'number', label: 'Reveal Duration', default: 300, min: 0, description: 'Reveal animation duration (ms)' },`,
    configSettings: `    threshold: 0.1,
    revealDuration: 300,`,
  },
  'sequence-timed': {
    settings: `    phases: { type: 'custom', label: 'Phases', default: [], description: 'Array of timed phase definitions' },
    revealDuration: { type: 'number', label: 'Reveal Duration', default: 50, min: 0, description: 'Reveal animation duration (ms)' },`,
    configSettings: `    phases: [],
    revealDuration: 50,`,
  },
}

const patternDef = PATTERN_SETTINGS[pattern] ?? PATTERN_SETTINGS['timed']

fs.writeFileSync(
  SEQUENCE_FILE,
  `/**
 * ${display} — TODO: describe this intro sequence.
 */

import type { IntroConfig, IntroMeta } from '../types'
import { registerIntroSequence } from '../registry'

export const meta: IntroMeta = {
  id: '${id}',
  name: '${display}',
  description: 'TODO: Describe this intro sequence',
  icon: '🎬',
  category: 'gate',
  settings: {
${patternDef.settings}
  },
}

export const config: IntroConfig = {
  pattern: '${pattern}',
  settings: {
${patternDef.configSettings}
  },
}

registerIntroSequence(meta, config)
`,
)

logCreated('intro sequence', SEQUENCE_FILE)

// =============================================================================
// Auto-register in sequences/index.ts (1 insertion)
// =============================================================================

let barrel = fs.readFileSync(BARREL, 'utf-8')

// Add side-effect import after the last import line
const importLine = `import './${id}'`
const lastImport = barrel.lastIndexOf("import './")
if (lastImport !== -1) {
  const lineEnd = barrel.indexOf('\n', lastImport)
  barrel =
    barrel.slice(0, lineEnd + 1) +
    importLine +
    '\n' +
    barrel.slice(lineEnd + 1)
} else {
  // No existing imports — append after the comment
  barrel = barrel.trimEnd() + '\n' + importLine + '\n'
}

fs.writeFileSync(BARREL, barrel)
logRegistered(BARREL)

// =============================================================================
// Done
// =============================================================================

console.log(`\nDone! Intro sequence "${id}" scaffolded and registered.`)
logNextSteps([
  `Edit ${SEQUENCE_FILE} — customize meta settings and config`,
  `Create story file in engine/intro/sequences/ with parameters: { a11y: { test: 'error' } }`,
  'Run: npm run test:arch',
])
