/**
 * Vite plugin for the "Save as Defaults" Storybook addon.
 *
 * Server-side: scans engine meta.ts files, builds id→path map,
 * exposes POST /__save-meta-defaults to update default: values in meta.ts.
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { globSync } from 'glob'
import type { Plugin, ViteDevServer } from 'vite'

const META_GLOBS = [
  'engine/content/widgets/*/*/meta.ts',
  'engine/content/widgets/repeaters/*/meta.ts',
  'engine/content/sections/patterns/*/meta.ts',
  'engine/content/sections/patterns/*/components/*/meta.ts',
  'engine/content/chrome/patterns/*/meta.ts',
  'engine/content/chrome/overlays/*/meta.ts',
  'engine/experience/behaviours/*/*/meta.ts',
  'engine/experience/experiences/*/meta.ts',
]

/**
 * Build a map of meta id → absolute file path by scanning meta.ts files.
 */
function buildMetaMap(root: string): Map<string, string> {
  const map = new Map<string, string>()

  for (const pattern of META_GLOBS) {
    const files = globSync(pattern, { cwd: root, absolute: true })
    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf-8')
        // Match id: 'SomeId' or id: "SomeId"
        const match = content.match(/^\s*id:\s*['"]([^'"]+)['"]/m)
        if (match) {
          map.set(match[1], file)
        }
      } catch {
        // Skip unreadable files
      }
    }
  }

  return map
}

/**
 * Serialize a JS value to a TypeScript literal string.
 */
function serializeValue(value: unknown): string {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'boolean') return String(value)
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') {
    // Use single quotes, escape internal single quotes
    const escaped = value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    return `'${escaped}'`
  }
  if (Array.isArray(value) && value.length === 0) return '[]'
  // Fallback to JSON for complex values
  return JSON.stringify(value)
}

/**
 * Update a single default: value in a meta.ts file content string.
 *
 * Handles two patterns:
 * 1. Literal object:  `settingKey: { ..., default: 'value', ... }`
 *    → replaces the value after `default:`
 * 2. Helper function:  `settingKey: textScaleSetting('Label', 'default')`
 *    → replaces the second argument (the default value)
 */
function updateDefault(
  content: string,
  settingKey: string,
  newValue: unknown
): { content: string; status: 'updated' | 'skipped' } {
  const keyPattern = new RegExp(
    `(^|[\\s,])${escapeRegex(settingKey)}:\\s*`,
    'gm'
  )

  let keyMatch: RegExpExecArray | null = null
  while ((keyMatch = keyPattern.exec(content)) !== null) {
    // Verify we're inside a `settings:` block by checking backwards
    const before = content.slice(0, keyMatch.index)
    if (!before.includes('settings:')) continue

    const afterKey = content.slice(keyMatch.index + keyMatch[0].length)
    const globalOffset = keyMatch.index + keyMatch[0].length

    // --- Pattern 1: Literal object { ..., default: value, ... } ---
    if (afterKey.startsWith('{')) {
      let depth = 0
      let i = 0
      let defaultValueStart = -1
      let defaultValueEnd = -1

      for (; i < afterKey.length; i++) {
        const ch = afterKey[i]
        if (ch === '{') depth++
        if (ch === '}') {
          depth--
          if (depth === 0) break
        }

        if (depth === 1 && afterKey.slice(i).match(/^default\s*:/)) {
          const colonOffset = afterKey.indexOf(':', i + 7)
          defaultValueStart = colonOffset + 1
          while (defaultValueStart < afterKey.length && /\s/.test(afterKey[defaultValueStart])) {
            defaultValueStart++
          }
          defaultValueEnd = findValueEnd(afterKey, defaultValueStart)
          break
        }
      }

      if (defaultValueStart === -1 || defaultValueEnd === -1) {
        return { content, status: 'skipped' }
      }

      const replaceStart = globalOffset + defaultValueStart
      const replaceEnd = globalOffset + defaultValueEnd
      content = content.slice(0, replaceStart) + serializeValue(newValue) + content.slice(replaceEnd)
      return { content, status: 'updated' }
    }

    // --- Pattern 2: Helper function call  helperName('label', 'default', ...) ---
    // Find the opening paren
    const parenMatch = afterKey.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/)
    if (parenMatch) {
      const argsStart = parenMatch[0].length // position after '('
      // Skip whitespace
      let i = argsStart
      while (i < afterKey.length && /\s/.test(afterKey[i])) i++
      // Skip the first argument (a string literal)
      const firstArgEnd = findValueEnd(afterKey, i)
      if (firstArgEnd === i) return { content, status: 'skipped' }
      // Skip comma + whitespace to reach the second argument
      i = firstArgEnd
      while (i < afterKey.length && /[\s,]/.test(afterKey[i])) i++
      // Now i points to the start of the second argument (the default value)
      const secondArgEnd = findValueEnd(afterKey, i)
      if (secondArgEnd === i) return { content, status: 'skipped' }

      const replaceStart = globalOffset + i
      const replaceEnd = globalOffset + secondArgEnd
      content = content.slice(0, replaceStart) + serializeValue(newValue) + content.slice(replaceEnd)
      return { content, status: 'updated' }
    }

    // Unknown pattern — skip
    return { content, status: 'skipped' }
  }

  return { content, status: 'skipped' }
}

/**
 * Find the end of a value expression starting at `start` in the string.
 * Handles strings (single/double quoted), arrays, objects, and simple literals.
 */
function findValueEnd(str: string, start: number): number {
  let i = start
  const len = str.length

  if (i >= len) return i

  const ch = str[i]

  // String literal (single or double quote)
  if (ch === "'" || ch === '"') {
    i++
    while (i < len) {
      if (str[i] === '\\') { i += 2; continue }
      if (str[i] === ch) { i++; break }
      i++
    }
    return i
  }

  // Array or object — match balanced brackets
  if (ch === '[' || ch === '{') {
    const close = ch === '[' ? ']' : '}'
    let depth = 1
    i++
    while (i < len && depth > 0) {
      if (str[i] === '\\') { i += 2; continue }
      if (str[i] === "'" || str[i] === '"') {
        const q = str[i]
        i++
        while (i < len) {
          if (str[i] === '\\') { i += 2; continue }
          if (str[i] === q) { i++; break }
          i++
        }
        continue
      }
      if (str[i] === ch) depth++
      if (str[i] === close) depth--
      i++
    }
    return i
  }

  // Template literal
  if (ch === '`') {
    i++
    while (i < len) {
      if (str[i] === '\\') { i += 2; continue }
      if (str[i] === '`') { i++; break }
      i++
    }
    return i
  }

  // Simple literal (number, boolean, null, undefined, identifier)
  // Read until comma, newline, or closing brace/bracket
  while (i < len) {
    if (str[i] === ',' || str[i] === '\n' || str[i] === '}' || str[i] === ']' || str[i] === ')') break
    i++
  }
  // Trim trailing whitespace from value
  while (i > start && /\s/.test(str[i - 1])) i--
  return i
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function saveDefaultsPlugin(): Plugin {
  let root: string

  return {
    name: 'storybook-save-defaults',
    configureServer(server: ViteDevServer) {
      root = server.config.root

      server.middlewares.use('/__save-meta-defaults', (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const { id, changes } = JSON.parse(body) as {
              id: string
              changes: Record<string, unknown>
            }

            // Rebuild meta map on every save to pick up new/renamed files
            const metaMap = buildMetaMap(root)

            const filePath = metaMap.get(id)
            if (!filePath) {
              console.warn(`[save-defaults] Meta not found for id: "${id}". Known IDs: [${[...metaMap.keys()].join(', ')}]`)
              res.writeHead(404, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: `Meta not found for id: ${id}`, knownIds: [...metaMap.keys()] }))
              return
            }

            let content = readFileSync(filePath, 'utf-8')
            const updated: string[] = []
            const skipped: string[] = []

            for (const [key, value] of Object.entries(changes)) {
              const result = updateDefault(content, key, value)
              content = result.content
              if (result.status === 'updated') {
                updated.push(key)
              } else {
                skipped.push(key)
              }
            }

            if (updated.length > 0) {
              writeFileSync(filePath, content, 'utf-8')
              console.info(`[save-defaults] Updated ${filePath}: [${updated.join(', ')}]`)
            }

            if (skipped.length > 0) {
              console.warn(`[save-defaults] Skipped keys in ${id}: [${skipped.join(', ')}]`)
            }

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: true, updated, skipped, filePath }))
          } catch (err) {
            console.error('[save-defaults] Server error:', err)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: String(err) }))
          }
        })
      })
    },
  }
}
