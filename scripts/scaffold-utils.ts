/**
 * Shared utilities for scaffolding scripts.
 *
 * Provides naming conventions, file guards, string insertion helpers,
 * and logging used by all create:* scripts.
 */

import fs from 'fs'

// =============================================================================
// Naming Conventions
// =============================================================================

/** PascalCase → kebab-case: "ProjectHero" → "project-hero" */
export function toKebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/** PascalCase → "Display Name": "ProjectHero" → "Project Hero" */
export function toDisplay(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
}

/** PascalCase → camelCase: "ProjectHero" → "projectHero" */
export function toCamel(name: string): string {
  return name.charAt(0).toLowerCase() + name.slice(1)
}

/** kebab-case → camelCase: "cover-scroll" → "coverScroll" */
export function toCamelFromKebab(id: string): string {
  return id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

/** kebab-case → PascalCase: "cover-scroll" → "CoverScroll" */
export function toPascalFromKebab(id: string): string {
  const camel = toCamelFromKebab(id)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

/** kebab-case → "Display Name": "cover-scroll" → "Cover Scroll" */
export function toDisplayFromKebab(id: string): string {
  return id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// =============================================================================
// File Guards
// =============================================================================

/** Exit with error if file or directory already exists. */
export function ensureNotExists(filepath: string, label: string): void {
  if (fs.existsSync(filepath)) {
    console.error(`Error: ${label} already exists at ${filepath}`)
    process.exit(1)
  }
}

// =============================================================================
// String Insertion Helpers
// =============================================================================

/** Find the last line matching `pattern`, insert `newLine` after it. Returns modified content. */
export function insertAfterLastMatch(content: string, pattern: string, newLine: string): string {
  const lastIdx = content.lastIndexOf(pattern)
  if (lastIdx === -1) return content
  const lineEnd = content.indexOf('\n', lastIdx)
  return content.slice(0, lineEnd + 1) + newLine + '\n' + content.slice(lineEnd + 1)
}

/** Insert `newLine` before the first occurrence of `pattern`. Returns modified content. */
export function insertBeforeMatch(content: string, pattern: string, newLine: string): string {
  const idx = content.indexOf(pattern)
  if (idx === -1) return content
  return content.slice(0, idx) + newLine + '\n' + content.slice(idx)
}

// =============================================================================
// Logging
// =============================================================================

export function logCreated(what: string, filepath: string): void {
  console.log(`Created ${what}: ${filepath}`)
}

export function logRegistered(where: string): void {
  console.log(`Registered in: ${where}`)
}

export function logNextSteps(steps: string[]): void {
  console.log('\nNext steps:')
  steps.forEach((step, i) => console.log(`  ${i + 1}. ${step}`))
}
