#!/usr/bin/env npx tsx
/**
 * Contractor Validator
 *
 * Validates contractor outputs:
 * - Only touches agent contract files (.agent.md) and type specs
 * - Cannot modify creativeshire architecture specs
 * - Can modify validators and entry points
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

  // Rule 1: Block creativeshire modifications
  if (filePath.includes('creativeshire')) {
    console.error('[contractor-validator] BLOCKED')
    console.error(`  Path: ${filePath}`)
    console.error('  Reason: Contractor cannot modify creativeshire specs - that is Technical Director domain')
    process.exit(2)
  }

  // Rule 2: Allow agent contracts, type specs, validators, and entry points
  const isAgentContract = filePath.includes('agentic-framework') && filePath.endsWith('.agent.md')
  const isTypeSpec = filePath.includes('agentic-framework/types') && filePath.endsWith('.spec.md')
  const isValidator = filePath.includes('agentic-framework') && filePath.endsWith('.validator.ts')
  const isEntryPoint = filePath.includes('.claude/agents') && filePath.endsWith('.md')

  if (!isAgentContract && !isTypeSpec && !isValidator && !isEntryPoint) {
    console.error('[contractor-validator] BLOCKED')
    console.error(`  Path: ${filePath}`)
    console.error('  Reason: Contractor can only modify agent contracts, type specs, validators, and entry points')
    process.exit(2)
  }

  console.log(`[contractor-validator] ✓ Pass: ${filePath}`)
  process.exit(0)
}

run()
