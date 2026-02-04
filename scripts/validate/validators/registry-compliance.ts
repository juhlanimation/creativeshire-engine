/**
 * Registry Compliance Validator
 *
 * Validates that all components are properly registered in their respective registries.
 *
 * Rules:
 * - folder-registered: Every widget folder should be in widgetRegistry
 * - no-orphan-entries: Every registry entry should have a corresponding folder
 * - pattern-not-registered: Pattern folders should NOT be in widgetRegistry
 * - chrome-registered: Chrome components should be in chromeRegistry
 */

import type { ValidationResult, Validator } from '../types'
import {
  fileExists,
  getComponentName,
  getEnginePath,
  getFolders,
  readFile,
  relativePath,
} from '../utils/file-scanner'
import path from 'path'

// Widget categories that should be registered
const WIDGET_CATEGORIES = ['primitives', 'layout', 'interactive'] as const
type WidgetCategory = (typeof WIDGET_CATEGORIES)[number]

// Chrome categories
const CHROME_CATEGORIES = ['regions', 'overlays'] as const

/**
 * Parse registry file to extract registered component names
 * Uses regex to extract keys from the registry object without importing
 */
async function parseRegistryFile(registryPath: string): Promise<Set<string>> {
  const registered = new Set<string>()

  try {
    const content = await readFile(registryPath)

    // Match the registry object definition
    // Pattern: export const widgetRegistry: Record<...> = { ... }
    // or: export const chromeRegistry: Record<...> = { ... }
    const registryMatch = content.match(
      /(?:widgetRegistry|chromeRegistry)[^{]*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/s
    )

    if (registryMatch) {
      const registryContent = registryMatch[1]

      // Extract component names from the registry object
      // Handles both shorthand (ComponentName,) and explicit (ComponentName: ComponentName,)
      // Also handles comments

      // Remove comments first
      const withoutComments = registryContent
        .replace(/\/\/.*$/gm, '') // Single line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // Multi-line comments

      // Match property names - handles:
      // ComponentName,
      // ComponentName: ComponentName,
      // 'ComponentName': ComponentName,
      const propertyPattern = /['"]?(\w+)['"]?\s*(?:,|:)/g
      let match

      while ((match = propertyPattern.exec(withoutComments)) !== null) {
        const name = match[1]
        // Skip if it's a common keyword or looks like a type annotation
        if (!['Record', 'string', 'const', 'export'].includes(name)) {
          registered.add(name)
        }
      }
    }
  } catch (error) {
    console.warn(`Failed to parse registry file ${registryPath}:`, error)
  }

  return registered
}

/**
 * Load widget registry by parsing the registry file
 */
async function loadWidgetRegistry(): Promise<Set<string>> {
  const enginePath = getEnginePath()
  const registryPath = path.join(enginePath, 'content', 'widgets', 'registry.ts')
  return parseRegistryFile(registryPath)
}

/**
 * Load chrome registry by parsing the registry file
 */
async function loadChromeRegistry(): Promise<Set<string>> {
  const enginePath = getEnginePath()
  const registryPath = path.join(enginePath, 'content', 'chrome', 'registry.ts')
  return parseRegistryFile(registryPath)
}

/**
 * Get all widget folders for a given category
 */
async function getWidgetFolders(category: WidgetCategory): Promise<string[]> {
  return getFolders(`content/widgets/${category}/*`)
}

/**
 * Get all pattern folders
 */
async function getPatternFolders(): Promise<string[]> {
  return getFolders('content/widgets/patterns/*')
}

/**
 * Get all chrome component folders
 */
async function getChromeFolders(): Promise<string[]> {
  const folders: string[] = []

  for (const category of CHROME_CATEGORIES) {
    const categoryFolders = await getFolders(`content/chrome/${category}/*`)
    folders.push(...categoryFolders)
  }

  return folders
}

/**
 * Get expected folder path for a registry entry
 */
function getExpectedFolderPath(name: string, category: WidgetCategory): string {
  const ROOT = process.cwd()
  return path.join(ROOT, 'engine', 'content', 'widgets', category, name)
}

/**
 * Get expected chrome folder path for a registry entry
 */
function getExpectedChromeFolderPath(
  name: string,
  category: 'regions' | 'overlays'
): string {
  const ROOT = process.cwd()
  return path.join(ROOT, 'engine', 'content', 'chrome', category, name)
}

export const registryComplianceValidator: Validator = {
  name: 'Registry Compliance',
  description: 'Validates all components are properly registered',

  async validate(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = []

    // Load registries (returns Sets of component names)
    const registeredWidgetNames = await loadWidgetRegistry()
    const registeredChromeNames = await loadChromeRegistry()

    // Track all folders we find
    const foundWidgetFolders = new Map<string, string>() // name -> path
    const foundChromeFolders = new Map<string, string>()

    // Rule 1: folder-registered
    // Check that each widget folder (primitives, layout, interactive) is registered
    for (const category of WIDGET_CATEGORIES) {
      const folders = await getWidgetFolders(category)

      for (const folder of folders) {
        const name = getComponentName(folder)
        const relPath = relativePath(folder)
        foundWidgetFolders.set(name, folder)

        if (!registeredWidgetNames.has(name)) {
          results.push({
            file: relPath,
            rule: 'folder-registered',
            status: 'fail',
            message: `${category} widget "${name}" not registered in widgetRegistry`,
            details: `Add to engine/content/widgets/registry.ts`,
          })
        }
      }
    }

    // Rule 2: no-orphan-entries
    // Check that each widget registry entry has a corresponding folder
    for (const registeredName of registeredWidgetNames) {
      // Skip if we found the folder already
      if (foundWidgetFolders.has(registeredName)) continue

      // Check if it might be a chrome overlay registered in widget registry (allowed)
      // SlideIndicators is an example - it's in chrome/overlays but also in widgetRegistry
      const overlayPath = getExpectedChromeFolderPath(registeredName, 'overlays')
      const overlayExists = await fileExists(overlayPath)

      if (overlayExists) {
        // This is acceptable - chrome overlays can be in widget registry for use in sections
        continue
      }

      // Check each category for a matching folder
      let found = false
      for (const category of WIDGET_CATEGORIES) {
        const expectedPath = getExpectedFolderPath(registeredName, category)
        const exists = await fileExists(expectedPath)

        if (exists) {
          found = true
          break
        }
      }

      if (!found) {
        results.push({
          file: 'content/widgets/registry.ts',
          rule: 'no-orphan-entries',
          status: 'fail',
          message: `Registry entry "${registeredName}" has no corresponding folder`,
          details: 'Remove from registry or create the component folder',
        })
      }
    }

    // Rule 3: pattern-not-registered
    // Check that pattern folders are NOT in the widget registry
    const patternFolders = await getPatternFolders()

    for (const folder of patternFolders) {
      const name = getComponentName(folder)
      const relPath = relativePath(folder)

      if (registeredWidgetNames.has(name)) {
        results.push({
          file: relPath,
          rule: 'pattern-not-registered',
          status: 'fail',
          message: `Pattern "${name}" should NOT be in widgetRegistry`,
          details: 'Patterns return WidgetSchema, not React components',
        })
      }
    }

    // Rule 4: chrome-registered
    // Check that chrome components are registered
    const chromeFolders = await getChromeFolders()

    for (const folder of chromeFolders) {
      const name = getComponentName(folder)
      const relPath = relativePath(folder)
      foundChromeFolders.set(name, folder)

      // Chrome overlays can optionally be in widgetRegistry (for use in sections)
      // but they MUST be in chromeRegistry
      if (!registeredChromeNames.has(name)) {
        // Special case: Modal folder might export ModalRoot as the component
        if (name === 'Modal') {
          if (!registeredChromeNames.has('ModalRoot')) {
            results.push({
              file: relPath,
              rule: 'chrome-registered',
              status: 'fail',
              message: `Chrome component "${name}" not registered in chromeRegistry`,
              details: 'Add to engine/content/chrome/registry.ts',
            })
          }
        } else {
          results.push({
            file: relPath,
            rule: 'chrome-registered',
            status: 'fail',
            message: `Chrome component "${name}" not registered in chromeRegistry`,
            details: 'Add to engine/content/chrome/registry.ts',
          })
        }
      }
    }

    // Check for orphan chrome entries
    for (const registeredName of registeredChromeNames) {
      // Skip ModalRoot - it comes from Modal folder
      if (registeredName === 'ModalRoot') continue

      if (!foundChromeFolders.has(registeredName)) {
        // Check if folder actually exists
        let found = false

        for (const category of CHROME_CATEGORIES) {
          const expectedPath = getExpectedChromeFolderPath(
            registeredName,
            category as 'regions' | 'overlays'
          )
          const exists = await fileExists(expectedPath)

          if (exists) {
            found = true
            break
          }
        }

        if (!found) {
          results.push({
            file: 'content/chrome/registry.ts',
            rule: 'no-orphan-entries',
            status: 'fail',
            message: `Chrome registry entry "${registeredName}" has no corresponding folder`,
            details: 'Remove from registry or create the component folder',
          })
        }
      }
    }

    // Add pass result if no issues found
    if (results.length === 0) {
      results.push({
        file: '',
        rule: 'registry-compliance',
        status: 'pass',
        message: 'All registry compliance checks passed',
      })
    }

    return results
  },
}
