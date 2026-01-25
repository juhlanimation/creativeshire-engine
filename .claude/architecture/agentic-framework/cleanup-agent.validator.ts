#!/usr/bin/env npx tsx
/**
 * Cleanup Agent Composite Validator
 *
 * Enforces path rules for the cleanup agent.
 * This is a coordination agent - it only writes to task files, not code.
 *
 * Exit codes:
 *   0 = Pass (all checks passed)
 *   1 = Execution error (validator crashed)
 *   2 = Fail (validation failed)
 */

import { readFileSync, existsSync, appendFileSync, mkdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Agent identity (used in logs)
const AGENT_NAME = 'cleanup-agent'

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
 * Cleanup agent is a coordinator - no domain validators needed.
 */
const domainValidators: string[] = []

/**
 * Path rules for cleanup agent.
 * Allowlist mode: Only task files can be written.
 */
const pathRules: {
  mode: 'allowlist' | 'blocklist'
  patterns: RegExp[]
  message: string
} = {
  mode: 'allowlist',

  patterns: [
    /\.claude\/tasks\/.*\.md$/,  // Task files only
  ],

  message: 'Cleanup agent can only write to .claude/tasks/*.md files. Code changes must be delegated to specialist agents via tasks.',
}

/**
 * Validation mode for domain validators.
 */
const VALIDATION_MODE: 'fail-fast' | 'collect-all' = 'collect-all'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface HookInput {
  tool_name: string
  tool_input: { file_path?: string; content?: string }
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
// Main Runner
// ─────────────────────────────────────────────────────────────

function run() {
  // Read stdin
  let input: HookInput
  try {
    const rawInput = readFileSync(0, 'utf-8')
    input = JSON.parse(rawInput)
  } catch (e) {
    console.error('Composite validator error: Failed to read/parse stdin')
    process.exit(1)
  }

  const filePath = input.tool_input.file_path || ''

  // Check path rules
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

  // No domain validators for coordination agents
  // All checks passed
  process.exit(0)
}

run()
