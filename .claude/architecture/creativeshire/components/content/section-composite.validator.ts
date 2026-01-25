#!/usr/bin/env npx tsx
/**
 * Section Composite Validator
 *
 * Validates files in creativeshire/components/content/sections/composites/
 *
 * Spec: ./section-composite.spec.md
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
const VALIDATOR_NAME = 'section-composite'

// Path pattern for this domain
// Use forward slashes - paths are normalized before matching
const DOMAIN_PATH = /creativeshire\/(?:components\/)?content\/sections\/composites\//

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
// ─────────────────────────────────────────────────────────────

/**
 * Check: Factory function naming
 * From spec: "Function named create{Name}Section"
 */
const checkFactoryNaming: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('index.ts')) return null

  // Check for export function create{Name}Section
  if (!/export\s+function\s+create[A-Z][a-zA-Z]*Section/.test(content)) {
    return 'Factory function must be named create{Name}Section (e.g., createHeroSection)'
  }
  return null
}

/**
 * Check: Return type is SectionSchema
 * From spec: "Return type is SectionSchema"
 */
const checkReturnType: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('index.ts')) return null

  // Check for SectionSchema return type annotation
  if (!/:\s*SectionSchema\s*[{=]/.test(content) && !content.includes('): SectionSchema')) {
    return 'Factory function must have explicit SectionSchema return type'
  }
  return null
}

/**
 * Check: Props interface exported
 * From spec: "Props interface exported from types.ts"
 */
const checkPropsExported: ValidationCheck = (content, filePath) => {
  if (filePath.endsWith('types.ts') && !content.includes('export interface')) {
    return 'Props interface must be exported from types.ts'
  }
  return null
}

/**
 * Check: No React imports
 * From spec: "No React imports"
 */
const checkNoReactImports: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('.ts')) return null

  if (/import\s+(?:React|\{[^}]*\})\s+from\s+['"]react['"]/.test(content)) {
    return 'No React imports - composites are pure data functions'
  }
  return null
}

/**
 * Check: No JSX syntax
 * From spec: "No JSX syntax - return schema objects only"
 */
const checkNoJsx: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('.ts')) return null

  // Check for JSX-like syntax: <Component or <div
  if (/<[A-Z][a-zA-Z]*|<[a-z]+\s/.test(content)) {
    return 'No JSX syntax - composites return schema objects, not React elements'
  }
  return null
}

/**
 * Check: No experience layer imports
 * From spec: "No imports from experience/"
 */
const checkNoExperienceImports: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('.ts')) return null

  if (/from\s+['"].*experience\//.test(content)) {
    return 'No imports from experience/ - violates layer separation'
  }
  return null
}

/**
 * Check: No viewport units in features
 * From spec: "No viewport units in features"
 */
const checkNoViewportUnits: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('.ts')) return null

  if (/100[vd][hw]/.test(content)) {
    return 'No viewport units in features - BehaviourWrapper handles sizing'
  }
  return null
}

// ─────────────────────────────────────────────────────────────
// Check Registry
// ─────────────────────────────────────────────────────────────

const checks: ValidationCheck[] = [
  // Structure checks
  checkFactoryNaming,
  checkReturnType,
  checkPropsExported,

  // Constraint checks
  checkNoReactImports,
  checkNoJsx,
  checkNoExperienceImports,
  checkNoViewportUnits,
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
    console.error('\nSection Composite Validation Failed:\n')
    errors.forEach(e => console.error(`  x ${e}`))
    console.error('\nSee: ./section-composite.spec.md for requirements\n')
    process.exit(2)
  }

  process.exit(0)
}

run()
