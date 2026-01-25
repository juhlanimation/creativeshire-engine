#!/usr/bin/env npx tsx
/**
 * Page Builder Composite Validator
 *
 * Chains domain validators and/or enforces path rules for this agent.
 * Lives next to agent contract: ./page-builder.agent.md
 *
 * This file is the wiring layer (HOW) that connects an agent to:
 * - Domain validators (WHAT IS VALID for code)
 * - Path rules (WHERE the agent can write)
 *
 * Exit codes:
 *   0 = Pass (all checks passed)
 *   1 = Execution error (validator crashed)
 *   2 = Fail (validation failed)
 */

import { execSync } from 'child_process'
import { readFileSync, existsSync, appendFileSync, mkdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Agent identity (used in logs)
const AGENT_NAME = 'page-builder'

// Log file path (finds project root via .claude directory)
function getLogPath(): string {
  let dir = __dirname
  while (dir !== dirname(dir)) {
    if (existsSync(resolve(dir, '.claude'))) {
      return resolve(dir, `.claude/logs/${AGENT_NAME}.validation.log`)
    }
    dir = dirname(dir)
  }
  return resolve(__dirname, `.claude/logs/${AGENT_NAME}.validation.log`)
}
const LOG_PATH = getLogPath()

// ─────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────

/**
 * Domain validators this agent must pass.
 * Paths are relative to this file's location.
 *
 * For executors (builders): chain to domain validators
 * For coordinators: leave empty or remove
 */
const domainValidators: string[] = [
  '../../creativeshire/components/site/site.validator.ts',
]

/**
 * Path rules for this agent.
 * Define what paths this agent CAN or CANNOT write to.
 *
 * For executors: typically allow their domain, block others
 * For coordinators: allow task files, block code
 */
const pathRules: {
  mode: 'allowlist' | 'blocklist'
  patterns: RegExp[]
  message: string
} = {
  // Choose mode:
  // - 'allowlist': only paths matching patterns are allowed
  // - 'blocklist': paths matching patterns are blocked

  mode: 'allowlist',

  patterns: [
    /site\/pages\//,      // Page definition files
    /site\/config\.ts$/,  // Site config (for pages array updates)
  ],

  message: 'page-builder can only write to site/pages/ and site/config.ts. Check your contract.',
}

/**
 * Validation mode for domain validators:
 * - 'fail-fast': Stop on first error
 * - 'collect-all': Run all validators, report all errors
 */
const VALIDATION_MODE: 'fail-fast' | 'collect-all' = 'collect-all'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface HookInput {
  tool_name: string
  tool_input: { file_path?: string; content?: string }
}

interface ValidatorResult {
  validator: string
  exitCode: number
  passed: boolean
}

// ─────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/')
}

/**
 * Log path block to .claude/logs/validation.log
 */
function logPathBlock(filePath: string, reason: string): void {
  try {
    const logDir = dirname(LOG_PATH)
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true })
    }

    const timestamp = new Date().toISOString()
    const entry = `[${timestamp}] BLOCKED ${AGENT_NAME} → ${filePath}\n  Reason: ${reason}\n`

    appendFileSync(LOG_PATH, entry + '\n')
  } catch {
    // Logging should never break validation
  }
}

// ─────────────────────────────────────────────────────────────
// Path Validation
// ─────────────────────────────────────────────────────────────

function checkPathRules(filePath: string): { allowed: boolean; reason?: string } {
  // Skip if no patterns defined
  if (pathRules.patterns.length === 0) {
    return { allowed: true }
  }

  const normalized = normalizePath(filePath)
  const matchesPattern = pathRules.patterns.some(p => p.test(normalized))

  if (pathRules.mode === 'allowlist') {
    // Allowlist: must match at least one pattern
    if (!matchesPattern) {
      return { allowed: false, reason: pathRules.message }
    }
  } else {
    // Blocklist: must NOT match any pattern
    if (matchesPattern) {
      return { allowed: false, reason: pathRules.message }
    }
  }

  return { allowed: true }
}

// ─────────────────────────────────────────────────────────────
// Domain Validator Runner
// ─────────────────────────────────────────────────────────────

function runDomainValidators(input: string): { passed: boolean; exitCode: number } {
  if (domainValidators.length === 0) {
    return { passed: true, exitCode: 0 }
  }

  const results: ValidatorResult[] = []
  let hasFailure = false

  for (const validator of domainValidators) {
    const validatorPath = resolve(__dirname, validator)
    const validatorName = validator.split('/').pop() || validator

    // Check validator exists
    if (!existsSync(validatorPath)) {
      console.error(`\nComposite validator error: Validator not found`)
      console.error(`  Path: ${validatorPath}`)
      console.error(`  Hint: Create the domain validator or update the path\n`)
      return { passed: false, exitCode: 1 }
    }

    console.error(`Running: ${validatorName}`)

    try {
      execSync(`npx tsx "${validatorPath}"`, {
        input,
        stdio: ['pipe', 'inherit', 'inherit'],
      })

      results.push({ validator: validatorName, exitCode: 0, passed: true })
      console.error(`  ✓ Passed\n`)
    } catch (e: unknown) {
      const error = e as { status?: number }
      const exitCode = error.status || 2

      results.push({ validator: validatorName, exitCode, passed: false })
      hasFailure = true

      if (exitCode === 1) {
        console.error(`  ✗ Execution error (validator crashed)\n`)
      } else {
        console.error(`  ✗ Validation failed\n`)
      }

      if (VALIDATION_MODE === 'fail-fast') {
        return { passed: false, exitCode }
      }
    }
  }

  // Summary
  if (VALIDATION_MODE === 'collect-all' && domainValidators.length > 1) {
    const passed = results.filter(r => r.passed).length
    const failed = results.filter(r => !r.passed).length
    console.error(`\nDomain Validation: ${passed}/${results.length} passed, ${failed} failed\n`)
  }

  if (hasFailure) {
    const hasExecutionError = results.some(r => r.exitCode === 1)
    return { passed: false, exitCode: hasExecutionError ? 1 : 2 }
  }

  return { passed: true, exitCode: 0 }
}

// ─────────────────────────────────────────────────────────────
// Main Runner
// ─────────────────────────────────────────────────────────────

function run() {
  // Read stdin
  let input: HookInput
  let rawInput: string
  try {
    rawInput = readFileSync(0, 'utf-8')
    input = JSON.parse(rawInput)
  } catch (e) {
    console.error('Composite validator error: Failed to read/parse stdin')
    process.exit(1)
  }

  const filePath = input.tool_input.file_path || ''

  // Step 1: Check path rules
  const pathCheck = checkPathRules(filePath)
  if (!pathCheck.allowed) {
    logPathBlock(filePath, pathCheck.reason || 'Path not allowed')
    console.error('\n─────────────────────────────────────')
    console.error('BLOCKED: Path not allowed')
    console.error('─────────────────────────────────────')
    console.error(`\nPath: ${filePath}`)
    console.error(`Reason: ${pathCheck.reason}\n`)
    process.exit(2)
  }

  // Step 2: Run domain validators
  const domainCheck = runDomainValidators(rawInput)
  if (!domainCheck.passed) {
    process.exit(domainCheck.exitCode)
  }

  // All checks passed
  process.exit(0)
}

run()
