/**
 * Settings Taxonomy Validation Tests
 *
 * Enforces the 4-tier settings taxonomy:
 * - No section/chrome has >12 visible (non-hidden, non-advanced) settings
 * - No content fields overlap between content.ts and meta.ts
 * - No visible textScaleSetting in section metas
 *
 * See: .claude/skills/engine/specs/reference/settings-taxonomy.spec.md
 */

import { describe, it, expect } from 'vitest'
import { getFiles, readFile, relativePath, fileExists } from './helpers'
import path from 'path'

const ENGINE = path.join(process.cwd(), 'engine')

/**
 * Count visible (non-hidden, non-advanced) settings in a meta.ts file.
 * A setting is visible if it doesn't have `hidden: true` or `advanced: true`.
 *
 * Also detects settings created via helper functions like textScaleSetting()
 * which produce settings without inline hidden/advanced flags — we count those
 * by looking for the helper call pattern.
 */
function countVisibleSettings(content: string): { total: number; visible: number; keys: string[] } {
  const settingsStart = content.indexOf('settings:')
  if (settingsStart === -1) return { total: 0, visible: 0, keys: [] }

  const braceStart = content.indexOf('{', settingsStart)
  if (braceStart === -1) return { total: 0, visible: 0, keys: [] }

  // Extract the full settings block
  let depth = 1
  let i = braceStart + 1
  while (i < content.length && depth > 0) {
    if (content[i] === '{') depth++
    if (content[i] === '}') depth--
    if (content[i] === "'" || content[i] === '"' || content[i] === '`') {
      const quote = content[i]
      i++
      while (i < content.length && content[i] !== quote) {
        if (content[i] === '\\') i++
        i++
      }
    }
    i++
  }
  const settingsBlock = content.slice(braceStart + 1, i - 1)

  let total = 0
  let visible = 0
  const visibleKeys: string[] = []

  // Walk top-level entries
  depth = 0
  let pos = 0
  while (pos < settingsBlock.length) {
    if (settingsBlock[pos] === '{') { depth++; pos++; continue }
    if (settingsBlock[pos] === '}') { depth--; pos++; continue }

    if (depth === 0) {
      const remaining = settingsBlock.slice(pos)
      // Match: key: { ... } or key: helperFunction(...)
      const keyMatch = remaining.match(/^(?:['"]([^'"]+)['"]|(\w+))\s*:\s*(?:\{|[a-zA-Z])/)

      if (keyMatch) {
        const key = keyMatch[1] || keyMatch[2]
        total++

        // Find the full entry (until next top-level key or end)
        // For helper calls like textScaleSetting(...), find the closing paren + comma
        const isHelperCall = remaining.match(/^(?:['"]([^'"]+)['"]|(\w+))\s*:\s*[a-zA-Z]+Setting\(/)
        let entryEnd: number

        if (isHelperCall) {
          // Helper function call — find matching paren
          const parenStart = remaining.indexOf('(', keyMatch[0].length - 1)
          let parenDepth = 1
          let p = parenStart + 1
          while (p < remaining.length && parenDepth > 0) {
            if (remaining[p] === '(') parenDepth++
            if (remaining[p] === ')') parenDepth--
            if (remaining[p] === "'" || remaining[p] === '"') {
              const q = remaining[p]
              p++
              while (p < remaining.length && remaining[p] !== q) {
                if (remaining[p] === '\\') p++
                p++
              }
            }
            p++
          }
          entryEnd = pos + p
          const entryBody = remaining.slice(0, p)

          // Check if helper call includes { advanced: true } or { hidden: true } in options
          const isHidden = /hidden:\s*true/.test(entryBody)
          const isAdvanced = /advanced:\s*true/.test(entryBody)

          if (!isHidden && !isAdvanced) {
            visible++
            visibleKeys.push(key)
          }
        } else if (remaining[keyMatch[0].length - 1] === '{') {
          // Object literal entry — find matching brace
          let braceDepth = 1
          let j = keyMatch[0].length
          while (j < remaining.length && braceDepth > 0) {
            if (remaining[j] === '{') braceDepth++
            if (remaining[j] === '}') braceDepth--
            if (remaining[j] === "'" || remaining[j] === '"' || remaining[j] === '`') {
              const q = remaining[j]
              j++
              while (j < remaining.length && remaining[j] !== q) {
                if (remaining[j] === '\\') j++
                j++
              }
            }
            j++
          }
          entryEnd = pos + j
          const entryBody = remaining.slice(keyMatch[0].length - 1, j)

          const isHidden = /hidden:\s*true/.test(entryBody)
          const isAdvanced = /advanced:\s*true/.test(entryBody)

          if (!isHidden && !isAdvanced) {
            visible++
            visibleKeys.push(key)
          }
        } else {
          entryEnd = pos + keyMatch[0].length
        }

        pos = entryEnd
        continue
      }
    }

    pos++
  }

  return { total, visible, keys: visibleKeys }
}

/**
 * Extract content field paths from a content.ts file.
 */
function extractContentFieldPaths(content: string): string[] {
  const paths: string[] = []
  const matches = content.matchAll(/path:\s*['"]([^'"]+)['"]/g)
  for (const match of matches) {
    // Get the root path (before any dot)
    const rootPath = match[1].split('.')[0]
    paths.push(rootPath)
  }
  return [...new Set(paths)]
}

/**
 * Extract setting keys from a meta.ts file.
 */
function extractSettingKeys(content: string): string[] {
  const settingsStart = content.indexOf('settings:')
  if (settingsStart === -1) return []

  const braceStart = content.indexOf('{', settingsStart)
  if (braceStart === -1) return []

  const keys: string[] = []
  let depth = 1
  let i = braceStart + 1
  while (i < content.length && depth > 0) {
    if (content[i] === '{') depth++
    if (content[i] === '}') depth--
    if (content[i] === "'" || content[i] === '"' || content[i] === '`') {
      const quote = content[i]
      i++
      while (i < content.length && content[i] !== quote) {
        if (content[i] === '\\') i++
        i++
      }
    }
    i++
  }
  const settingsBlock = content.slice(braceStart + 1, i - 1)

  depth = 0
  let pos = 0
  while (pos < settingsBlock.length) {
    if (settingsBlock[pos] === '{') { depth++; pos++; continue }
    if (settingsBlock[pos] === '}') { depth--; pos++; continue }

    if (depth === 0) {
      const remaining = settingsBlock.slice(pos)
      const keyMatch = remaining.match(/^(?:['"]([^'"]+)['"]|(\w+))\s*:\s*(?:\{|[a-zA-Z])/)
      if (keyMatch) {
        keys.push(keyMatch[1] || keyMatch[2])
        // Skip past the key (advance at least past the match)
        pos += keyMatch[0].length
        continue
      }
    }
    pos++
  }

  return keys
}

describe('Settings Taxonomy', () => {
  describe('Visible settings limits', () => {
    it('no section pattern has >12 visible settings', async () => {
      const metaFiles = await getFiles('content/sections/patterns/*/meta.ts')
      const definitionFiles = await getFiles('content/sections/patterns/*/definition.ts')
      const allFiles = [...metaFiles, ...definitionFiles]
      const violations: string[] = []

      for (const file of allFiles) {
        const content = await readFile(file)
        const { visible, keys } = countVisibleSettings(content)

        if (visible > 12) {
          violations.push(
            `${relativePath(file)}: ${visible} visible settings (max 12). Keys: ${keys.join(', ')}`
          )
        }
      }

      expect(violations, `Sections with too many visible settings:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('no chrome pattern has >12 visible settings', async () => {
      const metaFiles = await getFiles('content/chrome/patterns/*/meta.ts')
      const violations: string[] = []

      for (const file of metaFiles) {
        const content = await readFile(file)
        const { visible, keys } = countVisibleSettings(content)

        if (visible > 12) {
          violations.push(
            `${relativePath(file)}: ${visible} visible settings (max 12). Keys: ${keys.join(', ')}`
          )
        }
      }

      expect(violations, `Chrome patterns with too many visible settings:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Content/settings boundary', () => {
    it('no section meta.ts overlaps with content.ts field paths', async () => {
      const sectionDirs = await getFiles('content/sections/patterns/*/')
      const violations: string[] = []

      for (const dir of sectionDirs) {
        const contentPath = path.join(dir, 'content.ts')
        const metaPath = path.join(dir, 'meta.ts')

        // Skip consolidated sections (definition.ts) — content and meta share the same file by design
        if (!(await fileExists(contentPath)) || !(await fileExists(metaPath))) continue

        const contentFile = await readFile(contentPath)
        const metaFile = await readFile(metaPath)

        const contentPaths = extractContentFieldPaths(contentFile)
        const settingKeys = extractSettingKeys(metaFile)

        const overlaps = contentPaths.filter(p => settingKeys.includes(p))
        if (overlaps.length > 0) {
          violations.push(
            `${relativePath(dir)}: overlapping fields in both content.ts and meta.ts: ${overlaps.join(', ')}`
          )
        }
      }

      expect(violations, `Content/meta field overlaps:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('no chrome meta.ts overlaps with content.ts field paths', async () => {
      const chromeDirs = await getFiles('content/chrome/patterns/*/')
      const violations: string[] = []

      for (const dir of chromeDirs) {
        const contentPath = path.join(dir, 'content.ts')
        const metaPath = path.join(dir, 'meta.ts')

        if (!(await fileExists(contentPath)) || !(await fileExists(metaPath))) continue

        const contentFile = await readFile(contentPath)
        const metaFile = await readFile(metaPath)

        const contentPaths = extractContentFieldPaths(contentFile)
        const settingKeys = extractSettingKeys(metaFile)

        const overlaps = contentPaths.filter(p => settingKeys.includes(p))
        if (overlaps.length > 0) {
          violations.push(
            `${relativePath(dir)}: overlapping fields in both content.ts and meta.ts: ${overlaps.join(', ')}`
          )
        }
      }

      expect(violations, `Content/meta field overlaps:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Typography discipline', () => {
    it('no section has visible textScaleSetting', async () => {
      const metaFiles = await getFiles('content/sections/patterns/*/meta.ts')
      const definitionFiles = await getFiles('content/sections/patterns/*/definition.ts')
      const allFiles = [...metaFiles, ...definitionFiles]
      const violations: string[] = []

      for (const file of allFiles) {
        const content = await readFile(file)

        // Find textScaleSetting calls that are NOT marked advanced or hidden
        const scaleMatches = content.matchAll(/(\w+):\s*textScaleSetting\(([^)]*)\)/g)
        for (const match of scaleMatches) {
          const key = match[1]
          const args = match[2]

          // Check if the helper args include advanced: true or if there's an inline override
          const isAdvanced = /advanced:\s*true/.test(args)
          const isHidden = /hidden:\s*true/.test(args)

          if (!isAdvanced && !isHidden) {
            violations.push(
              `${relativePath(file)}: visible textScaleSetting "${key}" — should be hidden: true or advanced: true`
            )
          }
        }
      }

      expect(violations, `Visible textScaleSettings (should be hidden/advanced):\n${violations.join('\n')}`).toHaveLength(0)
    })
  })
})
