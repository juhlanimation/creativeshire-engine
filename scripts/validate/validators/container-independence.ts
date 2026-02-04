/**
 * Container Independence Validator
 *
 * Validates that components work in both fullpage and iframe modes.
 * Checks for patterns that would break container independence.
 *
 * Rules:
 * - no-direct-window: Detect window. access without SSR guard in content/ files
 * - no-viewport-units: Detect vh/vw/svh/dvh in CSS without CSS variable abstraction
 * - container-breakpoints: Detect @media (min-width in content/**\/*.css (should use @container)
 */

import type { ValidationResult, Validator } from '../types'
import { hasMediaQueryBreakpoints, hasSSRGuard, hasViewportUnits } from '../utils/content-parser'
import { getFiles, readFile, relativePath } from '../utils/file-scanner'

/**
 * Check if file is in an allowed location for direct window access
 * (e.g., hooks that have SSR guards at the call site)
 */
function isAllowedWindowAccessLocation(filePath: string): boolean {
  const rel = relativePath(filePath)

  // Hooks typically have SSR guards at call site
  if (rel.includes('/hooks/')) return true

  // Stores may use window for initialization with SSR guards
  if (rel.includes('/store')) return true

  return false
}

/**
 * Check if viewport units usage is properly abstracted via CSS variables
 */
function hasViewportVariableAbstraction(content: string): boolean {
  // Check for CSS variable patterns that abstract viewport units
  return (
    content.includes('var(--vh') ||
    content.includes('var(--vw') ||
    content.includes('var(--viewport') ||
    content.includes('var(--container') ||
    content.includes('var(--screen')
  )
}

/**
 * Extract line numbers where viewport units are used (outside comments)
 */
function findViewportUnitLines(content: string): number[] {
  // Strip all CSS comments from content
  const withoutComments = content.replace(/\/\*[\s\S]*?\*\//g, '')
  const lines = withoutComments.split('\n')
  const matches: number[] = []

  // Track original line numbers by counting newlines in original content
  const originalLines = content.split('\n')
  let originalIndex = 0

  lines.forEach((line) => {
    // Find corresponding original line (skip comment-only sections)
    while (originalIndex < originalLines.length) {
      const origLine = originalLines[originalIndex]
      originalIndex++

      // Skip if this original line is entirely within a comment
      // Simple heuristic: if the stripped line is empty but original isn't, skip
      if (line.trim() === '' && origLine.trim() !== '') continue

      // Check this line for viewport units
      // Skip lines that use CSS variables for viewport units
      if (line.includes('var(--vh') || line.includes('var(--vw')) break

      // Skip viewport units inside var() fallbacks (e.g., var(--card-width, 55vw))
      if (/var\([^,]+,\s*\d+[sdl]?v[hw]\)/.test(line)) break

      // Check for viewport unit patterns: 100vh, 50vw, 100svh, etc.
      if (/\d+[sdl]?v[hw]\b/.test(line)) {
        matches.push(originalIndex) // Use original line number
      }
      break
    }
  })

  return matches
}

/**
 * Extract line numbers where media query breakpoints are used
 */
function findMediaQueryLines(content: string): number[] {
  const lines = content.split('\n')
  const matches: number[] = []

  lines.forEach((line, index) => {
    if (/@media\s*\([^)]*(?:min-width|max-width|min-height|max-height)/.test(line)) {
      matches.push(index + 1)
    }
  })

  return matches
}

/**
 * Extract line numbers where window. is accessed without SSR guard
 */
function findUnsafeWindowAccessLines(content: string): number[] {
  const lines = content.split('\n')
  const matches: number[] = []
  let inSSRGuard = false

  lines.forEach((line, index) => {
    // Track if we're inside an SSR guard block
    if (/typeof\s+window\s*(===|!==)\s*['"]undefined['"]/.test(line)) {
      inSSRGuard = true
    }

    // Reset SSR guard tracking at block boundaries (simplified)
    if (inSSRGuard && line.includes('}')) {
      inSSRGuard = false
    }

    // Check for window. access outside SSR guard
    if (!inSSRGuard && /\bwindow\./.test(line)) {
      // Skip common safe patterns
      if (line.includes('typeof window')) return
      if (line.includes('// eslint-disable')) return

      matches.push(index + 1)
    }
  })

  return matches
}

export const containerIndependenceValidator: Validator = {
  name: 'Container Independence',
  description: 'Validates components work in both fullpage and iframe modes',

  async validate(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = []

    // Rule 1: no-direct-window
    // Check TypeScript/TSX files in content/ for direct window access
    const tsFiles = await getFiles('content/**/*.{ts,tsx}')

    for (const file of tsFiles) {
      const content = await readFile(file)
      const relPath = relativePath(file)

      // Skip files in allowed locations
      if (isAllowedWindowAccessLocation(file)) continue

      // Check for window. access without SSR guard
      if (content.includes('window.') && !hasSSRGuard(content)) {
        const lineNumbers = findUnsafeWindowAccessLines(content)

        if (lineNumbers.length > 0) {
          results.push({
            file: relPath,
            rule: 'no-direct-window',
            status: 'fail',
            message: 'Direct window access without SSR guard',
            details: `Lines: ${lineNumbers.join(', ')}`,
          })
        }
      }
    }

    // Rule 2: no-viewport-units
    // Check all CSS files for viewport units without abstraction
    const cssFiles = await getFiles('**/*.css')

    for (const file of cssFiles) {
      const content = await readFile(file)
      const relPath = relativePath(file)

      if (hasViewportUnits(content)) {
        // Check if it's using CSS variables (allowed)
        if (!hasViewportVariableAbstraction(content)) {
          const lineNumbers = findViewportUnitLines(content)

          if (lineNumbers.length > 0) {
            results.push({
              file: relPath,
              rule: 'no-viewport-units',
              status: 'warning',
              message: 'Viewport units without CSS variable abstraction',
              details: `Lines: ${lineNumbers.join(', ')}`,
            })
          }
        }
      }
    }

    // Rule 3: container-breakpoints
    // Check content/ CSS files for media query breakpoints (should use @container)
    const contentCss = await getFiles('content/**/*.css')

    for (const file of contentCss) {
      const content = await readFile(file)
      const relPath = relativePath(file)

      if (hasMediaQueryBreakpoints(content)) {
        const lineNumbers = findMediaQueryLines(content)

        results.push({
          file: relPath,
          rule: 'container-breakpoints',
          status: 'fail',
          message: 'Uses viewport media queries instead of container queries',
          details: lineNumbers.length > 0 ? `Lines: ${lineNumbers.join(', ')}` : undefined,
        })
      }
    }

    // Add pass result if no issues found
    if (results.length === 0) {
      results.push({
        file: '',
        rule: 'container-independence',
        status: 'pass',
        message: 'All container independence checks passed',
      })
    }

    return results
  },
}
