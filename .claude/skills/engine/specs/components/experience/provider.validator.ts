#!/usr/bin/env npx tsx
/**
 * Provider Validator
 *
 * Validates files in engine/experience/ that are providers
 *
 * Spec: ./provider.spec.md
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

const VALIDATOR_NAME = 'provider'

// Path pattern for provider files
const DOMAIN_PATH = /engine\/experience\//
const PROVIDER_FILE = /Provider\.tsx$/

// File extensions to validate
const EXTENSIONS = ['.tsx']

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
 * Check: ExperienceProvider exports useExperience hook
 * From spec: "Exports hook alongside provider"
 */
const checkExportsUseExperience: ValidationCheck = (content, filePath) => {
  if (!filePath.includes('ExperienceProvider')) return null

  if (!content.includes('export function useExperience') &&
      !content.includes('export const useExperience')) {
    return 'ExperienceProvider must export useExperience hook'
  }
  return null
}

/**
 * Check: DriverProvider exports useDriver hook
 * From spec: "Exports hook alongside provider"
 */
const checkExportsUseDriver: ValidationCheck = (content, filePath) => {
  if (!filePath.includes('DriverProvider')) return null

  if (!content.includes('export function useDriver') &&
      !content.includes('export const useDriver')) {
    return 'DriverProvider must export useDriver hook'
  }
  return null
}

/**
 * Check: Hook throws on missing context
 * From spec: "useExperience/useDriver throws if context is null"
 */
const checkHookThrows: ValidationCheck = (content, filePath) => {
  if (!PROVIDER_FILE.test(filePath)) return null

  // Find the hook function
  const hookPattern = /function\s+use(Experience|Driver)[^{]*{[\s\S]*?^}/gm
  const hookMatch = content.match(hookPattern)

  if (hookMatch) {
    for (const hook of hookMatch) {
      if (!hook.includes('throw') && !hook.includes('Error')) {
        return 'Provider hook must throw Error when context is null'
      }
    }
  }
  return null
}

/**
 * Check: Driver created in useEffect
 * From spec: "Driver created in useEffect (not during render)"
 */
const checkDriverInEffect: ValidationCheck = (content, filePath) => {
  if (!filePath.includes('DriverProvider')) return null

  // Check for driver creation
  if (content.includes('new ScrollDriver') || content.includes('new GSAPDriver')) {
    // Should be inside useEffect
    if (!content.match(/useEffect\s*\(\s*\(\s*\)\s*=>\s*{[\s\S]*?new\s+\w*Driver/)) {
      return 'Driver must be created inside useEffect, not during render'
    }
  }
  return null
}

/**
 * Check: Cleanup in useEffect
 * From spec: "driver.destroy() called in useEffect cleanup"
 */
const checkCleanupReturn: ValidationCheck = (content, filePath) => {
  if (!filePath.includes('DriverProvider')) return null

  // If there's useEffect with driver creation, check for cleanup
  if (content.includes('useEffect') && content.includes('Driver')) {
    const useEffectMatch = content.match(/useEffect\s*\(\s*\(\s*\)\s*=>\s*{[\s\S]*?}\s*,/)
    if (useEffectMatch) {
      const effectBody = useEffectMatch[0]
      if (!effectBody.includes('return')) {
        return 'DriverProvider useEffect must return cleanup function'
      }
      if (!effectBody.includes('.destroy()')) {
        return 'DriverProvider cleanup must call driver.destroy()'
      }
    }
  }
  return null
}

/**
 * Check: No useState for mode or store
 * From spec: "Provider receives mode/store from props (stateless)"
 */
const checkNoModeState: ValidationCheck = (content, filePath) => {
  if (!filePath.includes('ExperienceProvider')) return null

  // Check for useState with mode
  if (/useState\s*\(\s*mode\s*\)/.test(content) ||
      /useState.*mode/.test(content)) {
    return 'ExperienceProvider must not use useState for mode - receive from props'
  }

  // Check for useState with store
  if (/useState\s*\(\s*store\s*\)/.test(content) ||
      /useState.*store/.test(content)) {
    return 'ExperienceProvider must not use useState for store - receive from props'
  }
  return null
}

/**
 * Check: Uses useRef for driver instance
 * From spec: "useRef for driver instance"
 */
const checkUsesRef: ValidationCheck = (content, filePath) => {
  if (!filePath.includes('DriverProvider')) return null

  // If creating a driver, must use useRef
  if (content.includes('new ScrollDriver') || content.includes('new GSAPDriver')) {
    if (!content.includes('useRef')) {
      return 'DriverProvider must use useRef for driver instance'
    }
  }
  return null
}

/**
 * Check: No direct DOM manipulation
 * From spec: "No direct DOM manipulation in provider"
 */
const checkNoDom: ValidationCheck = (content, filePath) => {
  if (!PROVIDER_FILE.test(filePath)) return null

  const domPatterns = [
    /document\.querySelector/,
    /document\.getElementById/,
    /\.style\.transform\s*=/,
    /\.style\.opacity\s*=/,
    /\.classList\./,
    /\.setAttribute/,
    /\.setProperty\(/,
  ]

  for (const pattern of domPatterns) {
    if (pattern.test(content)) {
      return 'Providers must not manipulate DOM directly - drivers handle DOM updates'
    }
  }
  return null
}

/**
 * Check: Provider exports the provider function
 * From spec: Provider must be exported
 */
const checkExportsProvider: ValidationCheck = (content, filePath) => {
  if (!PROVIDER_FILE.test(filePath)) return null

  // Get provider name from filename
  const match = filePath.match(/(\w+Provider)\.tsx$/)
  if (match) {
    const providerName = match[1]
    if (!content.includes(`export function ${providerName}`)) {
      return `${providerName} must be exported`
    }
  }
  return null
}

/**
 * Check: createContext is used
 * From spec: Providers use React context
 */
const checkUsesCreateContext: ValidationCheck = (content, filePath) => {
  if (!PROVIDER_FILE.test(filePath)) return null

  if (!content.includes('createContext')) {
    return 'Provider must use createContext to create context'
  }
  return null
}

// ─────────────────────────────────────────────────────────────
// Check Registry
// ─────────────────────────────────────────────────────────────

const checks: ValidationCheck[] = [
  // Export checks
  checkExportsProvider,
  checkExportsUseExperience,
  checkExportsUseDriver,

  // Context checks
  checkUsesCreateContext,
  checkHookThrows,

  // Driver lifecycle checks
  checkDriverInEffect,
  checkCleanupReturn,
  checkUsesRef,

  // State checks
  checkNoModeState,

  // DOM safety
  checkNoDom,
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

  // Skip if not in experience folder
  if (!DOMAIN_PATH.test(filePath)) {
    process.exit(0)
  }

  // Skip if not a provider file
  if (!PROVIDER_FILE.test(filePath)) {
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
    console.error('\nProvider Validation Failed:\n')
    errors.forEach(e => console.error(`  x ${e}`))
    console.error('\nSee: ./provider.spec.md for requirements\n')
    process.exit(2)
  }

  process.exit(0)
}

run()
