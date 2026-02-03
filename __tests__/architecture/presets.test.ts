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

describe('Preset Binding Expressions', () => {
  // Get all preset TypeScript files
  const getPresetFiles = () => getFiles('presets/**/*.ts')

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
      'promptText',
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
})
