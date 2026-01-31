/**
 * Architecture Test Helpers
 *
 * Utilities for validating Creativeshire architecture rules.
 */

import fg from 'fast-glob'
import fs from 'fs/promises'
import path from 'path'

const ROOT = process.cwd()
const CREATIVESHIRE = path.join(ROOT, 'creativeshire')

/**
 * Get all files matching a glob pattern within creativeshire/
 */
export async function getFiles(pattern: string): Promise<string[]> {
  return fg(pattern, {
    cwd: CREATIVESHIRE,
    absolute: true,
    ignore: ['**/node_modules/**', '**/*.test.ts'],
  })
}

/**
 * Get all directories matching a glob pattern within creativeshire/
 */
export async function getFolders(pattern: string): Promise<string[]> {
  return fg(pattern, {
    cwd: CREATIVESHIRE,
    absolute: true,
    onlyDirectories: true,
    ignore: ['**/node_modules/**', '**/styles/**'],
  })
}

/**
 * Get component name from folder path (last segment)
 */
export function getComponentName(folderPath: string): string {
  return path.basename(folderPath)
}

/**
 * Read file contents
 */
export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf-8')
}

/**
 * Check if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

/**
 * Extract import statements from TypeScript/TSX file
 */
export function extractImports(content: string): string[] {
  const importRegex = /import\s+(?:.*?\s+from\s+)?['"](.*?)['"]/g
  const imports: string[] = []
  let match
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1])
  }
  return imports
}

/**
 * Check if content has React state hooks
 */
export function hasReactState(content: string): boolean {
  return /\buseState\s*[<(]/.test(content) || /\buseReducer\s*[<(]/.test(content)
}

/**
 * Check if content has useEffect
 */
export function hasUseEffect(content: string): boolean {
  return /\buseEffect\s*\(/.test(content)
}

/**
 * Check if content has SSR guard
 */
export function hasSSRGuard(content: string): boolean {
  return /typeof\s+window\s*(===|!==)\s*['"]undefined['"]/.test(content) ||
         /typeof\s+window\s*(===|!==)\s*'undefined'/.test(content)
}

/**
 * Extract behaviour ID from behaviour file
 */
export function extractBehaviourId(content: string): string | null {
  const match = content.match(/id:\s*['"]([^'"]+)['"]/)
  return match ? match[1] : null
}

/**
 * Extract transition ID from transition file
 */
export function extractTransitionId(content: string): string | null {
  const match = content.match(/id:\s*['"]([^'"]+)['"]/)
  return match ? match[1] : null
}

/**
 * Check if behaviour has requires array
 */
export function hasRequiresArray(content: string): boolean {
  return /requires:\s*\[/.test(content)
}

/**
 * Check if behaviour has cssTemplate
 */
export function hasCssTemplate(content: string): boolean {
  return /cssTemplate:\s*['"`]/.test(content)
}

/**
 * Check if CSS uses viewport units
 */
export function hasViewportUnits(content: string): boolean {
  return /\d+[sdl]?vh\b/.test(content) || /\d+[sdl]?vw\b/.test(content)
}

/**
 * Check if CSS uses calc with CSS variables incorrectly.
 *
 * ALLOWED patterns (calc performs useful operation):
 * - calc(var(--x) * 1px)    - Unit conversion
 * - calc(var(--x) + 10px)   - Addition
 * - calc(var(--x) * 0.5)    - Multiplication
 *
 * VIOLATION patterns (calc wraps var without operation):
 * - calc(var(--x))          - No operation, just wrapping
 *
 * Note: calc() on timing values (transition, animation-duration) is always fine.
 */
export function hasCalcWithVar(content: string): boolean {
  // Match calc(var(...)) that is NOT followed by an arithmetic operator
  // This regex looks for calc( var(--name) ) without *, +, -, / after the closing paren of var
  const matches = content.match(/calc\s*\(\s*var\s*\([^)]+\)\s*\)/g)
  if (!matches) return false

  // Filter out false positives where calc contains operations
  for (const match of matches) {
    // Check if there's an operator AFTER the var() inside the calc()
    // e.g., calc(var(--x) * 1px) - the * is after var()
    // We need to check the full calc expression, not just this match
    const fullCalcMatch = content.match(new RegExp(
      match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, -1) + '[^)]*\\)',
      'g'
    ))

    // Simple check: if the calc() only contains var() and nothing else, it's a violation
    // calc( var(--x) ) with no operators = bad
    // calc( var(--x) * 1px ) = good
    if (!/calc\s*\(\s*var\s*\([^)]+\)\s*[*+\-\/]/.test(content)) {
      // But we need to check if this specific calc has an operator
      // Re-extract the full calc() expression
      const calcExpressions = content.match(/calc\s*\([^)]+var\([^)]+\)[^)]*\)/g)
      if (calcExpressions) {
        for (const expr of calcExpressions) {
          // Check if there's no operator after var()
          if (/calc\s*\(\s*var\s*\([^)]+\)\s*\)/.test(expr)) {
            return true // Found a violation: calc(var(--x)) with no operation
          }
        }
      }
    }
  }

  return false
}

/**
 * Get relative path from creativeshire folder
 */
export function relativePath(filePath: string): string {
  return path.relative(CREATIVESHIRE, filePath).replace(/\\/g, '/')
}

/**
 * Layer detection from file path
 */
export function getLayer(filePath: string): 'content' | 'experience' | 'renderer' | 'schema' | 'presets' | 'unknown' {
  const rel = relativePath(filePath)
  if (rel.startsWith('content/')) return 'content'
  if (rel.startsWith('experience/')) return 'experience'
  if (rel.startsWith('renderer/')) return 'renderer'
  if (rel.startsWith('schema/')) return 'schema'
  if (rel.startsWith('presets/')) return 'presets'
  return 'unknown'
}

/**
 * Check if import crosses L1/L2 boundary incorrectly
 */
export function isL1ToL2Import(filePath: string, importPath: string): boolean {
  const layer = getLayer(filePath)
  if (layer !== 'content') return false

  // L1 (content) importing from L2 (experience) is a violation
  return importPath.includes('experience/') ||
         importPath.includes('@/creativeshire/experience')
}

/**
 * Format test results for reporting
 */
export function formatViolation(file: string, rule: string, detail: string): string {
  return `${relativePath(file)}: ${rule} - ${detail}`
}
