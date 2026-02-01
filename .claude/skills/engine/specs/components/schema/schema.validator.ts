#!/usr/bin/env npx tsx
/**
 * Schema Validator
 *
 * Validates files in engine/schema/
 *
 * Spec: ./schema.spec.md
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
const VALIDATOR_NAME = 'schema'

// Path pattern for this domain
// Use forward slashes - paths are normalized before matching
const DOMAIN_PATH = /engine\/schema\//

// File extensions to validate
const EXTENSIONS = ['.ts']

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
// Derive these from the Validation Checklist in the spec
// ─────────────────────────────────────────────────────────────

/**
 * Check: Type-only exports
 * From spec: "Export only types and interfaces"
 */
const checkTypeOnlyExports: ValidationCheck = (content, filePath) => {
  // Allow export type, export interface, export { type X }
  // Block: export const, export function, export class, export default (unless type)

  const lines = content.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Skip comments
    if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) continue

    // Check for disallowed exports
    if (/^export\s+(const|let|var|function|class)\s/.test(line)) {
      return `Line ${i + 1}: Schema files must only export types and interfaces, not runtime code`
    }

    // Check for export default that's not a type
    if (/^export\s+default\s+(?!type)/.test(line)) {
      return `Line ${i + 1}: Schema files must not export default (except 'export default type')`
    }
  }

  return null
}

/**
 * Check: No runtime imports
 * From spec: "Must not import runtime modules (React, Zustand, GSAP)"
 */
const checkNoRuntimeImports: ValidationCheck = (content) => {
  const runtimePatterns = [
    /from\s+['"]react['"]/,
    /from\s+['"]zustand['"]/,
    /from\s+['"]gsap['"]/,
    /from\s+['"]framer-motion['"]/,
    /from\s+['"]next['"]/,
    /from\s+['"].*\/(?:providers|hooks|behaviours|triggers|drivers)['"]/,
  ]

  for (const pattern of runtimePatterns) {
    if (pattern.test(content)) {
      return 'Schema files must not import runtime modules - types only'
    }
  }

  return null
}

/**
 * Check: No function implementations
 * From spec: "Must not export functions"
 */
const checkNoFunctionImpl: ValidationCheck = (content) => {
  // Look for function keyword or arrow functions at top level
  const lines = content.split('\n')
  let bracketDepth = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Skip comments
    if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) continue

    // Track interface/type blocks
    bracketDepth += (line.match(/{/g) || []).length
    bracketDepth -= (line.match(/}/g) || []).length

    // At top level (not inside interface/type)
    if (bracketDepth === 0) {
      // Check for function implementations (not type signatures)
      if (/function\s+\w+\s*\([^)]*\)\s*{/.test(line)) {
        return `Line ${i + 1}: Schema files must not contain function implementations`
      }

      // Check for arrow functions being assigned
      if (/const\s+\w+\s*=\s*\([^)]*\)\s*=>/.test(line)) {
        return `Line ${i + 1}: Schema files must not contain arrow function implementations`
      }
    }
  }

  return null
}

/**
 * Check: No const exports
 * From spec: "Must not export const values"
 */
const checkNoConstExports: ValidationCheck = (content) => {
  // Already covered by checkTypeOnlyExports, but explicit check
  if (/export\s+const\s/.test(content)) {
    return 'Schema files must not export const values - types only'
  }
  return null
}

/**
 * Check: No class definitions
 * From spec: "Must not export classes"
 */
const checkNoClassDefinitions: ValidationCheck = (content) => {
  if (/class\s+\w+/.test(content)) {
    return 'Schema files must not contain class definitions - use interfaces'
  }
  return null
}

/**
 * Check: No side effects
 * From spec: "Must not include side effects"
 */
const checkNoSideEffects: ValidationCheck = (content) => {
  const sideEffectPatterns = [
    /console\.(log|warn|error|info)/,
    /window\./,
    /document\./,
    /localStorage\./,
    /sessionStorage\./,
    /fetch\(/,
  ]

  for (const pattern of sideEffectPatterns) {
    if (pattern.test(content)) {
      return 'Schema files must not contain side effects - types only'
    }
  }

  return null
}

/**
 * Check: Barrel exports updated
 * From spec: "Export all types from barrel index.ts"
 */
const checkBarrelExports: ValidationCheck = (content, filePath) => {
  // Only check if this is the barrel file
  if (!filePath.endsWith('schema/index.ts')) return null

  // Barrel should only have export type/interface statements
  const lines = content.split('\n').filter(line => {
    const trimmed = line.trim()
    return trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*')
  })

  for (const line of lines) {
    // Must be export type or export { type ... }
    if (!line.match(/^export\s+(type\s+{|{?\s*type\s+)/)) {
      return 'Barrel index.ts must only contain type exports: export type { ... } from ...'
    }
  }

  return null
}

// ─────────────────────────────────────────────────────────────
// Check Registry
// ─────────────────────────────────────────────────────────────

const checks: ValidationCheck[] = [
  checkTypeOnlyExports,
  checkNoRuntimeImports,
  checkNoFunctionImpl,
  checkNoConstExports,
  checkNoClassDefinitions,
  checkNoSideEffects,
  checkBarrelExports,
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
    console.error('\nSchema Validation Failed:\n')
    errors.forEach(e => console.error(`  ✗ ${e}`))
    console.error('\nSee: ./schema.spec.md for requirements\n')
    process.exit(2) // Exit 2 = validation failure
  }

  process.exit(0) // Exit 0 = pass
}

run()
