#!/usr/bin/env npx tsx
/**
 * {Domain} Validator
 *
 * Validates files in creativeshire/{layer}/{domain}/
 *
 * Spec: ./{domain}.spec.md
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
const VALIDATOR_NAME = '{domain}'

// Path pattern for this domain (adjust {layer} and {domain})
// Use forward slashes - paths are normalized before matching
const DOMAIN_PATH = /creativeshire\/{layer}\/{domain}\//

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
// Shared Utility Imports (compose from _shared/)
// ─────────────────────────────────────────────────────────────

// Uncomment and adjust paths as needed:
// import { checkFolderStructure } from '../../_shared/folder-structure.validator.js'
// import { checkContentLayerContract } from '../../_shared/contracts.util.js'
// import { PATTERNS } from '../../_shared/patterns.util.js'

// ─────────────────────────────────────────────────────────────
// Validation Checks
// Derive these from the Validation Checklist in your spec
// ─────────────────────────────────────────────────────────────

/**
 * Check: Default export exists
 * From spec: "Components must have a default export"
 */
const checkDefaultExport: ValidationCheck = (content, filePath) => {
  if (filePath.endsWith('.tsx') && !content.includes('export default')) {
    return '{Domain} component must have a default export'
  }
  return null
}

/**
 * Check: Props interface exported
 * From spec: "Props interface must be exported from types.ts"
 */
const checkPropsExported: ValidationCheck = (content, filePath) => {
  if (filePath.endsWith('types.ts') && !content.includes('export interface')) {
    return 'Props interface must be exported from types.ts'
  }
  return null
}

/**
 * Check: No scroll/resize listeners
 * From spec: "No useEffect with scroll/resize listeners"
 */
const checkNoScrollListeners: ValidationCheck = (content, filePath) => {
  // Only check TypeScript files
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return null

  const pattern = /useEffect.*(?:scroll|resize)|addEventListener\s*\(\s*['"](?:scroll|resize)/
  if (pattern.test(content)) {
    return 'No scroll/resize listeners - handled by triggers in experience layer'
  }
  return null
}

/**
 * Check: No position fixed/sticky
 * From spec: "No position: fixed or position: sticky"
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
  // Only check TypeScript files
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return null

  if (/from\s+['"].*experience\//.test(content)) {
    return 'No imports from experience/ - violates layer separation'
  }
  return null
}

/**
 * Check: CSS variables have fallbacks
 * From spec: "CSS variables must have fallbacks"
 *
 * Valid:   var(--opacity, 1)
 * Invalid: var(--opacity)
 */
const checkCssVariableFallbacks: ValidationCheck = (content, filePath) => {
  // Only check files that can contain CSS
  if (!filePath.endsWith('.css') && !filePath.endsWith('.tsx')) return null

  // Match var(--name) that does NOT have a comma (meaning no fallback)
  // This regex finds: var(--something) where there's no comma before the closing paren
  const lines = content.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // Find all var() usages in the line
    const varMatches = line.matchAll(/var\(\s*(--[a-zA-Z0-9-]+)([^)]*)\)/g)

    for (const match of varMatches) {
      const varContent = match[2] // Everything after the variable name
      // If there's no comma, there's no fallback
      if (!varContent.includes(',')) {
        return `CSS variable must have fallback at line ${i + 1}: var(${match[1]}) → var(${match[1]}, fallback)`
      }
    }
  }

  return null
}

// ─────────────────────────────────────────────────────────────
// Domain-Specific Checks
// Add checks unique to this domain here
// ─────────────────────────────────────────────────────────────

// Example domain-specific check:
// const check{Domain}Specific: ValidationCheck = (content, filePath) => {
//   if (/* condition */) {
//     return '{Domain} specific error message'
//   }
//   return null
// }

// ─────────────────────────────────────────────────────────────
// Check Registry
// ─────────────────────────────────────────────────────────────

const checks: ValidationCheck[] = [
  // Structure checks
  checkDefaultExport,
  checkPropsExported,

  // Constraint checks (layer separation)
  checkNoScrollListeners,
  checkNoPositionFixed,
  checkNoViewportUnits,
  checkNoExperienceImports,

  // CSS checks
  checkCssVariableFallbacks,

  // Domain-specific checks
  // check{Domain}Specific,
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
      `[${timestamp}] FAIL ${VALIDATOR_NAME}.validator → ${filePath}`,
      ...errors.map(e => `  ✗ ${e}`),
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
    process.exit(1) // Exit 1 = execution error, not validation failure
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
    console.error('\n{Domain} Validation Failed:\n')
    errors.forEach(e => console.error(`  ✗ ${e}`))
    console.error('\nSee: ./{domain}.spec.md for requirements\n')
    process.exit(2) // Exit 2 = validation failure
  }

  process.exit(0) // Exit 0 = pass
}

run()
