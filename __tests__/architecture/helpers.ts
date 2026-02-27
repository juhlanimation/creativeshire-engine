/**
 * Architecture Test Helpers
 *
 * Utilities for validating Creativeshire Engine architecture rules.
 */

import fg from 'fast-glob'
import fs from 'fs/promises'
import path from 'path'

const ROOT = process.cwd()
const ENGINE = path.join(ROOT, 'engine')

/**
 * Get all files matching a glob pattern within engine/
 */
export async function getFiles(pattern: string): Promise<string[]> {
  return fg(pattern, {
    cwd: ENGINE,
    absolute: true,
    ignore: ['**/node_modules/**', '**/*.test.ts', '**/*.stories.tsx'],
  })
}

/**
 * Get all directories matching a glob pattern within engine/
 */
export async function getFolders(pattern: string): Promise<string[]> {
  return fg(pattern, {
    cwd: ENGINE,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _match of matches) {
    // Check if there's an operator AFTER the var() inside the calc()
    // e.g., calc(var(--x) * 1px) - the * is after var()
    // We need to check the full calc expression, not just this match
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
 * Check if a component folder has a Storybook story file (*.stories.tsx)
 */
export async function hasStoryFile(folderPath: string): Promise<boolean> {
  const stories = await fg('*.stories.tsx', { cwd: folderPath })
  return stories.length > 0
}

/**
 * Get the story file path for a component folder, or null if none exists.
 */
export async function getStoryFile(folderPath: string): Promise<string | null> {
  const stories = await fg('*.stories.tsx', { cwd: folderPath, absolute: true })
  return stories[0] ?? null
}

/**
 * Get relative path from engine folder
 */
export function relativePath(filePath: string): string {
  return path.relative(ENGINE, filePath).replace(/\\/g, '/')
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
         importPath.includes('@/engine/experience')
}

/**
 * Format test results for reporting
 */
export function formatViolation(file: string, rule: string, detail: string): string {
  return `${relativePath(file)}: ${rule} - ${detail}`
}

/**
 * Validate that a meta.ts file content uses the correct define helper function.
 * Returns violations as strings.
 */
export function validateMetaFileContent(
  content: string,
  context: string,
  expectedHelper?: string
): string[] {
  const violations: string[] = []

  if (!content.includes('export const meta')) {
    violations.push(`${context}: missing 'export const meta'`)
  }

  if (expectedHelper && !content.includes(expectedHelper)) {
    violations.push(`${context}: should use ${expectedHelper}()`)
  }

  const requiredFields = ['id:', 'name:', 'description:', 'category:']
  for (const field of requiredFields) {
    if (!content.includes(field)) {
      violations.push(`${context}: missing ${field}`)
    }
  }

  return violations
}

/**
 * Validate settings in source code content.
 * Checks that each top-level settings entry has type, label, and default.
 * Returns violations as strings.
 */
export function validateSettingsContent(content: string, context: string): string[] {
  const violations: string[] = []

  const settingsStart = content.indexOf('settings:')
  if (settingsStart === -1) return violations

  const braceStart = content.indexOf('{', settingsStart)
  if (braceStart === -1) return violations

  // Extract the full settings block by tracking brace depth
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

  // Walk through settingsBlock at depth 0 to find top-level keys
  depth = 0
  let pos = 0
  while (pos < settingsBlock.length) {
    if (settingsBlock[pos] === '{') { depth++; pos++; continue }
    if (settingsBlock[pos] === '}') { depth--; pos++; continue }

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

    if (depth === 0) {
      const remaining = settingsBlock.slice(pos)
      const keyMatch = remaining.match(/^(?:['"]([^'"]+)['"]|(\w+))\s*:\s*\{/)

      if (keyMatch) {
        const key = keyMatch[1] || keyMatch[2]
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

        pos = entryBraceStart + (j - entryBraceStart)
        continue
      }
    }

    pos++
  }

  return violations
}

/**
 * Validate registry completeness: every folder has a registry entry and vice versa.
 * Returns violations as strings.
 */
/**
 * Strip var() expressions from a CSS line, replacing with VAR placeholder.
 * Handles nested parens: var(--a, rgba(0,0,0,0.1)) → VAR
 * Handles nested var(): var(--a, var(--b, #fff)) → VAR
 */
export function stripVarExpressions(line: string): string {
  let result = ''
  let i = 0

  while (i < line.length) {
    // Look for 'var(' at current position
    if (line.slice(i, i + 4) === 'var(') {
      // Track paren depth to find matching close
      let depth = 1
      let j = i + 4
      while (j < line.length && depth > 0) {
        if (line[j] === '(') depth++
        if (line[j] === ')') depth--
        j++
      }
      result += 'VAR'
      i = j
    } else {
      result += line[i]
      i++
    }
  }

  return result
}

/**
 * Check if a trimmed CSS line is a comment
 */
export function isCSSComment(line: string): boolean {
  return line.startsWith('/*') || line.startsWith('*') || line.startsWith('//')
}

/**
 * Check if a trimmed CSS line is a custom property declaration (--name: value)
 */
export function isCustomPropertyDecl(line: string): boolean {
  return /^\s*--[\w-]+\s*:/.test(line)
}

/**
 * Scan CSS files for theme variable violations.
 *
 * @param filePattern - glob pattern relative to engine/ (e.g. 'content/**\/*.css')
 * @param propertyTest - regex to match the CSS property of interest (e.g. /border-radius:/)
 * @param violationTest - function that checks if a var()-stripped line has a violation
 * @param skipPaths - path substrings to skip (in addition to global exclusions)
 * @returns array of 'relative/path:line: content' strings
 */
export async function findThemeViolations(
  filePattern: string,
  propertyTest: RegExp,
  violationTest: (strippedLine: string) => boolean,
  skipPaths: string[] = [],
): Promise<string[]> {
  const files = await getFiles(filePattern)
  const violations: string[] = []

  // Global exclusions
  const globalExclusions = [
    'renderer/dev/DevToolsPanel/',
    'experience/effects/',
    'experience/compositions/',
  ]

  const allSkips = [...globalExclusions, ...skipPaths]

  for (const file of files) {
    const rel = relativePath(file)
    if (allSkips.some(skip => rel.includes(skip))) continue

    const content = await readFile(file)
    const lines = content.split('\n')
    let inBlockComment = false

    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim()

      // Track block comments
      if (inBlockComment) {
        if (trimmed.includes('*/')) inBlockComment = false
        continue
      }
      if (trimmed.startsWith('/*') && !trimmed.includes('*/')) {
        inBlockComment = true
        continue
      }

      // Skip single-line comments and custom property declarations
      if (isCSSComment(trimmed)) continue
      if (isCustomPropertyDecl(trimmed)) continue

      // Check if line matches the property we're scanning for
      if (!propertyTest.test(trimmed)) continue

      // Strip var() expressions and test what remains
      const stripped = stripVarExpressions(trimmed)
      if (violationTest(stripped)) {
        violations.push(`${rel}:${i + 1}: ${trimmed}`)
      }
    }
  }

  return violations
}

export function validateRegistryCompleteness(
  folderNames: string[],
  registryKeys: string[],
  layerName: string
): string[] {
  const violations: string[] = []
  const folderSet = new Set(folderNames)
  const registrySet = new Set(registryKeys)

  for (const folder of folderNames) {
    if (!registrySet.has(folder)) {
      violations.push(`${layerName}: folder "${folder}" exists but not registered`)
    }
  }

  for (const key of registryKeys) {
    if (!folderSet.has(key)) {
      violations.push(`${layerName}: registry has "${key}" but no folder exists`)
    }
  }

  return violations
}
