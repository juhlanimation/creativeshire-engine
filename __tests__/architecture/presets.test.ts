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
