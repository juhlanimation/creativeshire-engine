#!/usr/bin/env npx tsx
/**
 * Driver Validator
 *
 * Validates files in creativeshire/experience/drivers/
 *
 * Spec: ./driver.spec.md
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

const VALIDATOR_NAME = 'driver'

// Path pattern for driver files
const DOMAIN_PATH = /creativeshire\/experience\/drivers\//

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
 * Check: Scroll listeners use passive: true
 * From spec: "Event listeners use { passive: true }"
 */
const checkPassiveListener: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('Driver.ts')) return null

  // Check for scroll/resize listeners
  const hasScrollListener = /addEventListener\s*\(\s*['"]scroll['"]/.test(content)
  const hasResizeListener = /addEventListener\s*\(\s*['"]resize['"]/.test(content)

  if (hasScrollListener || hasResizeListener) {
    // Must have passive: true
    if (!content.includes('passive: true') && !content.includes('passive:true')) {
      return 'Scroll/resize event listeners must use { passive: true }'
    }
  }
  return null
}

/**
 * Check: Targets stored in Map
 * From spec: "Targets stored in Map<string, Target>"
 */
const checkTargetsMap: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('Driver.ts')) return null

  if (!content.includes('Map<') && !content.includes('new Map(')) {
    return 'Driver must store targets in a Map for O(1) lookup'
  }
  return null
}

/**
 * Check: Uses requestAnimationFrame
 * From spec: "Tick loop uses requestAnimationFrame"
 */
const checkRAF: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('Driver.ts')) return null

  // Skip GSAP driver which uses ScrollTrigger instead
  if (filePath.includes('GSAP')) return null

  if (!content.includes('requestAnimationFrame')) {
    return 'Driver must use requestAnimationFrame for tick loop'
  }
  return null
}

/**
 * Check: Uses setProperty for CSS variables
 * From spec: "Only call element.style.setProperty() for CSS variables"
 */
const checkSetPropertyOnly: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('Driver.ts')) return null

  // Should have setProperty calls
  if (!content.includes('.setProperty(')) {
    return 'Driver must use element.style.setProperty() to set CSS variables'
  }
  return null
}

/**
 * Check: No direct style assignment
 * From spec: "Never assign to element.style.* directly"
 */
const checkNoDirectStyle: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('Driver.ts')) return null

  // Pattern for direct style assignment (excluding setProperty)
  const directStylePatterns = [
    /\.style\.transform\s*=/,
    /\.style\.opacity\s*=/,
    /\.style\.top\s*=/,
    /\.style\.left\s*=/,
    /\.style\.width\s*=/,
    /\.style\.height\s*=/,
    /\.style\.position\s*=/,
    /\.style\.zIndex\s*=/,
  ]

  for (const pattern of directStylePatterns) {
    if (pattern.test(content)) {
      return 'Driver must not assign to element.style.* directly - use setProperty() for CSS variables'
    }
  }
  return null
}

/**
 * Check: Implements destroy method
 * From spec: "destroy() removes event listeners and clears Map"
 */
const checkDestroyMethod: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('Driver.ts')) return null

  if (!content.includes('destroy(') && !content.includes('destroy =')) {
    return 'Driver must implement destroy() method for cleanup'
  }
  return null
}

/**
 * Check: destroy removes event listeners
 * From spec: "destroy() removes event listeners"
 */
const checkDestroyCleanup: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('Driver.ts')) return null

  // If there's addEventListener, there should be removeEventListener
  if (content.includes('addEventListener')) {
    if (!content.includes('removeEventListener')) {
      return 'Driver must call removeEventListener in destroy() to prevent memory leaks'
    }
  }
  return null
}

/**
 * Check: destroy clears Map
 * From spec: "destroy() clears Map"
 */
const checkDestroyClear: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('Driver.ts')) return null

  // Skip GSAP driver which may not use Map
  if (filePath.includes('GSAP')) return null

  if (content.includes('new Map(') || content.includes('Map<')) {
    if (!content.includes('.clear()')) {
      return 'Driver must call Map.clear() in destroy() to prevent memory leaks'
    }
  }
  return null
}

/**
 * Check: No React state in driver
 * From spec: "No React state updates in driver tick loop"
 */
const checkNoReactState: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('Driver.ts')) return null

  // Check for useState/useReducer which should not be in drivers
  if (/use(State|Reducer)\s*\(/.test(content)) {
    return 'Driver must not use React state - causes re-renders every frame'
  }
  return null
}

/**
 * Check: GSAP cleanup
 * From spec: "GSAP ScrollTriggers killed on cleanup"
 */
const checkGSAPCleanup: ValidationCheck = (content, filePath) => {
  if (!filePath.includes('GSAP')) return null

  if (content.includes('ScrollTrigger.create')) {
    if (!content.includes('.kill()') && !content.includes('ScrollTrigger.kill')) {
      return 'GSAP ScrollTrigger must be killed on cleanup'
    }
  }
  return null
}

/**
 * Check: Register method exists
 * From spec: "register() adds target to Map"
 */
const checkRegisterMethod: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('Driver.ts')) return null
  if (filePath.includes('types')) return null

  if (!content.includes('register(') && !content.includes('register =')) {
    return 'Driver must implement register() method'
  }
  return null
}

/**
 * Check: Unregister method exists
 * From spec: "unregister() removes target from Map"
 */
const checkUnregisterMethod: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('Driver.ts')) return null
  if (filePath.includes('types')) return null

  if (!content.includes('unregister(') && !content.includes('unregister =')) {
    return 'Driver must implement unregister() method'
  }
  return null
}

// ─────────────────────────────────────────────────────────────
// Check Registry
// ─────────────────────────────────────────────────────────────

const checks: ValidationCheck[] = [
  // Core implementation checks
  checkPassiveListener,
  checkTargetsMap,
  checkRAF,
  checkSetPropertyOnly,
  checkNoDirectStyle,

  // Cleanup checks
  checkDestroyMethod,
  checkDestroyCleanup,
  checkDestroyClear,

  // Interface checks
  checkRegisterMethod,
  checkUnregisterMethod,

  // React safety
  checkNoReactState,

  // GSAP specific
  checkGSAPCleanup,
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
    console.error('\nDriver Validation Failed:\n')
    errors.forEach(e => console.error(`  x ${e}`))
    console.error('\nSee: ./driver.spec.md for requirements\n')
    process.exit(2)
  }

  process.exit(0)
}

run()
