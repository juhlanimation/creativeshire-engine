#!/usr/bin/env npx tsx
/**
 * Feature Validator
 *
 * Validates files in creativeshire/components/content/features/
 *
 * Spec: ./feature.spec.md
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
const VALIDATOR_NAME = 'feature'

// Path pattern for this domain
// Use forward slashes - paths are normalized before matching
const DOMAIN_PATH = /creativeshire\/(?:components\/)?content\/features\//

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
 * Check: No React hooks
 * From spec: "No React hooks in feature functions - features are pure"
 */
const checkNoReactHooks: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('.ts')) return null

  // Check for useState, useEffect, useRef, etc.
  if (/\buse[A-Z][a-zA-Z]*\s*\(/.test(content)) {
    // Allow useFeatures which is the exported hook name, not a React hook
    const withoutUseFeatures = content.replace(/useFeatures/g, '')
    if (/\buse[A-Z][a-zA-Z]*\s*\(/.test(withoutUseFeatures)) {
      return 'No React hooks in feature functions - features must be pure'
    }
  }
  return null
}

/**
 * Check: No event listeners
 * From spec: "No event listeners - no scroll, resize, or DOM events"
 */
const checkNoEventListeners: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('.ts')) return null

  if (/addEventListener\s*\(/.test(content)) {
    return 'No event listeners - features are static and pure'
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
 * Check: No dynamic CSS variables
 * From spec: "No dynamic CSS variables - only static values"
 */
const checkNoDynamicCssVars: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('.ts')) return null

  // Check for var(--something) in return values
  if (/return\s*\{[^}]*var\s*\(\s*--/.test(content)) {
    return 'No dynamic CSS variables - features return static values only'
  }
  return null
}

/**
 * Check: No viewport units
 * From spec: "No viewport units (100vh, 100vw, 100dvh)"
 */
const checkNoViewportUnits: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('.ts')) return null

  if (/100[vd][hw]/.test(content)) {
    return 'No viewport units - extrinsic sizing belongs in BehaviourWrapper'
  }
  return null
}

/**
 * Check: No will-change
 * From spec: "No will-change property - belongs to behaviours"
 */
const checkNoWillChange: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('.ts')) return null

  if (/willChange\s*:|will-change\s*:/.test(content)) {
    return 'No will-change - animation optimization belongs in behaviours'
  }
  return null
}

/**
 * Check: No transitions/animations
 * From spec: "No transitions or animations - belongs to behaviours"
 */
const checkNoAnimations: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('.ts')) return null

  if (/transition\s*:|animation\s*:/.test(content)) {
    return 'No transitions or animations - these belong in behaviours'
  }
  return null
}

// ─────────────────────────────────────────────────────────────
// Check Registry
// ─────────────────────────────────────────────────────────────

const checks: ValidationCheck[] = [
  // Purity checks
  checkNoReactHooks,
  checkNoEventListeners,

  // Layer separation
  checkNoExperienceImports,

  // Static value checks
  checkNoDynamicCssVars,
  checkNoViewportUnits,
  checkNoWillChange,
  checkNoAnimations,
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
    console.error('\nFeature Validation Failed:\n')
    errors.forEach(e => console.error(`  x ${e}`))
    console.error('\nSee: ./feature.spec.md for requirements\n')
    process.exit(2)
  }

  process.exit(0)
}

run()
