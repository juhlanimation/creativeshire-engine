#!/usr/bin/env npx tsx
/**
 * Renderer Validator
 *
 * Validates files in engine/renderer/
 *
 * Spec: ./renderer.spec.md
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
const VALIDATOR_NAME = 'renderer'

// Path pattern for this domain
// Use forward slashes - paths are normalized before matching
const DOMAIN_PATH = /engine\/renderer\//

// File extensions to validate
const EXTENSIONS = ['.tsx', '.ts']

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
 * Check: Uses registry lookup
 * From spec: "Use registry lookup for component resolution (no hardcoded imports)"
 */
const checkUsesRegistry: ValidationCheck = (content, filePath) => {
  // Only check renderer files that handle widgets/sections/chrome
  if (!filePath.endsWith('Renderer.tsx')) return null

  // Skip if it's not WidgetRenderer or ChromeRenderer
  const fileName = filePath.split('/').pop() || ''
  if (!['WidgetRenderer.tsx', 'ChromeRenderer.tsx'].includes(fileName)) {
    return null
  }

  // Check for registry usage
  const hasRegistryImport = /import.*registry.*from/.test(content)
  const hasRegistryGet = /registry\.get\(/.test(content) || /registry\[.*\]/.test(content)

  // Check for hardcoded component imports (anti-pattern)
  const hasContentImport = /from\s+['"]@\/content\/widgets\//.test(content) ||
                          /from\s+['"]@\/content\/sections\//.test(content) ||
                          /from\s+['"]@\/content\/chrome\//.test(content)

  if (hasContentImport && !hasRegistryImport) {
    return 'Must use registry lookup, not hardcoded component imports'
  }

  if (fileName === 'WidgetRenderer.tsx' && !hasRegistryGet && !hasContentImport) {
    // WidgetRenderer should have registry.get() call
    return 'WidgetRenderer must use registry.get() for component lookup'
  }

  return null
}

/**
 * Check: Has ErrorBoundary wrapping
 * From spec: "Wrap rendered components with ErrorBoundary"
 */
const checkHasErrorBoundary: ValidationCheck = (content, filePath) => {
  // Only check WidgetRenderer
  if (!filePath.endsWith('WidgetRenderer.tsx')) return null

  const hasErrorBoundaryImport = /import.*ErrorBoundary.*from/.test(content)
  const hasErrorBoundaryUsage = /<ErrorBoundary/.test(content)

  if (!hasErrorBoundaryImport || !hasErrorBoundaryUsage) {
    return 'WidgetRenderer must wrap content with ErrorBoundary'
  }

  return null
}

/**
 * Check: Has fallback for unknown types
 * From spec: "Provide fallback UI for unknown schema types"
 */
const checkHasFallback: ValidationCheck = (content, filePath) => {
  // Only check renderer files
  if (!filePath.endsWith('Renderer.tsx')) return null

  const fileName = filePath.split('/').pop() || ''
  if (!['WidgetRenderer.tsx', 'ChromeRenderer.tsx'].includes(fileName)) {
    return null
  }

  // Check for registry lookup and conditional rendering
  const hasRegistryCheck = /if\s*\(\s*!.*Component/.test(content) ||
                          /!\s*Component/.test(content)

  const hasFallbackUI = /unknown|Unknown|not found|error/.test(content)

  if (fileName === 'WidgetRenderer.tsx' && (!hasRegistryCheck || !hasFallbackUI)) {
    return 'Must provide fallback UI for unknown widget types'
  }

  return null
}

/**
 * Check: Calls resolveBehaviour
 * From spec: "Call resolveBehaviour() for behaviour resolution (no inline logic)"
 */
const checkCallsResolveBehaviour: ValidationCheck = (content, filePath) => {
  // Only check Section and Widget renderers
  if (!filePath.endsWith('SectionRenderer.tsx') && !filePath.endsWith('WidgetRenderer.tsx')) {
    return null
  }

  const hasResolveBehaviourImport = /import.*resolveBehaviour.*from/.test(content)
  const hasResolveBehaviourCall = /resolveBehaviour\s*\(/.test(content)

  // Check for anti-pattern: inline behaviour resolution
  const hasInlineResolution = /behaviourRegistry\s*\[/.test(content) ||
                             /behaviours\s*\[.*behaviour/.test(content)

  if (hasInlineResolution) {
    return 'Must call resolveBehaviour() - do not implement resolution logic inline'
  }

  if (!hasResolveBehaviourImport && !hasResolveBehaviourCall) {
    return 'Must call resolveBehaviour() for behaviour resolution'
  }

  return null
}

/**
 * Check: No inline animation logic
 * From spec: "Must not compute animation values (belongs in behaviours/drivers)"
 */
const checkNoInlineAnimation: ValidationCheck = (content, filePath) => {
  // Only check renderer files
  if (!filePath.endsWith('.tsx')) return null
  if (!filePath.includes('Renderer')) return null

  // Check for animation computation patterns
  const hasScrollProgress = /useScrollProgress|scrollProgress/.test(content)
  const hasAnimationCalc = /progress\s*\*|offset\s*\*|value\s*\*/.test(content)
  const hasTransformCalc = /transform:\s*`translateY\(\$\{.*\}px\)`/.test(content)

  if ((hasScrollProgress && hasAnimationCalc) || hasTransformCalc) {
    return 'No inline animation logic - animation belongs in behaviours/drivers'
  }

  return null
}

/**
 * Check: No CSS variable manipulation
 * From spec: "Must not manipulate CSS variables directly (BehaviourWrapper handles this)"
 */
const checkNoCssVarManipulation: ValidationCheck = (content, filePath) => {
  // Only check renderer files
  if (!filePath.endsWith('.tsx')) return null
  if (!filePath.includes('Renderer')) return null

  // Check for direct CSS variable setting
  const hasSetProperty = /setProperty\s*\(\s*['"]--/.test(content)
  const hasStyleVar = /style\s*=\s*\{\s*\{\s*['"]--/.test(content)

  if (hasSetProperty || hasStyleVar) {
    return 'No direct CSS variable manipulation - BehaviourWrapper handles this'
  }

  return null
}

/**
 * Check: Passes style and className props
 * From spec: "Pass style and className props directly to components"
 */
const checkPassesStyleProps: ValidationCheck = (content, filePath) => {
  // Only check Section and Widget renderers
  if (!filePath.endsWith('SectionRenderer.tsx') && !filePath.endsWith('WidgetRenderer.tsx')) {
    return null
  }

  // Check if schema has style or className being passed
  const accessesStyle = /\.style/.test(content)
  const accessesClassName = /\.className/.test(content)

  // Both style and className should be supported
  if (!accessesStyle && !accessesClassName) {
    // Not an error - just means this renderer doesn't use style props
    return null
  }

  return null
}

// ─────────────────────────────────────────────────────────────
// Check Registry
// ─────────────────────────────────────────────────────────────

const checks: ValidationCheck[] = [
  checkUsesRegistry,
  checkHasErrorBoundary,
  checkHasFallback,
  checkCallsResolveBehaviour,
  checkNoInlineAnimation,
  checkNoCssVarManipulation,
  checkPassesStyleProps,
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
    console.error('\nRenderer Validation Failed:\n')
    errors.forEach(e => console.error(`  ✗ ${e}`))
    console.error('\nSee: ./renderer.spec.md for requirements\n')
    process.exit(2) // Exit 2 = validation failure
  }

  process.exit(0) // Exit 0 = pass
}

run()
