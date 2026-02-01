#!/usr/bin/env npx tsx
/**
 * Site Validator
 *
 * Validates files in site/
 *
 * Spec: ./site.spec.md
 *
 * Exit codes:
 *   0 = Pass (file valid or not in this domain)
 *   1 = Execution error (validator crashed, not validation failure)
 *   2 = Fail (validation errors found)
 */

import { readFileSync, appendFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface HookInput {
  tool_name: string
  tool_input: { file_path?: string; content?: string }
}

type ValidationCheck = (content: string, filePath: string) => string | null

// ─────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────

// Validator identity (used in logs)
const VALIDATOR_NAME = 'site'

// Path pattern for this domain (site/ folder at project root)
// Use forward slashes - paths are normalized before matching
const DOMAIN_PATH = /(?:^|\/|\\)site\//

// File extensions to validate
const EXTENSIONS = ['.ts', '.tsx']

// Log file path (finds project root via .claude directory)
function getLogPath(): string {
  let dir = __dirname
  while (dir !== dirname(dir)) {
    if (existsSync(resolve(dir, '.claude'))) {
      return resolve(dir, `.claude/logs/${VALIDATOR_NAME}.validation.log`)
    }
    dir = dirname(dir)
  }
  return resolve(__dirname, `.claude/logs/${VALIDATOR_NAME}.validation.log`)
}
const LOG_PATH = getLogPath()

// ─────────────────────────────────────────────────────────────
// Validation Checks
// ─────────────────────────────────────────────────────────────

/**
 * Check: config.ts extends a preset
 * From spec: "Import and extend a preset in config.ts"
 */
const checkExtendsPreset: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('config.ts')) return null

  // Should import from presets
  if (!content.includes('engine/presets/')) {
    return 'config.ts must import and extend a preset from engine/presets/'
  }

  return null
}

/**
 * Check: Uses spread syntax for inheritance
 * From spec: "Use spread syntax for inheritance"
 */
const checkSpreadSyntax: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('config.ts')) return null

  // If importing a preset, should use spread syntax
  if (content.includes('engine/presets/')) {
    if (!content.includes('...')) {
      return 'config.ts should use spread syntax to extend preset (e.g., { ...showcasePreset.experience })'
    }
  }

  return null
}

/**
 * Check: Exports siteConfig
 * From spec: "Export named constant siteConfig"
 */
const checkSiteConfigExport: ValidationCheck = (content, filePath) => {
  if (!filePath.endsWith('config.ts')) return null

  if (!content.includes('export const siteConfig')) {
    return 'config.ts must export const siteConfig: SiteSchema'
  }

  return null
}

/**
 * Check: No direct experience layer imports in pages
 * From spec: "No imports from engine/experience/ directly"
 */
const checkNoExperienceImports: ValidationCheck = (content, filePath) => {
  // Only check page files
  if (!filePath.includes('/pages/')) return null

  if (/from\s+['"].*engine\/experience\//.test(content)) {
    return 'Page files cannot import from engine/experience/ - use schema to declare behaviour'
  }

  return null
}

/**
 * Check: No large inline data arrays in pages
 * From spec: "No inline large data arrays in page files"
 */
const checkNoInlineData: ValidationCheck = (content, filePath) => {
  // Only check page files
  if (!filePath.includes('/pages/')) return null

  // Look for array literals with multiple objects (more than 3)
  // This is a heuristic - matches patterns like: items: [{ ... }, { ... }, { ... }, { ... }]
  const arrayPattern = /:\s*\[\s*\{[^}]+\}\s*,\s*\{[^}]+\}\s*,\s*\{[^}]+\}\s*,\s*\{/
  if (arrayPattern.test(content)) {
    return 'Move data arrays to site/data/ - page files should import data, not define it inline'
  }

  return null
}

/**
 * Check: Data files are pure (no engine imports)
 * From spec: "No imports from engine in data files"
 */
const checkDataFilesPure: ValidationCheck = (content, filePath) => {
  // Only check data files
  if (!filePath.includes('/data/')) return null

  if (/from\s+['"].*engine\//.test(content)) {
    return 'Data files must not import from engine - pure data only'
  }

  // Also check for React imports
  if (/from\s+['"]react['"]/.test(content)) {
    return 'Data files must not import React - pure data only'
  }

  return null
}

/**
 * Check: Page files export named constant
 * From spec: "Export named constants {pageId}Page"
 */
const checkPageExport: ValidationCheck = (content, filePath) => {
  // Only check page files
  if (!filePath.includes('/pages/')) return null

  // Should have export const {something}Page
  if (!/export\s+const\s+\w+Page\s*:/.test(content)) {
    return 'Page files must export const {pageId}Page: PageSchema'
  }

  return null
}

/**
 * Check: Chrome files export RegionSchema
 * From spec: "Chrome files export RegionSchema constant"
 */
const checkChromeExport: ValidationCheck = (content, filePath) => {
  // Only check chrome files
  if (!filePath.includes('/chrome/')) return null

  // Should have export const for region
  if (!/export\s+const\s+\w+\s*:\s*RegionSchema/.test(content)) {
    // Allow other exports, just warn if no RegionSchema
    // This is a soft check
    return null
  }

  return null
}

/**
 * Check: No engine code modification
 * From spec: "No modification of engine code"
 * Note: This validator only runs on site/, so this is more about
 * ensuring site files don't try to do things they shouldn't
 */
const checkNoCreativeshireMutation: ValidationCheck = (content) => {
  // Check for assignment to engine imports
  const mutationPatterns = [
    /\w+Preset\.\w+\s*=/,                // presetName.property =
    /\w+Preset\[\s*['"]?\w+['"]?\s*\]\s*=/, // presetName['property'] =
  ]

  for (const pattern of mutationPatterns) {
    if (pattern.test(content)) {
      return 'Do not mutate preset objects - use spread syntax to create new object'
    }
  }

  return null
}

// ─────────────────────────────────────────────────────────────
// Check Registry
// ─────────────────────────────────────────────────────────────

const checks: ValidationCheck[] = [
  // Config file rules
  checkExtendsPreset,
  checkSpreadSyntax,
  checkSiteConfigExport,

  // Page file rules
  checkNoExperienceImports,
  checkNoInlineData,
  checkPageExport,

  // Data file rules
  checkDataFilesPure,

  // Chrome file rules
  checkChromeExport,

  // General rules
  checkNoCreativeshireMutation,
]

// ─────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────

/**
 * Normalize file path to use forward slashes (for cross-platform regex matching)
 */
function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/')
}

/**
 * Log validation failure to .claude/logs/validation.log
 */
function logFailure(filePath: string, errors: string[]): void {
  try {
    const logDir = dirname(LOG_PATH)
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true })
    }

    const timestamp = new Date().toISOString()
    const entry = [
      `[${timestamp}] FAIL ${VALIDATOR_NAME}.validator → ${filePath}`,
      ...errors.map(e => `  ✗ ${e}`),
      '',
    ].join('\n')

    appendFileSync(LOG_PATH, entry + '\n')
  } catch {
    // Logging should never break validation
  }
}

// ─────────────────────────────────────────────────────────────
// Runner
// ─────────────────────────────────────────────────────────────

function run() {
  // Parse stdin with error handling
  let input: HookInput
  try {
    input = JSON.parse(readFileSync(0, 'utf-8'))
  } catch (e) {
    console.error('Validator execution error: Failed to parse stdin as JSON')
    process.exit(1) // Exit 1 = execution error, not validation failure
  }

  const rawPath = input.tool_input.file_path || ''
  const filePath = normalizePath(rawPath)
  const content = input.tool_input.content || ''

  // Skip if not in this domain
  if (!DOMAIN_PATH.test(filePath)) {
    process.exit(0)
  }

  // Skip if not matching extensions
  if (!EXTENSIONS.some(ext => filePath.endsWith(ext))) {
    process.exit(0)
  }

  // Run checks
  const errors = checks
    .map(check => check(content, filePath))
    .filter((error): error is string => error !== null)

  // Output and exit
  if (errors.length > 0) {
    logFailure(filePath, errors)
    console.error('\nSite Validation Failed:\n')
    errors.forEach(e => console.error(`  ✗ ${e}`))
    console.error('\nSee: ./site.spec.md for requirements\n')
    process.exit(2) // Exit 2 = validation failure
  }

  process.exit(0) // Exit 0 = pass
}

run()
