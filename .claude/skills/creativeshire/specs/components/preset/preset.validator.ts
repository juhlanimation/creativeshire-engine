#!/usr/bin/env npx tsx
/**
 * Preset Validator
 *
 * Validates files in:
 *   - creativeshire/presets/
 *   - creativeshire/experience/modes/
 *   - creativeshire/experience/experiences/
 *
 * Spec: ./preset.spec.md
 *
 * Exit codes:
 *   0 = Pass (file valid or not in this domain)
 *   1 = Execution error (validator crashed, not validation failure)
 *   2 = Fail (validation errors found)
 */

import { readFileSync, appendFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface HookInput {
  tool_name: string
  tool_input: { file_path?: string; content?: string }
}

type ValidationCheck = (content: string, filePath: string) => string | null

// ─────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────

const VALIDATOR_NAME = 'preset'

// Path patterns for this domain
const PRESET_PATH = /creativeshire\/presets\//
const MODE_PATH = /creativeshire\/experience\/modes\//
const EXPERIENCE_PATH = /creativeshire\/experience\/experiences\//

// File extensions to validate
const EXTENSIONS = ['.ts', '.tsx']

// Log file path
function getLogPath(): string {
  let dir = __dirname
  while (dir !== dirname(dir)) {
    if (existsSync(resolve(dir, '.claude'))) {
      return resolve(dir, `.claude/logs/${VALIDATOR_NAME}.validation.log`)
    }
    dir = dirname(dir)
  }
  return resolve(__dirname, `.claude/logs/${VALIDATOR_NAME}.validation.log`)
}
const LOG_PATH = getLogPath()

// ─────────────────────────────────────────────────────────────
// Preset Validation Checks
// ─────────────────────────────────────────────────────────────

/**
 * Check: Preset exports named constant
 * From spec: "Preset exports named constant: export const {name}Preset"
 */
const checkExportsPreset: ValidationCheck = (content, filePath) => {
  if (!PRESET_PATH.test(filePath)) return null
  if (!filePath.endsWith('/index.ts') && !filePath.endsWith('\\index.ts')) return null

  if (!content.includes('export const') || !content.includes('Preset')) {
    return 'Preset index.ts must export named constant ending with "Preset"'
  }
  return null
}

/**
 * Check: Site defaults exported
 * From spec: "Preset includes site.ts with siteDefaults export"
 */
const checkSiteDefaults: ValidationCheck = (content, filePath) => {
  if (!PRESET_PATH.test(filePath)) return null
  if (!filePath.includes('site.ts')) return null

  if (!content.includes('export const siteDefaults') &&
      !content.includes('export { siteDefaults }')) {
    return 'site.ts must export siteDefaults object'
  }
  return null
}

/**
 * Check: No site imports
 * From spec: "No import from site/* (presets are portable)"
 */
const checkNoSiteImports: ValidationCheck = (content, filePath) => {
  if (!PRESET_PATH.test(filePath) && !MODE_PATH.test(filePath) && !EXPERIENCE_PATH.test(filePath)) return null

  if (/from\s+['"].*\/site\//.test(content) || /from\s+['"]@\/site\//.test(content)) {
    return 'Presets/modes/experiences must not import from site/ - they must be portable'
  }
  return null
}

// ─────────────────────────────────────────────────────────────
// Mode Validation Checks
// ─────────────────────────────────────────────────────────────

/**
 * Check: Mode has section default
 * From spec: "Mode defaults.section always defined"
 */
const checkSectionDefault: ValidationCheck = (content, filePath) => {
  if (!MODE_PATH.test(filePath)) return null
  if (!filePath.match(/modes\/[a-z-]+\/index\.ts$/)) return null
  if (filePath.includes('types.ts') || filePath.includes('registry.ts')) return null

  // Check for defaults object with section key
  if (content.includes('defaults:') || content.includes('defaults :')) {
    if (!content.includes('section:') && !content.includes("section :")) {
      return 'Mode must define defaults.section'
    }
  }
  return null
}

/**
 * Check: Mode id is kebab-case
 * From spec: "Mode id is unique and kebab-case"
 */
const checkModeId: ValidationCheck = (content, filePath) => {
  if (!MODE_PATH.test(filePath)) return null
  if (!filePath.match(/modes\/[a-z-]+\/index\.ts$/)) return null

  const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/)
  if (idMatch) {
    const id = idMatch[1]
    if (!/^[a-z]+(-[a-z]+)*$/.test(id)) {
      return `Mode id must be kebab-case: "${id}" is invalid`
    }
  }
  return null
}

/**
 * Check: Mode has provides array
 * From spec: "Mode provides lists all state fields from store"
 */
const checkModeProvides: ValidationCheck = (content, filePath) => {
  if (!MODE_PATH.test(filePath)) return null
  if (!filePath.match(/modes\/[a-z-]+\/index\.ts$/)) return null
  if (filePath.includes('types.ts') || filePath.includes('registry.ts')) return null

  if (!content.includes('provides:')) {
    return 'Mode must define provides array listing state fields'
  }
  return null
}

/**
 * Check: Mode has createStore
 * From spec: "Mode createStore returns Zustand store"
 */
const checkModeCreateStore: ValidationCheck = (content, filePath) => {
  if (!MODE_PATH.test(filePath)) return null
  if (!filePath.match(/modes\/[a-z-]+\/index\.ts$/)) return null
  if (filePath.includes('types.ts') || filePath.includes('registry.ts')) return null

  if (!content.includes('createStore:') && !content.includes('createStore :')) {
    return 'Mode must define createStore function returning Zustand store'
  }
  return null
}

/**
 * Check: Mode has triggers
 * From spec: "Mode triggers reference valid trigger types"
 */
const checkModeTriggers: ValidationCheck = (content, filePath) => {
  if (!MODE_PATH.test(filePath)) return null
  if (!filePath.match(/modes\/[a-z-]+\/index\.ts$/)) return null
  if (filePath.includes('types.ts') || filePath.includes('registry.ts')) return null

  if (!content.includes('triggers:')) {
    return 'Mode must define triggers array'
  }
  return null
}

/**
 * Check: No DOM manipulation in store
 * From spec: "No DOM manipulation in mode store"
 */
const checkNoDomInStore: ValidationCheck = (content, filePath) => {
  if (!MODE_PATH.test(filePath)) return null
  if (!filePath.includes('store.ts') && !filePath.match(/modes\/[a-z-]+\/index\.ts$/)) return null

  const domPatterns = [
    /document\.querySelector/,
    /document\.getElementById/,
    /\.style\.setProperty/,
    /\.style\.transform\s*=/,
    /\.classList\./,
  ]

  for (const pattern of domPatterns) {
    if (pattern.test(content)) {
      return 'Mode store must not manipulate DOM - drivers handle DOM updates'
    }
  }
  return null
}

// ─────────────────────────────────────────────────────────────
// Experience Validation Checks
// ─────────────────────────────────────────────────────────────

/**
 * Check: Experience has default wrapper
 * From spec: "Experience wrappers.default always present"
 */
const checkDefaultWrapper: ValidationCheck = (content, filePath) => {
  if (!EXPERIENCE_PATH.test(filePath)) return null
  if (filePath.includes('types.ts') || filePath.includes('registry.ts')) return null

  // Check for wrappers object with default key
  if (content.includes('wrappers:')) {
    if (!content.includes('default:') && !content.includes('default :')) {
      return 'Experience must define wrappers.default'
    }
  }
  return null
}

/**
 * Check: Experience id is kebab-case
 * From spec: "Experience id is unique and kebab-case"
 */
const checkExperienceId: ValidationCheck = (content, filePath) => {
  if (!EXPERIENCE_PATH.test(filePath)) return null
  if (filePath.includes('types.ts') || filePath.includes('registry.ts')) return null

  const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/)
  if (idMatch) {
    const id = idMatch[1]
    if (!/^[a-z]+(-[a-z]+)*$/.test(id)) {
      return `Experience id must be kebab-case: "${id}" is invalid`
    }
  }
  return null
}

/**
 * Check: Experience has mode reference
 * From spec: "Experience mode references valid mode from registry"
 */
const checkExperienceMode: ValidationCheck = (content, filePath) => {
  if (!EXPERIENCE_PATH.test(filePath)) return null
  if (filePath.includes('types.ts') || filePath.includes('registry.ts')) return null

  if (!content.includes('mode:')) {
    return 'Experience must define mode reference'
  }
  return null
}

/**
 * Check: Experience has allowBehaviourOverride
 * From spec: "allowBehaviourOverride explicitly set"
 */
const checkAllowBehaviourOverride: ValidationCheck = (content, filePath) => {
  if (!EXPERIENCE_PATH.test(filePath)) return null
  if (filePath.includes('types.ts') || filePath.includes('registry.ts')) return null

  if (!content.includes('allowBehaviourOverride')) {
    return 'Experience must explicitly set allowBehaviourOverride'
  }
  return null
}

/**
 * Check: No JSX in experience
 * From spec: "No JSX in experience definitions"
 */
const checkNoJsxInExperience: ValidationCheck = (content, filePath) => {
  if (!EXPERIENCE_PATH.test(filePath)) return null
  if (filePath.includes('types.ts') || filePath.includes('registry.ts')) return null

  // Check for JSX patterns
  if (/<[A-Z][a-zA-Z]*/.test(content) || /return\s*\(?\s*</.test(content)) {
    return 'Experience definitions must be pure data - no JSX'
  }
  return null
}

/**
 * Check: Experience exports named constant
 */
const checkExportsExperience: ValidationCheck = (content, filePath) => {
  if (!EXPERIENCE_PATH.test(filePath)) return null
  if (filePath.includes('types.ts') || filePath.includes('registry.ts')) return null

  if (!content.includes('export const') || !content.includes('Experience')) {
    return 'Experience file must export named constant ending with "Experience"'
  }
  return null
}

// ─────────────────────────────────────────────────────────────
// Check Registry
// ─────────────────────────────────────────────────────────────

const checks: ValidationCheck[] = [
  // Preset checks
  checkExportsPreset,
  checkSiteDefaults,
  checkNoSiteImports,

  // Mode checks
  checkModeId,
  checkModeProvides,
  checkModeCreateStore,
  checkModeTriggers,
  checkSectionDefault,
  checkNoDomInStore,

  // Experience checks
  checkExperienceId,
  checkExperienceMode,
  checkDefaultWrapper,
  checkAllowBehaviourOverride,
  checkNoJsxInExperience,
  checkExportsExperience,
]

// ─────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/')
}

function isInDomain(filePath: string): boolean {
  return PRESET_PATH.test(filePath) || MODE_PATH.test(filePath) || EXPERIENCE_PATH.test(filePath)
}

function logFailure(filePath: string, errors: string[]): void {
  try {
    const logDir = dirname(LOG_PATH)
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true })
    }

    const timestamp = new Date().toISOString()
    const entry = [
      `[${timestamp}] FAIL ${VALIDATOR_NAME}.validator -> ${filePath}`,
      ...errors.map(e => `  x ${e}`),
      '',
    ].join('\n')

    appendFileSync(LOG_PATH, entry + '\n')
  } catch {
    // Logging should never break validation
  }
}

// ─────────────────────────────────────────────────────────────
// Runner
// ─────────────────────────────────────────────────────────────

function run() {
  let input: HookInput
  try {
    input = JSON.parse(readFileSync(0, 'utf-8'))
  } catch (e) {
    console.error('Validator execution error: Failed to parse stdin as JSON')
    process.exit(1)
  }

  const rawPath = input.tool_input.file_path || ''
  const filePath = normalizePath(rawPath)
  const content = input.tool_input.content || ''

  // Skip if not in any of our domains
  if (!isInDomain(filePath)) {
    process.exit(0)
  }

  // Skip if not matching extensions
  if (!EXTENSIONS.some(ext => filePath.endsWith(ext))) {
    process.exit(0)
  }

  // Run checks
  const errors = checks
    .map(check => check(content, filePath))
    .filter((error): error is string => error !== null)

  // Output and exit
  if (errors.length > 0) {
    logFailure(filePath, errors)
    console.error('\nPreset Validation Failed:\n')
    errors.forEach(e => console.error(`  x ${e}`))
    console.error('\nSee: ./preset.spec.md for requirements\n')
    process.exit(2)
  }

  process.exit(0)
}

run()
