#!/usr/bin/env npx tsx
/**
 * Contractor Validator
 *
 * Validates contractor outputs:
 * - Only touches agent contract files (.agent.md)
 * - Only touches type specs in agentic-framework/types/
 * - Cannot touch creativeshire specs
 *
 * Exit codes:
 *   0 = Pass
 *   1 = Validator crashed
 *   2 = Validation failed
 */

import { readFileSync } from 'fs'

interface HookInput {
  tool_name: string
  tool_input: { file_path?: string; content?: string }
}

function run() {
  let input: HookInput
  try {
    const rawInput = readFileSync(0, 'utf-8')
    input = JSON.parse(rawInput)
  } catch {
    console.error('[contractor-validator] Failed to read stdin')
    process.exit(1)
  }

  const filePath = input.tool_input.file_path || ''
  const normalizedPath = filePath.replace(/\\/g, '/')

  // Rule 1: Cannot touch creativeshire
  if (normalizedPath.includes('creativeshire')) {
    console.error('[contractor-validator] BLOCKED')
    console.error(`  Path: ${filePath}`)
    console.error('  Reason: contractor cannot modify creativeshire specs')
    process.exit(2)
  }

  // Rule 2: Must be in agentic-framework
  if (!normalizedPath.includes('agentic-framework')) {
    console.error('[contractor-validator] BLOCKED')
    console.error(`  Path: ${filePath}`)
    console.error('  Reason: contractor can only modify files in agentic-framework/')
    process.exit(2)
  }

  // Rule 3: Must be .agent.md or types/*.spec.md
  const isAgentContract = normalizedPath.endsWith('.agent.md')
  const isTypeSpec = normalizedPath.includes('/types/') && normalizedPath.endsWith('.spec.md')

  if (!isAgentContract && !isTypeSpec) {
    console.error('[contractor-validator] BLOCKED')
    console.error(`  Path: ${filePath}`)
    console.error('  Reason: contractor can only modify .agent.md files or types/*.spec.md')
    process.exit(2)
  }

  // Rule 4: Cannot touch validators
  if (normalizedPath.endsWith('.validator.ts')) {
    console.error('[contractor-validator] BLOCKED')
    console.error(`  Path: ${filePath}`)
    console.error('  Reason: contractor cannot modify validator files')
    process.exit(2)
  }

  console.log(`[contractor-validator] ✓ Pass: ${filePath}`)
  process.exit(0)
}

run()
