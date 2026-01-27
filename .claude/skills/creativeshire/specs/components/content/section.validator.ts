#!/usr/bin/env npx tsx
/**
 * Section Validator
 *
 * Validates files in creativeshire/components/content/sections/
 *
 * Spec: ./section.spec.md
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

// Validator identity (used in logs)
const VALIDATOR_NAME = 'section'

// Path pattern for this domain (excludes composites subdirectory)
// Use forward slashes - paths are normalized before matching
const DOMAIN_PATH = /creativeshire\/(?:components\/)?content\/sections\/(?!composites)/

// File extensions to validate
const EXTENSIONS = ['.tsx', '.ts', '.css']

// Log file path (finds project root via .claude directory)
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
 * Check: Default export exists
 * From spec: "Default export from Section.tsx"
 */
const checkDefaultExport: ValidationCheck = (content, filePath) => {
  if (filePath.endsWith('.tsx') && filePath.includes('Section') && !content.includes('export default')) {
    return 'Section component must have a default export'
  }
  return null
}

/**
 * Check: No scroll/resize listeners
 * From spec: "No scroll/resize listeners - triggers handle this"
 */
const checkNoScrollListeners: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return null

  const pattern = /useEffect.*(?:scroll|resize)|addEventListener\s*\(\s*['"](?:scroll|resize)/
  if (pattern.test(content)) {
    return 'No scroll/resize listeners - handled by triggers in experience layer'
  }
  return null
}

/**
 * Check: No position fixed/sticky
 * From spec: "No position: fixed/sticky - BehaviourWrapper handles positioning"
 */
const checkNoPositionFixed: ValidationCheck = (content) => {
  if (/position:\s*(?:fixed|sticky)/.test(content)) {
    return 'No position: fixed/sticky - handled by BehaviourWrapper'
  }
  return null
}

/**
 * Check: No viewport units
 * From spec: "No viewport units (100vh, 100vw, 100dvh)"
 */
const checkNoViewportUnits: ValidationCheck = (content) => {
  if (/100[vd][hw]/.test(content)) {
    return 'No viewport units - BehaviourWrapper handles sizing'
  }
  return null
}

/**
 * Check: No experience layer imports
 * From spec: "No imports from experience/"
 */
const checkNoExperienceImports: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return null

  if (/from\s+['"].*experience\//.test(content)) {
    return 'No imports from experience/ - violates layer separation'
  }
  return null
}

/**
 * Check: CSS variables have fallbacks
 * From spec: "CSS variables have fallbacks"
 *
 * Valid:   var(--section-y, 0)
 * Invalid: var(--section-y)
 */
const checkCssVariableFallbacks: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('.css') && !filePath.endsWith('.tsx')) return null

  const lines = content.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const varMatches = line.matchAll(/var\(\s*(--[a-zA-Z0-9-]+)([^)]*)\)/g)

    for (const match of varMatches) {
      const varContent = match[2]
      if (!varContent.includes(',')) {
        return `CSS variable must have fallback at line ${i + 1}: var(${match[1]}) -> var(${match[1]}, fallback)`
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

  // Constraint checks (layer separation)
  checkNoScrollListeners,
  checkNoPositionFixed,
  checkNoViewportUnits,
  checkNoExperienceImports,

  // CSS checks
  checkCssVariableFallbacks,
]

// ─────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────

/**
 * Normalize file path to use forward slashes (for cross-platform regex matching)
 */
function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/')
}

/**
 * Log validation failure to .claude/logs/validation.log
 */
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
  // Parse stdin with error handling
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
    console.error('\nSection Validation Failed:\n')
    errors.forEach(e => console.error(`  x ${e}`))
    console.error('\nSee: ./section.spec.md for requirements\n')
    process.exit(2)
  }

  process.exit(0)
}

run()
