/**
 * File Scanner Utilities
 *
 * File system utilities for the validation system.
 * Patterns adapted from __tests__/architecture/helpers.ts
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
    ignore: ['**/node_modules/**', '**/*.test.ts', '**/*.test.tsx'],
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
 * Get relative path from engine folder
 */
export function relativePath(filePath: string): string {
  return path.relative(ENGINE, filePath).replace(/\\/g, '/')
}

/**
 * Get the engine root directory path
 */
export function getEnginePath(): string {
  return ENGINE
}

/**
 * Get the project root directory path
 */
export function getRootPath(): string {
  return ROOT
}

/**
 * Layer detection from file path
 */
export function getLayer(
  filePath: string
): 'content' | 'experience' | 'renderer' | 'schema' | 'presets' | 'interface' | 'unknown' {
  const rel = relativePath(filePath)
  if (rel.startsWith('content/')) return 'content'
  if (rel.startsWith('experience/')) return 'experience'
  if (rel.startsWith('renderer/')) return 'renderer'
  if (rel.startsWith('schema/')) return 'schema'
  if (rel.startsWith('presets/')) return 'presets'
  if (rel.startsWith('interface/')) return 'interface'
  return 'unknown'
}
