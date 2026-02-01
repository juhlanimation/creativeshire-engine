#!/usr/bin/env npx tsx
/**
 * Trigger Validator
 *
 * Validates files in engine/experience/triggers/
 *
 * Spec: ./trigger.spec.md
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

const VALIDATOR_NAME = 'trigger'

// Path pattern for trigger files
const DOMAIN_PATH = /engine\/experience\/triggers\//

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
 * Check: Hook name follows use{Name} convention
 * From spec: "Hook name follows use{Name} convention"
 */
const checkHookName: ValidationCheck = (content, filePath) => {
  // Only check use*.ts files
  if (!filePath.match(/use[A-Z][a-zA-Z]*\.ts$/)) return null

  // Extract the expected function name from filename
  const match = filePath.match(/\/(use[A-Z][a-zA-Z]*)\.ts$/)
  if (match) {
    const expectedName = match[1]
    if (!content.includes(`function ${expectedName}`) && !content.includes(`const ${expectedName}`)) {
      return `Trigger must export function named ${expectedName} matching filename`
    }
  }
  return null
}

/**
 * Check: Returns void
 * From spec: "Returns void (writes to store only)"
 */
const checkReturnsVoid: ValidationCheck = (content, filePath) => {
  if (!filePath.match(/use[A-Z][a-zA-Z]*\.ts$/)) return null
  if (filePath.includes('types')) return null

  // Check for explicit return type of void or no return
  const functionMatch = content.match(/function\s+use[A-Z][a-zA-Z]*[^{]*/)
  if (functionMatch) {
    const signature = functionMatch[0]
    // If there's a return type that's not void, warn
    if (signature.includes('): ') && !signature.includes('): void')) {
      return 'Trigger hook must return void - write to store instead of returning values'
    }
  }
  return null
}

/**
 * Check: Has cleanup function in useEffect
 * From spec: "Cleanup function returned from useEffect"
 */
const checkCleanup: ValidationCheck = (content, filePath) => {
  if (!filePath.match(/use[A-Z][a-zA-Z]*\.ts$/)) return null
  if (filePath.includes('types')) return null

  // Check if useEffect is used
  if (content.includes('useEffect')) {
    // Look for useEffect with return statement
    const useEffectMatch = content.match(/useEffect\s*\(\s*\(\s*\)\s*=>\s*{[\s\S]*?}\s*,/)
    if (useEffectMatch) {
      const effectBody = useEffectMatch[0]
      // Check for return statement
      if (!effectBody.includes('return')) {
        return 'Trigger useEffect must return cleanup function to remove event listeners'
      }
    }
  }
  return null
}

/**
 * Check: Passive listeners for scroll/touch
 * From spec: "Passive listeners for scroll/touch events"
 */
const checkPassiveListeners: ValidationCheck = (content, filePath) => {
  if (!filePath.match(/use[A-Z][a-zA-Z]*\.ts$/)) return null

  // Check for scroll/touch listeners
  const hasScrollListener = /addEventListener\s*\(\s*['"]scroll['"]/.test(content)
  const hasTouchListener = /addEventListener\s*\(\s*['"]touch/.test(content)
  const hasWheelListener = /addEventListener\s*\(\s*['"]wheel['"]/.test(content)

  if (hasScrollListener || hasTouchListener || hasWheelListener) {
    if (!content.includes('passive: true') && !content.includes('passive:true')) {
      return 'Scroll/touch/wheel event listeners must use { passive: true }'
    }
  }
  return null
}

/**
 * Check: SSR guard present
 * From spec: "SSR guard present"
 */
const checkSSRGuard: ValidationCheck = (content, filePath) => {
  if (!filePath.match(/use[A-Z][a-zA-Z]*\.ts$/)) return null
  if (filePath.includes('types')) return null

  // If using window, must have SSR guard
  if (content.includes('window.') || content.includes('document.')) {
    if (!content.includes("typeof window !== 'undefined'") &&
        !content.includes('typeof window === "undefined"') &&
        !content.includes("typeof window === 'undefined'") &&
        !content.includes('typeof window !== "undefined"')) {
      return 'Trigger must have SSR guard: typeof window !== "undefined"'
    }
  }
  return null
}

/**
 * Check: No direct DOM manipulation
 * From spec: "No direct DOM manipulation"
 */
const checkNoDomManipulation: ValidationCheck = (content, filePath) => {
  if (!filePath.match(/use[A-Z][a-zA-Z]*\.ts$/)) return null

  const domPatterns = [
    /\.style\.transform\s*=/,
    /\.style\.opacity\s*=/,
    /\.style\.top\s*=/,
    /\.style\.left\s*=/,
    /\.classList\./,
    /\.setAttribute/,
    /\.innerHTML\s*=/,
  ]

  for (const pattern of domPatterns) {
    if (pattern.test(content)) {
      return 'Triggers must not manipulate DOM directly - write to store only'
    }
  }
  return null
}

/**
 * Check: No CSS variable writes
 * From spec: "No CSS variable writes"
 */
const checkNoCssVariables: ValidationCheck = (content, filePath) => {
  if (!filePath.match(/use[A-Z][a-zA-Z]*\.ts$/)) return null

  if (content.includes('.setProperty(')) {
    return 'Triggers must not set CSS variables - write to store, let driver handle DOM'
  }
  return null
}

/**
 * Check: IntersectionObserver disconnects
 * From spec: "IntersectionObserver calls disconnect() on cleanup"
 */
const checkObserverDisconnect: ValidationCheck = (content, filePath) => {
  if (!filePath.match(/use[A-Z][a-zA-Z]*\.ts$/)) return null

  if (content.includes('IntersectionObserver')) {
    if (!content.includes('.disconnect()')) {
      return 'IntersectionObserver must call disconnect() in cleanup'
    }
  }
  return null
}

/**
 * Check: No useState return values
 * From spec: "Must not return values"
 */
const checkNoReturnValue: ValidationCheck = (content, filePath) => {
  if (!filePath.match(/use[A-Z][a-zA-Z]*\.ts$/)) return null
  if (filePath.includes('types')) return null

  // Check for useState that gets returned
  if (content.includes('useState')) {
    // Look for pattern: useState followed by return of the state value
    const stateMatch = content.match(/const\s+\[(\w+),/)
    if (stateMatch) {
      const stateName = stateMatch[1]
      // Check if this state is returned
      if (new RegExp(`return\\s+${stateName}\\s*[;\\n}]`).test(content)) {
        return 'Trigger must not return state values - write to store instead'
      }
    }
  }
  return null
}

/**
 * Check: Exports the hook function
 * From spec: Hook must be exported
 */
const checkExportsHook: ValidationCheck = (content, filePath) => {
  if (!filePath.match(/use[A-Z][a-zA-Z]*\.ts$/)) return null
  if (filePath.includes('types')) return null

  if (!content.includes('export function use') && !content.includes('export const use')) {
    return 'Trigger hook must be exported'
  }
  return null
}

// ─────────────────────────────────────────────────────────────
// Check Registry
// ─────────────────────────────────────────────────────────────

const checks: ValidationCheck[] = [
  // Naming checks
  checkHookName,
  checkExportsHook,

  // Signature checks
  checkReturnsVoid,
  checkNoReturnValue,

  // Cleanup checks
  checkCleanup,
  checkObserverDisconnect,

  // Event listener checks
  checkPassiveListeners,
  checkSSRGuard,

  // DOM safety checks
  checkNoDomManipulation,
  checkNoCssVariables,
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
    console.error('\nTrigger Validation Failed:\n')
    errors.forEach(e => console.error(`  x ${e}`))
    console.error('\nSee: ./trigger.spec.md for requirements\n')
    process.exit(2)
  }

  process.exit(0)
}

run()
