/**
 * Server actions: patch intro sequence name and settings in source files.
 * Intro sequences live in engine/intro/sequences/{id}.ts with exported
 * `meta` (IntroMeta) and `config` (IntroConfig) objects.
 */

'use server'

import { readFile, writeFile } from 'fs/promises'
import path from 'path'

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function serializeValue(value: unknown): string {
  if (typeof value === 'string') return `'${value.replace(/'/g, "\\'")}'`
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return JSON.stringify(value)
}

function resolveSequencePath(sequenceId: string): string {
  return path.resolve(
    process.cwd(),
    'engine/intro/sequences',
    `${sequenceId}.ts`,
  )
}

/**
 * Patch the `name` field inside `export const meta: IntroMeta = { ... }`.
 */
export async function saveIntroSequenceName(
  sequenceId: string,
  name: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const filePath = resolveSequencePath(sequenceId)

    let content: string
    try {
      content = await readFile(filePath, 'utf-8')
    } catch {
      return { ok: false, error: `Sequence file not found: ${filePath}` }
    }

    const updated = content.replace(
      /(name:\s*)(['"])([^'"]*)\2/,
      `$1$2${name.replace(/['"\\]/g, '\\$&')}$2`,
    )

    if (updated === content) {
      return { ok: true } // Already the same value
    }

    await writeFile(filePath, updated, 'utf-8')
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

/**
 * Patch a flat `key: value` inside `config.settings` of the sequence file.
 * Settings are flat key-value pairs like `duration: 2000` or `maskType: 'text'`.
 */
export async function saveIntroSequenceSetting(
  sequenceId: string,
  key: string,
  value: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const filePath = resolveSequencePath(sequenceId)

    let content: string
    try {
      content = await readFile(filePath, 'utf-8')
    } catch {
      return { ok: false, error: `Sequence file not found: ${filePath}` }
    }

    // Find the settings block within `config`
    const settingsMatch = content.match(/settings\s*:\s*\{/)
    if (!settingsMatch) {
      return { ok: false, error: `No settings block found in ${sequenceId}.ts` }
    }

    // Match the key inside the settings block (flat key: value)
    const keyPattern = new RegExp(
      `(${escapeRegex(key)}\\s*:\\s*)([^,\\n}]+)`,
    )

    const match = content.match(keyPattern)
    if (!match) {
      return { ok: false, error: `Could not find setting '${key}' in ${sequenceId}.ts` }
    }

    const serialized = serializeValue(value)
    const updated = content.replace(keyPattern, `$1${serialized}`)

    if (updated === content) {
      return { ok: true }
    }

    await writeFile(filePath, updated, 'utf-8')
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}
