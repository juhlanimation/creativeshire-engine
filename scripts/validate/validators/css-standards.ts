/**
 * CSS Standards Validator
 *
 * Validates CSS follows engine conventions.
 *
 * Rules:
 * - no-calc-var: No calc(var(--x)) without operation - use var(--x) directly
 * - no-keyframes-l1: No @keyframes in L1 content CSS (belongs in L2 effects)
 */

import type { Validator, ValidationResult } from '../types'
import { getFiles, readFile, relativePath } from '../utils/file-scanner'
import { hasCalcWithVar } from '../utils/content-parser'

/**
 * Extract line number for a pattern match
 */
function getLineNumber(content: string, pattern: RegExp): number | null {
  const match = content.match(pattern)
  if (!match || match.index === undefined) return null

  const beforeMatch = content.slice(0, match.index)
  return beforeMatch.split('\n').length
}

/**
 * Extract @keyframes name from content
 */
function extractKeyframeName(content: string): string | null {
  const match = content.match(/@keyframes\s+(\w+)/)
  return match ? match[1] : null
}

export const cssStandardsValidator: Validator = {
  name: 'CSS Standards',
  description: 'Validates CSS follows engine conventions',

  async validate(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = []

    // Check all CSS files for calc(var()) violations
    const allCssFiles = await getFiles('**/*.css')

    for (const file of allCssFiles) {
      const content = await readFile(file)
      const relPath = relativePath(file)

      // Check for calc(var()) without operation
      if (hasCalcWithVar(content)) {
        const lineNum = getLineNumber(content, /calc\s*\(\s*var\s*\([^)]+\)\s*\)/)
        results.push({
          file: relPath,
          rule: 'no-calc-var',
          status: 'warning',
          message: 'calc(var(--x)) without operation - use var(--x) directly',
          details: lineNum ? `Line ${lineNum}` : undefined,
        })
      }
    }

    // Check L1 content CSS for @keyframes (should be in L2 effects)
    const contentCssFiles = await getFiles('content/**/*.css')

    for (const file of contentCssFiles) {
      const content = await readFile(file)
      const relPath = relativePath(file)

      // Strip CSS comments before checking for @keyframes
      const withoutComments = content.replace(/\/\*[\s\S]*?\*\//g, '')

      // Check for @keyframes declarations (outside of comments)
      if (/@keyframes\s+\w+/.test(withoutComments)) {
        const keyframeName = extractKeyframeName(withoutComments)
        const lineNum = getLineNumber(content, /@keyframes\s+\w+/)

        results.push({
          file: relPath,
          rule: 'no-keyframes-l1',
          status: 'warning',
          message: '@keyframes belongs in L2 effects, not L1 content',
          details: keyframeName
            ? `Animation "${keyframeName}"${lineNum ? ` at line ${lineNum}` : ''} - move to experience/effects/`
            : undefined,
        })
      }
    }

    return results
  },
}
