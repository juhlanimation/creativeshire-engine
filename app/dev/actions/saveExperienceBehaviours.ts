/**
 * Server action: patch sectionBehaviours and chromeBehaviours in an experience's index.ts.
 * Uses brace-balanced block replacement (not regex) since behaviour blocks have nested braces.
 */

'use server'

import { readFile, writeFile } from 'fs/promises'
import path from 'path'

import type { BehaviourAssignment } from '../../../engine/experience/experiences/types'

// =============================================================================
// Serialization
// =============================================================================

/** Serialize a JS value to a TypeScript literal string */
function serializeValue(value: unknown, indent: number): string {
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'
  if (typeof value === 'string') return `'${value.replace(/'/g, "\\'")}'`
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const pad = '  '.repeat(indent)
    const innerPad = '  '.repeat(indent + 1)
    const items = value.map((v) => `${innerPad}${serializeValue(v, indent + 1)}`).join(',\n')
    return `[\n${items},\n${pad}]`
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const keys = Object.keys(obj)
    if (keys.length === 0) return '{}'
    const pad = '  '.repeat(indent)
    const innerPad = '  '.repeat(indent + 1)
    const entries = keys
      .map((k) => {
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `'${k}'`
        return `${innerPad}${safeKey}: ${serializeValue(obj[k], indent + 1)}`
      })
      .join(',\n')
    return `{\n${entries},\n${pad}}`
  }
  return JSON.stringify(value)
}

/** Serialize a BehaviourAssignment to a compact inline TS literal */
function serializeAssignment(a: BehaviourAssignment): string {
  const parts: string[] = [`behaviour: '${a.behaviour}'`]
  if (a.options && Object.keys(a.options).length > 0) {
    const opts = Object.entries(a.options)
      .map(([k, v]) => `${k}: ${serializeValue(v, 0)}`)
      .join(', ')
    parts.push(`options: { ${opts} }`)
  }
  if (a.pinned) parts.push('pinned: true')
  return `{ ${parts.join(', ')} }`
}

/** Serialize a full behaviours record block (sectionBehaviours or chromeBehaviours) */
function serializeBehavioursBlock(
  record: Record<string, BehaviourAssignment[]>,
  indent: number,
): string {
  const keys = Object.keys(record)
  if (keys.length === 0) return '{}'
  const pad = '  '.repeat(indent)
  const innerPad = '  '.repeat(indent + 1)
  const entries = keys.map((k) => {
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `'${k}'`
    const assignments = record[k]
    if (assignments.length === 0) return `${innerPad}${safeKey}: []`
    if (assignments.length === 1) {
      return `${innerPad}${safeKey}: [${serializeAssignment(assignments[0])}]`
    }
    const items = assignments.map((a) => `${innerPad}  ${serializeAssignment(a)}`).join(',\n')
    return `${innerPad}${safeKey}: [\n${items},\n${innerPad}]`
  })
  return `{\n${entries.join(',\n')},\n${pad}}`
}

// =============================================================================
// Brace-balanced matching
// =============================================================================

/**
 * Find the balanced closing brace for an opening brace at `startIdx`.
 * Returns the index of the matching `}`, or -1 if unbalanced.
 */
function findBalancedClose(content: string, startIdx: number): number {
  let depth = 0
  let inString: false | '\'' | '"' | '`' = false
  for (let i = startIdx; i < content.length; i++) {
    const ch = content[i]
    const prev = i > 0 ? content[i - 1] : ''

    if (inString) {
      if (ch === inString && prev !== '\\') inString = false
      continue
    }

    if (ch === '\'' || ch === '"' || ch === '`') {
      inString = ch
      continue
    }

    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

/**
 * Find and replace a top-level field (e.g. `sectionBehaviours: { ... }`) in file content.
 * Returns the modified content, or null if the field wasn't found.
 */
function replaceFieldBlock(content: string, fieldName: string, newBlock: string): string | null {
  // Find `fieldName:` followed by optional whitespace then `{`
  const fieldPattern = new RegExp(`(${fieldName}\\s*:\\s*)`)
  const fieldMatch = content.match(fieldPattern)
  if (!fieldMatch || fieldMatch.index === undefined) return null

  const afterColon = fieldMatch.index + fieldMatch[0].length
  // Find the opening brace
  const openBrace = content.indexOf('{', afterColon)
  if (openBrace === -1 || content.slice(afterColon, openBrace).trim() !== '') return null

  const closeBrace = findBalancedClose(content, openBrace)
  if (closeBrace === -1) return null

  // Include trailing comma if present
  let endIdx = closeBrace + 1
  const afterClose = content.slice(endIdx)
  const commaMatch = afterClose.match(/^(\s*,)/)
  if (commaMatch) endIdx += commaMatch[1].length

  return content.slice(0, fieldMatch.index) + `${fieldName}: ${newBlock},` + content.slice(endIdx)
}

/**
 * Insert a new field after an existing field in the file content.
 * Finds the end of `afterField: { ... },` and inserts the new field after it.
 */
function insertFieldAfter(content: string, afterField: string, fieldName: string, block: string): string | null {
  const fieldPattern = new RegExp(`${afterField}\\s*:\\s*`)
  const fieldMatch = content.match(fieldPattern)
  if (!fieldMatch || fieldMatch.index === undefined) return null

  const afterColon = fieldMatch.index + fieldMatch[0].length
  const openBrace = content.indexOf('{', afterColon)
  if (openBrace === -1) return null

  const closeBrace = findBalancedClose(content, openBrace)
  if (closeBrace === -1) return null

  // Find end of trailing comma + whitespace
  let insertIdx = closeBrace + 1
  const afterClose = content.slice(insertIdx)
  const commaMatch = afterClose.match(/^(\s*,)/)
  if (commaMatch) insertIdx += commaMatch[1].length

  // Detect indentation from the existing field
  const lineStart = content.lastIndexOf('\n', fieldMatch.index)
  const indent = content.slice(lineStart + 1, fieldMatch.index)

  return (
    content.slice(0, insertIdx) +
    `\n${indent}${fieldName}: ${block},` +
    content.slice(insertIdx)
  )
}

// =============================================================================
// Server Action
// =============================================================================

export async function saveExperienceBehaviours(
  experienceId: string,
  sectionBehaviours: Record<string, BehaviourAssignment[]>,
  chromeBehaviours: Record<string, BehaviourAssignment[]>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const filePath = path.resolve(
      process.cwd(),
      'engine/experience/experiences',
      experienceId,
      'index.ts',
    )

    let content: string
    try {
      content = await readFile(filePath, 'utf-8')
    } catch {
      return { ok: false, error: `Experience file not found: ${filePath}` }
    }

    // 1. Replace sectionBehaviours
    const sectionBlock = serializeBehavioursBlock(sectionBehaviours, 1)
    const afterSection = replaceFieldBlock(content, 'sectionBehaviours', sectionBlock)
    if (!afterSection) {
      return { ok: false, error: `Could not find sectionBehaviours in ${experienceId}/index.ts` }
    }
    content = afterSection

    // 2. Replace or insert chromeBehaviours
    const hasChrome = Object.keys(chromeBehaviours).length > 0
    const existingChrome = content.match(/chromeBehaviours\s*:/)

    if (existingChrome) {
      if (hasChrome) {
        const chromeBlock = serializeBehavioursBlock(chromeBehaviours, 1)
        const afterChrome = replaceFieldBlock(content, 'chromeBehaviours', chromeBlock)
        if (!afterChrome) {
          return { ok: false, error: `Could not replace chromeBehaviours in ${experienceId}/index.ts` }
        }
        content = afterChrome
      } else {
        // Remove the chromeBehaviours field entirely (it's empty)
        const fieldPattern = /\n\s*chromeBehaviours\s*:\s*/
        const match = content.match(fieldPattern)
        if (match && match.index !== undefined) {
          const afterColon = match.index + match[0].length
          const openBrace = content.indexOf('{', afterColon)
          if (openBrace !== -1 && content.slice(afterColon, openBrace).trim() === '') {
            const closeBrace = findBalancedClose(content, openBrace)
            if (closeBrace !== -1) {
              let endIdx = closeBrace + 1
              const afterClose = content.slice(endIdx)
              const commaMatch = afterClose.match(/^(\s*,)/)
              if (commaMatch) endIdx += commaMatch[1].length
              content = content.slice(0, match.index) + content.slice(endIdx)
            }
          }
        }
      }
    } else if (hasChrome) {
      // Insert after sectionBehaviours
      const chromeBlock = serializeBehavioursBlock(chromeBehaviours, 1)
      const afterInsert = insertFieldAfter(content, 'sectionBehaviours', 'chromeBehaviours', chromeBlock)
      if (afterInsert) {
        content = afterInsert
      }
    }

    await writeFile(filePath, content, 'utf-8')
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}
