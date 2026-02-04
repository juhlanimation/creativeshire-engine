/**
 * CMS Customization Validator
 *
 * Validates presets use binding expressions for dynamic content
 * instead of hardcoded values.
 *
 * Rules:
 * - binding-expressions: Presets should use {{ content.xxx }} for dynamic content
 * - no-hardcoded-email: No literal email addresses in presets
 * - no-hardcoded-urls: No example.com or placeholder URLs
 */

import type { Validator, ValidationResult } from '../types'
import { getFiles, readFile, relativePath } from '../utils/file-scanner'

/**
 * Email regex pattern - matches quoted email addresses
 */
const EMAIL_PATTERN = /['"`][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}['"`]/g

/**
 * Placeholder URL patterns to detect
 */
const PLACEHOLDER_URL_PATTERNS = [
  'example.com',
  'example.org',
  'placeholder.com',
  'yoursite.com',
  'yourdomain.com',
  'test.com',
  'foo.com',
  'bar.com',
]

/**
 * Check if a matched email is inside a binding expression
 */
function isInsideBinding(content: string, match: string): boolean {
  // Check if the match appears within {{ }} binding syntax
  const bindingPattern = /\{\{[^}]*\}\}/g
  let bindingMatch
  while ((bindingMatch = bindingPattern.exec(content)) !== null) {
    if (bindingMatch[0].includes(match.slice(1, -1))) {
      return true
    }
  }
  return false
}

/**
 * Check if match is in a comment
 */
function isInComment(content: string, matchIndex: number): boolean {
  // Check if the match is preceded by // on the same line
  const lineStart = content.lastIndexOf('\n', matchIndex) + 1
  const lineContent = content.slice(lineStart, matchIndex)

  if (lineContent.includes('//')) return true

  // Check if inside a block comment
  const beforeMatch = content.slice(0, matchIndex)
  const lastBlockOpen = beforeMatch.lastIndexOf('/*')
  const lastBlockClose = beforeMatch.lastIndexOf('*/')

  return lastBlockOpen > lastBlockClose
}

export const cmsCustomizationValidator: Validator = {
  name: 'CMS Customization',
  description: 'Validates presets use binding expressions for dynamic content',

  async validate(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = []

    const presetFiles = await getFiles('presets/**/*.ts')

    for (const file of presetFiles) {
      const content = await readFile(file)
      const relPath = relativePath(file)

      // Check for hardcoded emails
      let emailMatch
      EMAIL_PATTERN.lastIndex = 0 // Reset regex state
      while ((emailMatch = EMAIL_PATTERN.exec(content)) !== null) {
        const match = emailMatch[0]
        const matchIndex = emailMatch.index

        // Skip if in binding expression or comment
        if (isInsideBinding(content, match)) continue
        if (isInComment(content, matchIndex)) continue

        results.push({
          file: relPath,
          rule: 'no-hardcoded-email',
          status: 'warning',
          message: 'Hardcoded email found',
          details: `Found: ${match} - consider using {{ content.email }} binding`,
        })
      }

      // Check for placeholder URLs
      for (const placeholder of PLACEHOLDER_URL_PATTERNS) {
        if (content.includes(placeholder)) {
          // Find the line number for context
          const lines = content.split('\n')
          const lineIndex = lines.findIndex((line) => line.includes(placeholder))

          // Skip if in comment
          if (lineIndex >= 0) {
            const line = lines[lineIndex]
            if (line.trim().startsWith('//') || line.trim().startsWith('*')) continue
          }

          results.push({
            file: relPath,
            rule: 'no-hardcoded-urls',
            status: 'warning',
            message: 'Placeholder URL found',
            details: `Found "${placeholder}" - use actual URLs or binding expressions`,
          })
        }
      }
    }

    return results
  },
}
