/**
 * Schema Utilities
 *
 * Generic utilities for working with schema objects:
 * - Path-based value access (get/set/has)
 * - Schema traversal
 *
 * These are pure functions that work on any schema object.
 */

// =============================================================================
// Path Utilities
// =============================================================================

/**
 * Parse a dot-notation path into parts.
 * Handles array notation: 'pages.0.title' -> ['pages', '0', 'title']
 */
function parsePath(path: string): string[] {
  return path.split('.')
}

/**
 * Get value at dot-notation path.
 *
 * @param obj - Object to traverse
 * @param path - Dot-notation path (e.g., 'theme.colors.primary', 'pages.0.title')
 * @returns Value at path or undefined if not found
 *
 * @example
 * ```typescript
 * getValueAtPath(schema, 'theme.colors.primary') // '#3B82F6'
 * getValueAtPath(schema, 'pages.0.title') // 'Home'
 * getValueAtPath(content, 'contact.displayName') // 'Mia Chen'
 * ```
 */
export function getValueAtPath(obj: unknown, path: string): unknown {
  const parts = parsePath(path)
  let current: unknown = obj

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined
    }

    if (Array.isArray(current)) {
      const index = parseInt(part, 10)
      if (isNaN(index)) {
        return undefined
      }
      current = current[index]
    } else if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[part]
    } else {
      return undefined
    }
  }

  return current
}

/**
 * Set value at dot-notation path.
 * Creates intermediate objects/arrays as needed.
 * Mutates the original object.
 *
 * @param obj - Object to modify
 * @param path - Dot-notation path
 * @param value - Value to set
 *
 * @example
 * ```typescript
 * setValueAtPath(schema, 'theme.colors.primary', '#EF4444')
 * setValueAtPath(schema, 'pages.0.title', 'Welcome')
 * ```
 */
export function setValueAtPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): void {
  const parts = parsePath(path)
  let current: Record<string, unknown> | unknown[] = obj

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    const nextPart = parts[i + 1]
    const nextIsArrayIndex = !isNaN(parseInt(nextPart, 10))

    if (Array.isArray(current)) {
      const index = parseInt(part, 10)
      if (current[index] === undefined || current[index] === null) {
        current[index] = nextIsArrayIndex ? [] : {}
      }
      current = current[index] as Record<string, unknown> | unknown[]
    } else {
      if (!(part in current) || current[part] === null) {
        current[part] = nextIsArrayIndex ? [] : {}
      }
      current = current[part] as Record<string, unknown> | unknown[]
    }
  }

  const lastPart = parts[parts.length - 1]
  if (Array.isArray(current)) {
    const index = parseInt(lastPart, 10)
    current[index] = value
  } else {
    current[lastPart] = value
  }
}

/**
 * Check if a value exists at the given path.
 *
 * @param obj - Object to check
 * @param path - Dot-notation path
 * @returns true if path exists and has a value (including null)
 */
export function hasValueAtPath(obj: unknown, path: string): boolean {
  return getValueAtPath(obj, path) !== undefined
}

/**
 * Get all paths that have values in an object.
 * Useful for debugging and validation.
 *
 * @param obj - Object to traverse
 * @param maxDepth - Maximum depth to traverse (default: 10)
 * @returns Array of dot-notation paths
 */
export function getAllPaths(obj: unknown, maxDepth: number = 10): string[] {
  const paths: string[] = []

  function traverse(value: unknown, currentPath: string, depth: number): void {
    if (depth > maxDepth || value === null || value === undefined) {
      return
    }

    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const newPath = currentPath ? `${currentPath}.${i}` : String(i)
        paths.push(newPath)
        traverse(value[i], newPath, depth + 1)
      }
    } else if (typeof value === 'object') {
      for (const [key, propValue] of Object.entries(value)) {
        const newPath = currentPath ? `${currentPath}.${key}` : key
        paths.push(newPath)
        traverse(propValue, newPath, depth + 1)
      }
    }
    // Primitive values don't add more paths
  }

  traverse(obj, '', 0)
  return paths
}

// =============================================================================
// Deep Clone & Merge
// =============================================================================

/**
 * Deep clone an object using structuredClone.
 * Use this when you need to modify a schema without affecting the original.
 *
 * @param obj - Object to clone
 * @returns Deep copy of the object
 */
export function deepClone<T>(obj: T): T {
  return structuredClone(obj)
}

/**
 * Merge overrides into a base object.
 * Creates a new object without modifying the original.
 *
 * @param base - Base object
 * @param overrides - Flat key-value map of path -> value
 * @returns New object with overrides applied
 *
 * @example
 * ```typescript
 * const merged = mergeOverrides(preset, {
 *   'theme.colors.primary': '#EF4444',
 *   'settings.darkMode': true,
 * })
 * ```
 */
export function mergeOverrides<T extends Record<string, unknown>>(
  base: T,
  overrides: Record<string, unknown>
): T {
  const merged = deepClone(base)

  for (const [path, value] of Object.entries(overrides)) {
    setValueAtPath(merged, path, value)
  }

  return merged
}

/**
 * Extract differences between two objects as a flat override map.
 *
 * @param original - Original object
 * @param modified - Modified object
 * @returns Flat object of path -> value for all changed fields
 *
 * @example
 * ```typescript
 * const overrides = extractOverrides(originalPreset, modifiedSchema)
 * // { 'theme.colors.primary': '#EF4444', 'settings.darkMode': true }
 * ```
 */
export function extractOverrides(
  original: unknown,
  modified: unknown
): Record<string, unknown> {
  const overrides: Record<string, unknown> = {}

  function compareAndExtract(
    orig: unknown,
    mod: unknown,
    currentPath: string
  ): void {
    // Handle null/undefined cases
    if (orig === mod) {
      return
    }

    if (orig === null || orig === undefined) {
      if (mod !== null && mod !== undefined) {
        overrides[currentPath] = mod
      }
      return
    }

    if (mod === null || mod === undefined) {
      overrides[currentPath] = mod
      return
    }

    // Handle arrays
    if (Array.isArray(orig) && Array.isArray(mod)) {
      // If arrays have different lengths, store the whole array
      if (orig.length !== mod.length) {
        overrides[currentPath] = mod
        return
      }

      // Compare each element
      for (let i = 0; i < mod.length; i++) {
        compareAndExtract(
          orig[i],
          mod[i],
          currentPath ? `${currentPath}.${i}` : String(i)
        )
      }
      return
    }

    // Handle objects
    if (
      typeof orig === 'object' &&
      typeof mod === 'object' &&
      !Array.isArray(orig) &&
      !Array.isArray(mod)
    ) {
      const origObj = orig as Record<string, unknown>
      const modObj = mod as Record<string, unknown>
      const allKeys = new Set([...Object.keys(origObj), ...Object.keys(modObj)])

      for (const key of allKeys) {
        compareAndExtract(
          origObj[key],
          modObj[key],
          currentPath ? `${currentPath}.${key}` : key
        )
      }
      return
    }

    // Primitive values - if they differ, record the override
    if (orig !== mod) {
      overrides[currentPath] = mod
    }
  }

  compareAndExtract(original, modified, '')
  return overrides
}
