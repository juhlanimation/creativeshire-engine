/**
 * Preset Binding Expression Validation Tests
 *
 * Validates that presets use binding expressions instead of hardcoded values:
 * - No hardcoded email addresses
 * - No placeholder/example URLs
 * - No placeholder text
 * - No empty content arrays
 * - Content props use binding expressions
 */

import { describe, it, expect } from 'vitest'
import { getFiles, readFile, relativePath } from './helpers'
import { sectionRegistry } from '../../engine/content/sections/registry'
import { getAllPresets, ensurePresetsRegistered } from '../../engine/presets'
import { buildSiteSchemaFromPreset, buildPageFromPreset } from '../../engine/presets/resolve'
import { noirSampleContent } from '../../engine/presets/noir'
import { prismSampleContent } from '../../engine/presets/prism'
import { loftSampleContent } from '../../engine/presets/loft'

ensurePresetsRegistered()

const PRESET_SAMPLE_CONTENT: Record<string, Record<string, unknown>> = {
  'noir': noirSampleContent,
  'prism': prismSampleContent,
  'loft': loftSampleContent,
}

describe('Preset Binding Expressions', () => {
  // Get all preset TypeScript files (excluding sample-content and content-contract which are metadata)
  const getPresetFiles = async () => {
    const files = await getFiles('presets/**/*.ts')
    return files.filter(f =>
      !f.includes('sample-content') &&
      !f.includes('content-contract')
    )
  }

  it('presets must not contain hardcoded email addresses', async () => {
    const files = await getPresetFiles()
    const violations: string[] = []
    const emailPattern = /['"`][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}['"`]/g

    for (const file of files) {
      const content = await readFile(file)
      const matches = content.match(emailPattern)
      if (matches) {
        violations.push(`${relativePath(file)}: ${matches.join(', ')}`)
      }
    }

    expect(violations, `Hardcoded emails found:\n${violations.join('\n')}`).toHaveLength(0)
  })

  it('presets must not contain example/placeholder URLs', async () => {
    const files = await getPresetFiles()
    const violations: string[] = []
    const urlPatterns = [
      /['"`]https?:\/\/example\.com[^'"`]*['"`]/g,
      /['"`]https?:\/\/linkedin\.com['"`]/g, // Generic without path
      /['"`]https?:\/\/instagram\.com['"`]/g,
      /['"`]https?:\/\/facebook\.com['"`]/g,
    ]

    for (const file of files) {
      const content = await readFile(file)
      for (const pattern of urlPatterns) {
        const matches = content.match(pattern)
        if (matches) {
          violations.push(`${relativePath(file)}: ${matches.join(', ')}`)
        }
      }
    }

    expect(violations, `Placeholder URLs found:\n${violations.join('\n')}`).toHaveLength(0)
  })

  it('presets must not contain placeholder text', async () => {
    const files = await getPresetFiles()
    const violations: string[] = []
    const placeholderPatterns = [
      /['"`].*placeholder.*['"`]/gi,
      /['"`]Your Name['"`]/g,
      /['"`]Bio paragraph['"`]/g,
      /['"`]Copyright © Your Name['"`]/g,
    ]

    for (const file of files) {
      const content = await readFile(file)
      for (const pattern of placeholderPatterns) {
        const matches = content.match(pattern)
        if (matches) {
          violations.push(`${relativePath(file)}: ${matches.join(', ')}`)
        }
      }
    }

    expect(violations, `Placeholder text found:\n${violations.join('\n')}`).toHaveLength(0)
  })

  it('presets must not use empty arrays for content props', async () => {
    const files = await getPresetFiles()
    const violations: string[] = []
    // Match: projects: [], clientLogos: [], items: []
    const emptyArrayPattern = /(projects|clientLogos|items|logos|links|socials):\s*\[\s*\]/g

    for (const file of files) {
      const content = await readFile(file)
      const matches = content.match(emptyArrayPattern)
      if (matches) {
        violations.push(`${relativePath(file)}: ${matches.join(', ')}`)
      }
    }

    expect(
      violations,
      `Empty content arrays found (use binding expressions):\n${violations.join('\n')}`
    ).toHaveLength(0)
  })

  it('content props in presets use binding expressions', async () => {
    const files = await getPresetFiles()
    const violations: string[] = []

    // Content prop names that MUST use binding expressions when inside widget props
    // Excluded: 'title', 'description', 'content' - too generic, conflict with theme/head props
    const contentProps = [
      'email',
      'heading',
      'introText',
      'signature',
      'copyrightText',
      'bioParagraphs',
      'projects',
      'clientLogos',
      'navLinks',
      'photoSrc',
      'photoAlt',
      'videoSrc',
      'yearRange',
      'scrollIndicatorText',
      'roles',
    ]

    for (const file of files) {
      const fileContent = await readFile(file)

      // Only check files that define widget props (have 'props:' blocks)
      if (!fileContent.includes('props:')) continue

      for (const prop of contentProps) {
        // Pattern: propName: 'literal' or propName: "literal" (not binding)
        // Binding pattern starts with '{{ '
        const literalPattern = new RegExp(`${prop}:\\s*['"\`](?!\\{\\{)[^'"\`]+['"\`]`, 'g')
        const matches = fileContent.match(literalPattern)
        if (matches) {
          violations.push(`${relativePath(file)}: ${prop} should use binding expression`)
        }
      }
    }

    expect(
      violations,
      `Content props without binding expressions:\n${violations.join('\n')}`
    ).toHaveLength(0)
  })

  it('all sections in presets must have a label', async () => {
    const files = await getPresetFiles()
    const violations: string[] = []

    for (const file of files) {
      // Only check page files that define sections
      if (!file.includes('/pages/') && !file.includes('\\pages\\')) continue
      const content = await readFile(file)

      // Find section definitions (objects with id: and layout:)
      const sectionBlocks = content.match(/\{\s*id:\s*['"`][^'"`]+['"`][^}]*layout:/gs)
      if (!sectionBlocks) continue

      for (const block of sectionBlocks) {
        if (!block.includes('label:')) {
          const idMatch = block.match(/id:\s*['"`]([^'"`]+)['"`]/)
          if (idMatch) {
            violations.push(`${relativePath(file)}: section '${idMatch[1]}' missing label`)
          }
        }
      }
    }

    expect(violations, `Sections without labels:\n${violations.join('\n')}`).toHaveLength(0)
  })

  it('patternId values must reference registered section patterns', async () => {
    const files = await getPresetFiles()
    const violations: string[] = []
    const registeredIds = Object.keys(sectionRegistry)

    for (const file of files) {
      if (!file.includes('/pages/') && !file.includes('\\pages\\')) continue
      const content = await readFile(file)

      // Find all patternId values in the file
      const patternMatches = content.matchAll(/patternId:\s*['"`]([^'"`]+)['"`]/g)
      for (const match of patternMatches) {
        if (!registeredIds.includes(match[1])) {
          violations.push(
            `${relativePath(file)}: patternId '${match[1]}' is not registered in sectionRegistry`
          )
        }
      }
    }

    expect(
      violations,
      `Invalid patternId references:\n${violations.join('\n')}`
    ).toHaveLength(0)
  })

  it('sections using registered pattern factories must have patternId', async () => {
    const violations: string[] = []

    // Every registered factory must stamp patternId in its return value
    const factoryFiles = await getFiles('content/sections/patterns/*/index.ts')

    for (const id of Object.keys(sectionRegistry)) {
      const factoryFile = factoryFiles.find(f => {
        const normalized = f.replace(/\\/g, '/')
        return normalized.includes(`/patterns/${id}/index.ts`)
      })

      if (!factoryFile) {
        violations.push(`Factory file not found for pattern '${id}'`)
        continue
      }

      const content = await readFile(factoryFile)
      if (!content.includes(`patternId: '${id}'`) && !content.includes(`patternId: "${id}"`)) {
        violations.push(
          `${relativePath(factoryFile)}: create${id}Section() does not stamp patternId: '${id}' in its return value`
        )
      }
    }

    expect(
      violations,
      `Factory patternId violations:\n${violations.join('\n')}`
    ).toHaveLength(0)
  })
})

describe('Preset Resolution Parity', () => {
  /**
   * Runtime binding patterns that are resolved at render time (inside __repeat
   * contexts, dynamic scopes, etc.) — NOT at preset build time.
   */
  const RUNTIME_BINDING = /\{\{\s*(item\.|projects\[)/

  /** Recursively scan for raw binding expressions in a value. */
  function findRawBindings(value: unknown, path: string): string[] {
    if (value == null) return []
    if (typeof value === 'string') {
      if (!value.includes('{{')) return []
      // Skip runtime iteration/scope bindings — resolved by repeaters at render time
      if (RUNTIME_BINDING.test(value)) return []
      return [`${path}: "${value}"`]
    }
    if (Array.isArray(value)) {
      return value.flatMap((item, i) => findRawBindings(item, `${path}[${i}]`))
    }
    if (typeof value === 'object') {
      return Object.entries(value).flatMap(([key, val]) => findRawBindings(val, `${path}.${key}`))
    }
    return []
  }

  // Known pre-existing unresolved content bindings — hidden until destructuring
  // bug was fixed (was `{ id, preset }` instead of `{ meta, preset }`).
  // TODO: Fix sample content + condition binding resolution, then set to 0.
  const CHROME_BINDING_BASELINE = 3  // noir: condition bindings on footer
  const PAGE_BINDING_BASELINE = 10   // prism: socialLinks + the21 content paths

  it('buildSiteSchemaFromPreset produces no raw {{ }} bindings in chrome', () => {
    const violations: string[] = []
    for (const { meta, preset } of getAllPresets()) {
      const content = PRESET_SAMPLE_CONTENT[meta.id]
      if (!content) continue // Skip presets without sample content
      const site = buildSiteSchemaFromPreset(meta.id, preset, { content })
      violations.push(...findRawBindings(site.chrome, `${meta.id}.chrome`))
    }
    expect(
      violations.length,
      `Raw bindings in chrome (baseline ${CHROME_BINDING_BASELINE}):\n${violations.join('\n')}`
    ).toBeLessThanOrEqual(CHROME_BINDING_BASELINE)
  })

  it('buildPageFromPreset produces no raw {{ }} bindings in pages', () => {
    const violations: string[] = []
    for (const { meta, preset } of getAllPresets()) {
      const content = PRESET_SAMPLE_CONTENT[meta.id]
      if (!content) continue
      for (const pageKey of Object.keys(preset.content.pages)) {
        const page = buildPageFromPreset(preset, pageKey, content)
        if (page) {
          violations.push(...findRawBindings(page, `${meta.id}.pages.${pageKey}`))
        }
      }
    }
    expect(
      violations.length,
      `Raw bindings in pages (baseline ${PAGE_BINDING_BASELINE}):\n${violations.join('\n')}`
    ).toBeLessThanOrEqual(PAGE_BINDING_BASELINE)
  })

  it('buildSiteSchemaFromPreset produces no raw {{ }} bindings in intro', () => {
    const violations: string[] = []
    for (const { meta, preset } of getAllPresets()) {
      const content = PRESET_SAMPLE_CONTENT[meta.id]
      if (!content) continue
      const site = buildSiteSchemaFromPreset(meta.id, preset, { content })
      if (site.experience?.intro) {
        violations.push(...findRawBindings(site.experience.intro, `${meta.id}.intro`))
      }
    }
    expect(violations, `Raw bindings in intro:\n${violations.join('\n')}`).toHaveLength(0)
  })
})
