/**
 * Content Parser Utilities
 *
 * Pattern detection utilities for analyzing file content.
 * Patterns adapted from __tests__/architecture/helpers.ts
 */

/**
 * Check if content has SSR guard (typeof window checks)
 */
export function hasSSRGuard(content: string): boolean {
  return (
    /typeof\s+window\s*(===|!==)\s*['"]undefined['"]/.test(content) ||
    /typeof\s+window\s*(===|!==)\s*'undefined'/.test(content)
  )
}

/**
 * Check if CSS uses viewport units (vh, vw, svh, svw, dvh, dvw, lvh, lvw)
 * Ignores viewport units inside CSS comments.
 */
export function hasViewportUnits(content: string): boolean {
  // Strip CSS comments before checking
  const withoutComments = content.replace(/\/\*[\s\S]*?\*\//g, '')
  return /\d+[sdl]?vh\b/.test(withoutComments) || /\d+[sdl]?vw\b/.test(withoutComments)
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
 */
export function hasCalcWithVar(content: string): boolean {
  // Match calc(var(...)) that is NOT followed by an arithmetic operator
  const matches = content.match(/calc\s*\(\s*var\s*\([^)]+\)\s*\)/g)
  if (!matches) return false

  // Check each match for violations
  for (const match of matches) {
    // If the calc() only contains var() and nothing else, it's a violation
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

  return false
}

/**
 * Check if CSS has media query breakpoints
 */
export function hasMediaQueryBreakpoints(content: string): boolean {
  return /@media\s*\([^)]*(?:min-width|max-width|min-height|max-height)/.test(content)
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
 * Check if content has binding expression (dynamic value interpolation)
 * Looks for patterns like: value={someVar} or value={obj.prop}
 */
export function hasBindingExpression(content: string): boolean {
  // JSX binding: prop={value} where value is not a string literal
  return /=\{[^}]+\}/.test(content)
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
 * Extract behaviour ID from behaviour file
 */
export function extractBehaviourId(content: string): string | null {
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
 * Check if import crosses L1/L2 boundary incorrectly
 */
export function isL1ToL2Import(relativePath: string, importPath: string): boolean {
  if (!relativePath.startsWith('content/')) return false

  // L1 (content) importing from L2 (experience) is a violation
  return importPath.includes('experience/') || importPath.includes('@/engine/experience')
}

/**
 * Check if file exports a React component (has default export with JSX)
 */
export function exportsReactComponent(content: string): boolean {
  return /export\s+default\s+function/.test(content) && /<[A-Z]/.test(content)
}

/**
 * Extract exported type/interface names
 */
export function extractExportedTypes(content: string): string[] {
  const typeRegex = /export\s+(?:type|interface)\s+(\w+)/g
  const types: string[] = []
  let match
  while ((match = typeRegex.exec(content)) !== null) {
    types.push(match[1])
  }
  return types
}
