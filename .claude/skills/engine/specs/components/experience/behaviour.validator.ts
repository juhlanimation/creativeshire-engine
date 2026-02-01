#!/usr/bin/env npx tsx
/**
 * Behaviour Validator
 *
 * Validates files in engine/experience/behaviours/
 *
 * Spec: ./behaviour.spec.md
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

const VALIDATOR_NAME = 'behaviour'

// Path pattern for behaviour files
const DOMAIN_PATH = /engine\/experience\/behaviours\//

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
// Validation Checks
// ─────────────────────────────────────────────────────────────

/**
 * Check: Default export exists in behaviour index.ts
 * From spec: "Default export from index.ts"
 */
const checkDefaultExport: ValidationCheck = (content, filePath) => {
  // Only check behaviour index.ts files (not infrastructure files)
  if (filePath.match(/behaviours\/[a-z-]+\/index\.ts$/) && !content.includes('export default')) {
    return 'Behaviour must have a default export from index.ts'
  }
  return null
}

/**
 * Check: Behaviour id is kebab-case
 * From spec: "Behaviour id is unique and kebab-case"
 */
const checkBehaviourId: ValidationCheck = (content, filePath) => {
  if (!filePath.match(/behaviours\/[a-z-]+\/index\.ts$/)) return null

  const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/)
  if (idMatch) {
    const id = idMatch[1]
    if (!/^[a-z]+(-[a-z]+)*$/.test(id)) {
      return `Behaviour id must be kebab-case: "${id}" is invalid`
    }
  }
  return null
}

/**
 * Check: Requires array is defined
 * From spec: "requires lists all state dependencies"
 */
const checkRequiresArray: ValidationCheck = (content, filePath) => {
  if (!filePath.match(/behaviours\/[a-z-]+\/index\.ts$/)) return null

  if (!content.includes('requires:')) {
    return 'Behaviour must define requires array listing state dependencies'
  }
  return null
}

/**
 * Check: CSSVariables keys are --prefixed
 * From spec: "compute returns CSSVariables type only (all keys --prefixed)"
 */
const checkCssVariablePrefix: ValidationCheck = (content, filePath) => {
  if (!filePath.match(/behaviours\/[a-z-]+\/index\.ts$/)) return null

  // Find return statements inside compute function
  const computeMatch = content.match(/compute:\s*\([^)]*\)\s*=>\s*\({[\s\S]*?\}[^}]*\)/)
  if (computeMatch) {
    const computeBody = computeMatch[0]
    // Look for object keys that don't start with --
    const keyMatches = computeBody.matchAll(/['"]?([a-zA-Z_][a-zA-Z0-9_-]*)['"]?\s*:/g)
    for (const match of keyMatches) {
      const key = match[1]
      // Skip compute, state, options (these are parameter names, not CSS keys)
      if (['compute', 'state', 'options'].includes(key)) continue
      // CSS variable keys must start with --
      if (!key.startsWith('--') && !key.startsWith("'--") && !key.startsWith('"--')) {
        // Check if it's actually a CSS variable key (inside return object)
        if (computeBody.includes(`'${key}'`) || computeBody.includes(`"${key}"`)) {
          return `CSS variable key must be --prefixed: "${key}" is invalid`
        }
      }
    }
  }
  return null
}

/**
 * Check: cssTemplate has fallbacks for all var() usages
 * From spec: "cssTemplate uses var(--x, fallback) for all variables"
 */
const checkCssTemplateFallbacks: ValidationCheck = (content, filePath) => {
  if (!filePath.match(/behaviours\/[a-z-]+\/index\.ts$/)) return null

  const templateMatch = content.match(/cssTemplate:\s*[`'"]([^`'"]*)[`'"]/)
  if (templateMatch) {
    const template = templateMatch[1]
    // Find var() usages without fallbacks
    const varMatches = template.matchAll(/var\(\s*(--[a-zA-Z0-9-]+)([^)]*)\)/g)
    for (const match of varMatches) {
      const varContent = match[2]
      if (!varContent.includes(',')) {
        return `cssTemplate var(${match[1]}) must have a fallback value`
      }
    }
  }
  return null
}

/**
 * Check: cssTemplate includes will-change for animated properties
 * From spec: "cssTemplate includes will-change for animated properties"
 */
const checkWillChange: ValidationCheck = (content, filePath) => {
  if (!filePath.match(/behaviours\/[a-z-]+\/index\.ts$/)) return null

  const templateMatch = content.match(/cssTemplate:\s*[`'"]([^`'"]*)[`'"]/)
  if (templateMatch) {
    const template = templateMatch[1]
    // Check if template has transform/opacity but no will-change
    const hasAnimated = /transform:|opacity:/.test(template)
    const hasWillChange = /will-change:/.test(template)
    if (hasAnimated && !hasWillChange) {
      return 'cssTemplate with animated properties must include will-change'
    }
  }
  return null
}

/**
 * Check: No DOM manipulation
 * From spec: "No direct DOM manipulation in compute"
 */
const checkNoDomManipulation: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return null
  // Skip infrastructure files
  if (filePath.includes('BehaviourWrapper') || filePath.includes('registry') || filePath.includes('resolve')) return null

  const domPatterns = [
    /document\.querySelector/,
    /document\.getElementById/,
    /document\.getElementsBy/,
    /\.style\s*=/,
    /\.classList\./,
    /\.setAttribute/,
    /\.innerHTML\s*=/,
  ]

  for (const pattern of domPatterns) {
    if (pattern.test(content)) {
      return 'Behaviours must not manipulate DOM directly - use CSS variables only'
    }
  }
  return null
}

/**
 * Check: No React state in compute
 * From spec: "No React state or hooks in compute"
 */
const checkNoReactState: ValidationCheck = (content, filePath) => {
  if (!filePath.match(/behaviours\/[a-z-]+\/index\.ts$/)) return null

  // Check for useState/useReducer which would be wrong in behaviour definition
  if (/use(State|Reducer)\s*\(/.test(content)) {
    return 'Behaviours must not use React state - compute must be a pure function'
  }
  return null
}

/**
 * Check: Registry uses import.meta.glob
 * From spec: "Registry uses import.meta.glob with eager loading"
 */
const checkRegistryGlob: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('registry.ts')) return null

  if (!content.includes('import.meta.glob')) {
    return 'Registry must use import.meta.glob for auto-discovery'
  }
  if (!content.includes('eager: true') && !content.includes('eager:true')) {
    return 'Registry must use eager loading: { eager: true }'
  }
  return null
}

/**
 * Check: BehaviourWrapper returns cleanup function
 * From spec: "BehaviourWrapper returns cleanup function from useEffect"
 */
const checkWrapperCleanup: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('BehaviourWrapper.tsx')) return null

  // Check for useEffect with return statement for cleanup
  const useEffectMatch = content.match(/useEffect\s*\(\s*\(\s*\)\s*=>\s*{[\s\S]*?}\s*,/)
  if (useEffectMatch) {
    const effectBody = useEffectMatch[0]
    if (!effectBody.includes('return')) {
      return 'BehaviourWrapper useEffect must return cleanup function to unregister'
    }
    if (!effectBody.includes('unregister')) {
      return 'BehaviourWrapper cleanup must call driver.unregister()'
    }
  }
  return null
}

/**
 * Check: Behaviour options have defaults
 * From spec: "Options have defaults for all configurable values"
 */
const checkOptionsDefaults: ValidationCheck = (content, filePath) => {
  if (!filePath.match(/behaviours\/[a-z-]+\/index\.ts$/)) return null

  // Find options definition
  const optionsMatch = content.match(/options:\s*{[\s\S]*?}\s*}/)
  if (optionsMatch) {
    const optionsBody = optionsMatch[0]
    // Check each option has a default
    const optionMatches = optionsBody.matchAll(/(\w+):\s*{\s*type:/g)
    for (const match of optionMatches) {
      const optionName = match[1]
      // Check if this option block has a default
      const optionBlockMatch = optionsBody.match(new RegExp(`${optionName}:\\s*{[^}]+}`))
      if (optionBlockMatch && !optionBlockMatch[0].includes('default:')) {
        return `Option "${optionName}" must have a default value`
      }
    }
  }
  return null
}

// ─────────────────────────────────────────────────────────────
// Check Registry
// ─────────────────────────────────────────────────────────────

const checks: ValidationCheck[] = [
  // Structure checks
  checkDefaultExport,
  checkBehaviourId,
  checkRequiresArray,
  checkOptionsDefaults,

  // Type safety checks
  checkCssVariablePrefix,
  checkCssTemplateFallbacks,
  checkWillChange,

  // Constraint checks
  checkNoDomManipulation,
  checkNoReactState,

  // Infrastructure checks
  checkRegistryGlob,
  checkWrapperCleanup,
]

// ─────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/')
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

  // Skip if not in this domain
  if (!DOMAIN_PATH.test(filePath)) {
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
    console.error('\nBehaviour Validation Failed:\n')
    errors.forEach(e => console.error(`  x ${e}`))
    console.error('\nSee: ./behaviour.spec.md for requirements\n')
    process.exit(2)
  }

  process.exit(0)
}

run()
