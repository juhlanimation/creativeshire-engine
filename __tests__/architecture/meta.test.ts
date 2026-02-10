/**
 * ComponentMeta Validation Tests
 *
 * Validates that every component has a meta.ts file with proper structure:
 * - Every widget (primitive, layout, pattern, interactive) has meta.ts
 * - Every section pattern has meta.ts
 * - Every chrome component has meta.ts
 * - Patterns have component: false
 * - Interactive/primitives/layouts have component: true
 * - The old composite/ folder no longer exists
 */

import { describe, it, expect } from 'vitest'
import { getFiles, readFile, relativePath, fileExists } from './helpers'
import path from 'path'

const ENGINE = path.join(process.cwd(), 'engine')

/**
 * Extract top-level setting entries from a settings block and validate
 * that each has type, label, and default fields.
 *
 * Returns violations as strings in the format: "context → settings.key: missing field"
 */
function validateSettings(content: string, context: string): string[] {
  const violations: string[] = []

  // Find the settings: { ... } block by matching braces from 'settings:'
  const settingsStart = content.indexOf('settings:')
  if (settingsStart === -1) return violations

  // Find the opening brace of settings
  const braceStart = content.indexOf('{', settingsStart)
  if (braceStart === -1) return violations

  // Extract the full settings block by tracking brace depth
  let depth = 1
  let i = braceStart + 1
  while (i < content.length && depth > 0) {
    if (content[i] === '{') depth++
    if (content[i] === '}') depth--
    // Skip string literals to avoid false brace matches
    if (content[i] === "'" || content[i] === '"' || content[i] === '`') {
      const quote = content[i]
      i++
      while (i < content.length && content[i] !== quote) {
        if (content[i] === '\\') i++ // skip escaped chars
        i++
      }
    }
    i++
  }
  const settingsBlock = content.slice(braceStart + 1, i - 1)

  // Now walk through settingsBlock at depth 0 to find top-level keys
  // A top-level key is: identifier (or quoted string) followed by : { at depth 0
  depth = 0
  let pos = 0
  while (pos < settingsBlock.length) {
    // Skip nested blocks
    if (settingsBlock[pos] === '{') { depth++; pos++; continue }
    if (settingsBlock[pos] === '}') { depth--; pos++; continue }

    // Skip string literals
    if (settingsBlock[pos] === "'" || settingsBlock[pos] === '"' || settingsBlock[pos] === '`') {
      // Only skip strings at depth > 0 (inside nested objects)
      if (depth > 0) {
        const quote = settingsBlock[pos]
        pos++
        while (pos < settingsBlock.length && settingsBlock[pos] !== quote) {
          if (settingsBlock[pos] === '\\') pos++
          pos++
        }
        pos++
        continue
      }
    }

    // At depth 0, look for key: { pattern
    if (depth === 0) {
      // Match: optional quotes, key name, optional quotes, colon, optional whitespace, opening brace
      // Handles: key: {  |  'dotted.key': {
      const remaining = settingsBlock.slice(pos)
      const keyMatch = remaining.match(/^(?:['"]([^'"]+)['"]|(\w+))\s*:\s*\{/)

      if (keyMatch) {
        const key = keyMatch[1] || keyMatch[2]

        // Find this setting entry's body (from the { to the matching })
        const entryBraceStart = pos + keyMatch[0].length - 1
        let entryDepth = 1
        let j = entryBraceStart + 1
        while (j < settingsBlock.length && entryDepth > 0) {
          if (settingsBlock[j] === '{') entryDepth++
          if (settingsBlock[j] === '}') entryDepth--
          if (settingsBlock[j] === "'" || settingsBlock[j] === '"' || settingsBlock[j] === '`') {
            const q = settingsBlock[j]
            j++
            while (j < settingsBlock.length && settingsBlock[j] !== q) {
              if (settingsBlock[j] === '\\') j++
              j++
            }
          }
          j++
        }

        const entryBody = settingsBlock.slice(entryBraceStart, j)

        if (!entryBody.includes('type:')) {
          violations.push(`${context} → settings.${key}: missing type`)
        }
        if (!entryBody.includes('label:')) {
          violations.push(`${context} → settings.${key}: missing label`)
        }
        if (!/default\s*:/.test(entryBody)) {
          violations.push(`${context} → settings.${key}: missing default`)
        }

        // Skip past this entry
        pos = entryBraceStart + (j - entryBraceStart)
        continue
      }
    }

    pos++
  }

  return violations
}

/**
 * Validate that settings with specific types have appropriate validation constraints.
 *
 * Rules:
 * - text/textarea: must have validation.maxLength
 * - number: must have min and max
 * - spacing: must have validation.min and validation.max
 * - toggle/select/range/image/video/icon/color/alignment/custom: no constraints needed
 */
function validateSettingConstraints(content: string, context: string): string[] {
  const violations: string[] = []

  // Find the settings: { ... } block by matching braces from 'settings:'
  const settingsStart = content.indexOf('settings:')
  if (settingsStart === -1) return violations

  // Find the opening brace of settings
  const braceStart = content.indexOf('{', settingsStart)
  if (braceStart === -1) return violations

  // Extract the full settings block by tracking brace depth
  let depth = 1
  let i = braceStart + 1
  while (i < content.length && depth > 0) {
    if (content[i] === '{') depth++
    if (content[i] === '}') depth--
    // Skip string literals to avoid false brace matches
    if (content[i] === "'" || content[i] === '"' || content[i] === '`') {
      const quote = content[i]
      i++
      while (i < content.length && content[i] !== quote) {
        if (content[i] === '\\') i++ // skip escaped chars
        i++
      }
    }
    i++
  }
  const settingsBlock = content.slice(braceStart + 1, i - 1)

  // Types that don't need constraints
  const SKIP_TYPES = [
    'toggle', 'select', 'range', 'image', 'video', 'icon', 'color', 'alignment', 'custom',
  ]

  // Now walk through settingsBlock at depth 0 to find top-level keys
  depth = 0
  let pos = 0
  while (pos < settingsBlock.length) {
    // Skip nested blocks
    if (settingsBlock[pos] === '{') { depth++; pos++; continue }
    if (settingsBlock[pos] === '}') { depth--; pos++; continue }

    // Skip string literals
    if (settingsBlock[pos] === "'" || settingsBlock[pos] === '"' || settingsBlock[pos] === '`') {
      if (depth > 0) {
        const quote = settingsBlock[pos]
        pos++
        while (pos < settingsBlock.length && settingsBlock[pos] !== quote) {
          if (settingsBlock[pos] === '\\') pos++
          pos++
        }
        pos++
        continue
      }
    }

    // At depth 0, look for key: { pattern
    if (depth === 0) {
      const remaining = settingsBlock.slice(pos)
      const keyMatch = remaining.match(/^(?:['"]([^'"]+)['"]|(\w+))\s*:\s*\{/)

      if (keyMatch) {
        const key = keyMatch[1] || keyMatch[2]

        // Find this setting entry's body (from the { to the matching })
        const entryBraceStart = pos + keyMatch[0].length - 1
        let entryDepth = 1
        let j = entryBraceStart + 1
        while (j < settingsBlock.length && entryDepth > 0) {
          if (settingsBlock[j] === '{') entryDepth++
          if (settingsBlock[j] === '}') entryDepth--
          if (settingsBlock[j] === "'" || settingsBlock[j] === '"' || settingsBlock[j] === '`') {
            const q = settingsBlock[j]
            j++
            while (j < settingsBlock.length && settingsBlock[j] !== q) {
              if (settingsBlock[j] === '\\') j++
              j++
            }
          }
          j++
        }

        const entryBody = settingsBlock.slice(entryBraceStart, j)

        // Extract the type
        const typeMatch = entryBody.match(/type:\s*['"](\w+)['"]/)
        if (typeMatch) {
          const type = typeMatch[1]

          // All known types that need constraint checks
          const CONSTRAINED_TYPES = ['text', 'textarea', 'number', 'spacing']
          const ALL_KNOWN_TYPES = [...SKIP_TYPES, ...CONSTRAINED_TYPES]

          if (!ALL_KNOWN_TYPES.includes(type)) {
            // Unknown type — force developer to add it to SKIP_TYPES or CONSTRAINED_TYPES
            violations.push(`${context} → settings.${key}: unknown type '${type}' — add to SKIP_TYPES or handle explicitly`)
          } else if (SKIP_TYPES.includes(type)) {
            // No constraints needed
          } else if (type === 'text' || type === 'textarea') {
            // Must have validation: { ... maxLength: ... }
            const validationIdx = entryBody.indexOf('validation:')
            if (validationIdx === -1) {
              violations.push(`${context} → settings.${key}: type '${type}' requires validation.maxLength`)
            } else {
              const valBraceStart = entryBody.indexOf('{', validationIdx)
              if (valBraceStart !== -1) {
                const valBraceEnd = entryBody.indexOf('}', valBraceStart)
                const validationBlock = entryBody.slice(valBraceStart, valBraceEnd + 1)
                if (!validationBlock.includes('maxLength:')) {
                  violations.push(`${context} → settings.${key}: type '${type}' requires validation.maxLength`)
                }
              } else {
                violations.push(`${context} → settings.${key}: type '${type}' requires validation.maxLength`)
              }
            }
          } else if (type === 'number') {
            // Must have min: and max: anywhere in the entry body
            if (!entryBody.includes('min:') || !entryBody.includes('max:')) {
              violations.push(`${context} → settings.${key}: type 'number' requires min and max`)
            }
          } else if (type === 'spacing') {
            // Must have validation: { ... min: ... max: ... }
            const validationIdx = entryBody.indexOf('validation:')
            if (validationIdx === -1) {
              violations.push(`${context} → settings.${key}: type 'spacing' requires validation.min and validation.max`)
            } else {
              const valBraceStart = entryBody.indexOf('{', validationIdx)
              if (valBraceStart !== -1) {
                const valBraceEnd = entryBody.indexOf('}', valBraceStart)
                const validationBlock = entryBody.slice(valBraceStart, valBraceEnd + 1)
                if (!validationBlock.includes('min:') || !validationBlock.includes('max:')) {
                  violations.push(`${context} → settings.${key}: type 'spacing' requires validation.min and validation.max`)
                }
              } else {
                violations.push(`${context} → settings.${key}: type 'spacing' requires validation.min and validation.max`)
              }
            }
          }

          // ── Semantic checks ─────────────────────────────────────────────
          // Helper: extract validation block content from entry body
          const getValidationBlock = (body: string): string | null => {
            const vIdx = body.indexOf('validation:')
            if (vIdx === -1) return null
            const vBrace = body.indexOf('{', vIdx)
            if (vBrace === -1) return null
            const vEnd = body.indexOf('}', vBrace)
            return body.slice(vBrace, vEnd + 1)
          }

          // Email fields: key contains 'email' (case-insensitive) → pattern + maxLength: 320
          if (/email/i.test(key) && type === 'text') {
            const vBlock = getValidationBlock(entryBody)
            if (!vBlock) {
              violations.push(`${context} → settings.${key}: email field requires validation with pattern and maxLength: 320`)
            } else {
              if (!vBlock.includes('pattern:')) {
                violations.push(`${context} → settings.${key}: email field requires validation.pattern`)
              }
              if (!vBlock.includes('maxLength: 320')) {
                violations.push(`${context} → settings.${key}: email field requires validation.maxLength: 320`)
              }
            }
          }

          // URL fields: key matches url/href/linkedin/instagram/canonical → pattern + maxLength: 2048
          // Also matches 'logo' key in Header region (which is a URL, not an image picker)
          if (/url|href|linkedin|instagram|canonical/i.test(key) && type === 'text') {
            const vBlock = getValidationBlock(entryBody)
            if (!vBlock) {
              violations.push(`${context} → settings.${key}: URL field requires validation with pattern and maxLength: 2048`)
            } else {
              if (!vBlock.includes('pattern:')) {
                violations.push(`${context} → settings.${key}: URL field requires validation.pattern`)
              }
              if (!vBlock.includes('maxLength: 2048')) {
                violations.push(`${context} → settings.${key}: URL field requires validation.maxLength: 2048`)
              }
            }
          }

          // Slug fields: key is 'slug' → must have pattern
          if (/^slug$/i.test(key) && type === 'text') {
            const vBlock = getValidationBlock(entryBody)
            if (!vBlock || !vBlock.includes('pattern:')) {
              violations.push(`${context} → settings.${key}: slug field requires validation.pattern`)
            }
          }

          // Twitter handle fields: key contains 'twitter' (case-insensitive) → must have pattern
          if (/twitter/i.test(key) && type === 'text') {
            const vBlock = getValidationBlock(entryBody)
            if (!vBlock || !vBlock.includes('pattern:')) {
              violations.push(`${context} → settings.${key}: twitter handle field requires validation.pattern`)
            }
          }
        }

        // Skip past this entry
        pos = entryBraceStart + (j - entryBraceStart)
        continue
      }
    }

    pos++
  }

  return violations
}

describe('ComponentMeta Validation', () => {
  describe('Widget meta.ts files', () => {
    it('every primitive widget has meta.ts', async () => {
      const componentDirs = await getFiles('content/widgets/primitives/*/')
      const missing: string[] = []

      for (const dir of componentDirs) {
        const metaPath = path.join(dir, 'meta.ts')
        if (!(await fileExists(metaPath))) {
          missing.push(relativePath(dir))
        }
      }

      expect(missing, `Primitives missing meta.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('every layout widget has meta.ts', async () => {
      const componentDirs = await getFiles('content/widgets/layout/*/')
      const missing: string[] = []

      for (const dir of componentDirs) {
        const metaPath = path.join(dir, 'meta.ts')
        if (!(await fileExists(metaPath))) {
          missing.push(relativePath(dir))
        }
      }

      expect(missing, `Layouts missing meta.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('every pattern widget has meta.ts', async () => {
      const componentDirs = await getFiles('content/widgets/patterns/*/')
      const missing: string[] = []

      for (const dir of componentDirs) {
        const metaPath = path.join(dir, 'meta.ts')
        if (!(await fileExists(metaPath))) {
          missing.push(relativePath(dir))
        }
      }

      expect(missing, `Patterns missing meta.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('every interactive widget has meta.ts', async () => {
      const componentDirs = await getFiles('content/widgets/interactive/*/')
      const missing: string[] = []

      for (const dir of componentDirs) {
        const metaPath = path.join(dir, 'meta.ts')
        if (!(await fileExists(metaPath))) {
          missing.push(relativePath(dir))
        }
      }

      expect(missing, `Interactive widgets missing meta.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Pattern meta.ts validation', () => {
    it('pattern widgets have component: false', async () => {
      const metaFiles = await getFiles('content/widgets/patterns/*/meta.ts')
      const violations: string[] = []

      for (const file of metaFiles) {
        const content = await readFile(file)

        // Should have component: false since patterns are factory functions
        if (!content.includes('component: false')) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `Patterns missing component: false:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Interactive meta.ts validation', () => {
    it('interactive widgets have component: true', async () => {
      const metaFiles = await getFiles('content/widgets/interactive/*/meta.ts')
      const violations: string[] = []

      for (const file of metaFiles) {
        const content = await readFile(file)

        // Should have component: true since interactive are React components
        if (!content.includes('component: true')) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `Interactive widgets missing component: true:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Section meta.ts files', () => {
    it('every section pattern has meta.ts', async () => {
      const componentDirs = await getFiles('content/sections/patterns/*/')
      const missing: string[] = []

      for (const dir of componentDirs) {
        const metaPath = path.join(dir, 'meta.ts')
        if (!(await fileExists(metaPath))) {
          missing.push(relativePath(dir))
        }
      }

      expect(missing, `Section patterns missing meta.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('section patterns use defineSectionMeta', async () => {
      const metaFiles = await getFiles('content/sections/patterns/*/meta.ts')
      const violations: string[] = []

      for (const file of metaFiles) {
        const content = await readFile(file)
        if (!content.includes('defineSectionMeta')) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `Sections not using defineSectionMeta:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('section patterns have sectionCategory field', async () => {
      const metaFiles = await getFiles('content/sections/patterns/*/meta.ts')
      const violations: string[] = []

      for (const file of metaFiles) {
        const content = await readFile(file)
        if (!content.includes('sectionCategory:')) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `Sections missing sectionCategory:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('section patterns have unique field', async () => {
      const metaFiles = await getFiles('content/sections/patterns/*/meta.ts')
      const violations: string[] = []

      for (const file of metaFiles) {
        const content = await readFile(file)
        if (!content.includes('unique:')) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `Sections missing unique constraint:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('sectionCategory is a valid value', async () => {
      const VALID_SECTION_CATEGORIES = [
        'hero', 'about', 'project', 'contact', 'content', 'gallery'
      ]

      const metaFiles = await getFiles('content/sections/patterns/*/meta.ts')
      const violations: string[] = []

      for (const file of metaFiles) {
        const content = await readFile(file)
        const match = content.match(/sectionCategory:\s*['"](\w+)['"]/)

        if (match) {
          const category = match[1]
          if (!VALID_SECTION_CATEGORIES.includes(category)) {
            violations.push(`${relativePath(file)}: Invalid sectionCategory "${category}"`)
          }
        }
      }

      expect(violations).toHaveLength(0)
    })
  })

  describe('Chrome meta.ts files', () => {
    it('every chrome region has meta.ts', async () => {
      const componentDirs = await getFiles('content/chrome/regions/*/')
      const missing: string[] = []

      for (const dir of componentDirs) {
        const metaPath = path.join(dir, 'meta.ts')
        if (!(await fileExists(metaPath))) {
          missing.push(relativePath(dir))
        }
      }

      expect(missing, `Chrome regions missing meta.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('every chrome overlay has meta.ts', async () => {
      const componentDirs = await getFiles('content/chrome/overlays/*/')
      const missing: string[] = []

      for (const dir of componentDirs) {
        const metaPath = path.join(dir, 'meta.ts')
        if (!(await fileExists(metaPath))) {
          missing.push(relativePath(dir))
        }
      }

      expect(missing, `Chrome overlays missing meta.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('chrome meta.ts files use defineMeta', async () => {
      const regionMetas = await getFiles('content/chrome/regions/*/meta.ts')
      const overlayMetas = await getFiles('content/chrome/overlays/*/meta.ts')
      const allMetas = [...regionMetas, ...overlayMetas]
      const violations: string[] = []

      for (const file of allMetas) {
        const content = await readFile(file)
        if (!content.includes('defineMeta')) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `Chrome meta.ts not using defineMeta:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Widget structure', () => {
    it('composite/ folder no longer exists', async () => {
      const compositeFiles = await getFiles('content/widgets/composite/**/*')

      expect(
        compositeFiles.length,
        'composite/ folder should be renamed to patterns/ and interactive/'
      ).toBe(0)
    })

    it('patterns/ folder contains factory functions only', async () => {
      const patternDirs = await getFiles('content/widgets/patterns/*/')
      const violations: string[] = []

      for (const dir of patternDirs) {
        // Check for index.ts (factory) vs index.tsx (React component)
        const hasFactoryIndex = await fileExists(path.join(dir, 'index.ts'))
        const hasReactIndex = await fileExists(path.join(dir, 'index.tsx'))

        // Patterns should have index.ts, not index.tsx
        if (hasReactIndex && !hasFactoryIndex) {
          violations.push(`${relativePath(dir)}: has index.tsx instead of index.ts`)
        }
      }

      expect(violations, `Patterns with React components (should be in interactive/):\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('interactive/ folder contains React components only', async () => {
      const interactiveDirs = await getFiles('content/widgets/interactive/*/')
      const violations: string[] = []

      for (const dir of interactiveDirs) {
        // Check for index.tsx (React component)
        const hasReactIndex = await fileExists(path.join(dir, 'index.tsx'))

        if (!hasReactIndex) {
          violations.push(`${relativePath(dir)}: missing index.tsx`)
        }
      }

      expect(violations, `Interactive widgets missing index.tsx:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Meta structure validation', () => {
    it('all meta.ts files export a const', async () => {
      const metaFiles = await getFiles('{content,schema,experience}/**/meta.ts')
      // Exclude utility files that define helper functions, not meta objects
      const UTILITY_META_FILES = ['schema/meta.ts']
      const violations: string[] = []

      for (const file of metaFiles) {
        const rel = relativePath(file)
        if (UTILITY_META_FILES.includes(rel)) continue

        const content = await readFile(file)

        // Structural metas export as e.g. `export const themeMeta`, component metas as `export const meta`
        if (!content.includes('export const ')) {
          violations.push(rel)
        }
      }

      expect(violations, `Meta files missing 'export const':\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('all meta.ts files have required fields', async () => {
      const metaFiles = await getFiles('{content,schema,experience}/**/meta.ts')
      const UTILITY_META_FILES = ['schema/meta.ts']
      const violations: string[] = []

      const requiredFields = ['id:', 'name:', 'description:', 'category:']

      for (const file of metaFiles) {
        const rel = relativePath(file)
        if (UTILITY_META_FILES.includes(rel)) continue

        const content = await readFile(file)

        for (const field of requiredFields) {
          if (!content.includes(field)) {
            violations.push(`${rel}: missing ${field}`)
          }
        }
      }

      expect(violations, `Meta files missing required fields:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('meta.category is a valid value', async () => {
      const VALID_CATEGORIES = [
        'primitive',
        'layout',
        'interactive',
        'pattern',
        'section',
        'region',
        'overlay',
        'chrome', // Some may use 'chrome' instead of region/overlay
        'theme',
        'page',
        // Behaviour categories (trigger-based)
        'scroll', 'hover', 'visibility', 'animation', 'interaction', 'video', 'intro',
        // Experience categories (presentation models)
        'scroll-driven', 'physics', 'simple', 'presentation',
        // Transition categories (mechanisms)
        'fade',
      ]

      const metaFiles = await getFiles('{content,schema,experience}/**/meta.ts')
      const violations: string[] = []

      for (const file of metaFiles) {
        const content = await readFile(file)

        // Extract category value: category: 'xxx' or category: "xxx"
        const categoryMatch = content.match(/category:\s*['"]([a-z][a-z0-9-]*)['"]/)

        if (categoryMatch) {
          const category = categoryMatch[1]
          if (!VALID_CATEGORIES.includes(category)) {
            violations.push(
              `${relativePath(file)}: Invalid category "${category}" (expected: ${VALID_CATEGORIES.join(', ')})`
            )
          }
        }
        // Note: If no category found, the existing 'meta.ts has required fields' test should catch it
      }

      if (violations.length > 0) {
        console.log('Invalid meta.category values:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })
  })

  describe('Structural schema metas', () => {
    const STRUCTURAL_METAS: Record<string, { file: string; barrel: string; exportName: string }> = {
      themeMeta: {
        file: 'schema/theme-meta.ts',
        barrel: 'schema/index.ts',
        exportName: 'themeMeta',
      },
      pageMeta: {
        file: 'schema/page-meta.ts',
        barrel: 'schema/index.ts',
        exportName: 'pageMeta',
      },
      sectionBaseMeta: {
        file: 'content/sections/base-meta.ts',
        barrel: 'content/sections/index.ts',
        exportName: 'sectionBaseMeta',
      },
      regionBaseMeta: {
        file: 'content/chrome/region-base-meta.ts',
        barrel: 'content/chrome/index.ts',
        exportName: 'regionBaseMeta',
      },
      overlayBaseMeta: {
        file: 'content/chrome/overlay-base-meta.ts',
        barrel: 'content/chrome/index.ts',
        exportName: 'overlayBaseMeta',
      },
      siteMetadataMeta: {
        file: 'schema/site-meta.ts',
        barrel: 'schema/index.ts',
        exportName: 'siteMetadataMeta',
      },
    }

    it('all structural meta files exist', async () => {
      const missing: string[] = []

      for (const [name, { file }] of Object.entries(STRUCTURAL_METAS)) {
        const fullPath = path.join(ENGINE, file)
        if (!(await fileExists(fullPath))) {
          missing.push(`${name}: ${file}`)
        }
      }

      expect(missing, `Missing structural meta files:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('all structural metas are exported from their barrel', async () => {
      const violations: string[] = []

      for (const [name, { barrel, exportName }] of Object.entries(STRUCTURAL_METAS)) {
        const barrelPath = path.join(ENGINE, barrel)
        const content = await readFile(barrelPath)

        if (!content.includes(exportName)) {
          violations.push(`${name} (${exportName}) not exported from ${barrel}`)
        }
      }

      expect(violations, `Structural metas missing barrel exports:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('all structural metas use defineMeta()', async () => {
      const violations: string[] = []

      for (const [name, { file }] of Object.entries(STRUCTURAL_METAS)) {
        const fullPath = path.join(ENGINE, file)
        const content = await readFile(fullPath)

        if (!content.includes('defineMeta')) {
          violations.push(`${name}: ${file} does not use defineMeta()`)
        }
      }

      expect(violations, `Structural metas not using defineMeta():\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('all structural metas have required fields (id, name, description, category)', async () => {
      const requiredFields = ['id:', 'name:', 'description:', 'category:']
      const violations: string[] = []

      for (const [name, { file }] of Object.entries(STRUCTURAL_METAS)) {
        const fullPath = path.join(ENGINE, file)
        const content = await readFile(fullPath)

        for (const field of requiredFields) {
          if (!content.includes(field)) {
            violations.push(`${name}: missing ${field}`)
          }
        }
      }

      expect(violations, `Structural metas missing required fields:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('all structural meta settings have type, label, and default', async () => {
      const violations: string[] = []

      for (const [name, { file }] of Object.entries(STRUCTURAL_METAS)) {
        const fullPath = path.join(ENGINE, file)
        const content = await readFile(fullPath)
        violations.push(...validateSettings(content, name))
      }

      expect(violations, `Structural meta settings missing type/label/default:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Settings structure validation', () => {
    it('all meta.ts settings entries have type, label, and default', async () => {
      // Glob all meta.ts files across the engine
      const contentMetas = await getFiles('{content,schema}/**/meta.ts')
      const schemaMetas = await getFiles('schema/*-meta.ts')
      const transitionMetas = await getFiles('experience/transitions/*/meta.ts')
      const behaviourMetas = await getFiles('experience/behaviours/*/*/meta.ts')
      const experienceMetas = await getFiles('experience/experiences/*/meta.ts')
      const introMetas = await getFiles('intro/patterns/*/meta.ts')
      const allMetas = [...contentMetas, ...schemaMetas, ...transitionMetas, ...behaviourMetas, ...experienceMetas, ...introMetas]

      const violations: string[] = []

      for (const file of allMetas) {
        const content = await readFile(file)
        const rel = relativePath(file)

        // Skip meta.ts files that are utility/type definitions (no settings block)
        if (!content.includes('settings:')) continue

        violations.push(...validateSettings(content, rel))
      }

      expect(violations, `Meta settings missing type/label/default:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Behaviour meta.ts validation', () => {
    it('behaviour meta.ts files use defineBehaviourMeta()', async () => {
      const metaFiles = await getFiles('experience/behaviours/*/*/meta.ts')
      const violations: string[] = []

      for (const file of metaFiles) {
        const content = await readFile(file)
        if (!content.includes('defineBehaviourMeta')) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `Behaviour metas not using defineBehaviourMeta():\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('experience meta.ts files use defineExperienceMeta()', async () => {
      const metaFiles = await getFiles('experience/experiences/*/meta.ts')
      const violations: string[] = []

      for (const file of metaFiles) {
        const content = await readFile(file)
        if (!content.includes('defineExperienceMeta')) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `Experience metas not using defineExperienceMeta():\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('transition meta.ts files use definePageTransitionMeta()', async () => {
      const metaFiles = await getFiles('experience/transitions/*/meta.ts')
      const violations: string[] = []

      for (const file of metaFiles) {
        const content = await readFile(file)
        if (!content.includes('definePageTransitionMeta')) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `Transition metas not using definePageTransitionMeta():\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Settings validation constraints', () => {
    it('all settings have appropriate validation constraints', async () => {
      const contentMetas = await getFiles('{content,schema}/**/meta.ts')
      const schemaMetas = await getFiles('schema/*-meta.ts')
      const transitionMetas = await getFiles('experience/transitions/*/meta.ts')
      const behaviourMetas = await getFiles('experience/behaviours/*/*/meta.ts')
      const experienceMetas = await getFiles('experience/experiences/*/meta.ts')
      const introMetas = await getFiles('intro/patterns/*/meta.ts')
      const allMetas = [...contentMetas, ...schemaMetas, ...transitionMetas, ...behaviourMetas, ...experienceMetas, ...introMetas]

      // Skip utility meta files
      const UTILITY_META_FILES = ['schema/meta.ts']
      const violations: string[] = []

      for (const file of allMetas) {
        const content = await readFile(file)
        const rel = relativePath(file)

        if (UTILITY_META_FILES.includes(rel)) continue
        if (!content.includes('settings:')) continue

        violations.push(...validateSettingConstraints(content, rel))
      }

      expect(violations, `Settings missing validation constraints:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })
})
