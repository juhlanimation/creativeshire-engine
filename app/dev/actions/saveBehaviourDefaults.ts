/**
 * Server action: patch a behaviour's default value in its meta.ts file.
 * Uses regex-based file patching (same pattern as savePreset.ts patchMetaName).
 */

'use server'

import { readFile, writeFile } from 'fs/promises'
import path from 'path'

/** Serialize a JS value to a TypeScript literal string */
function serializeValue(value: unknown): string {
  if (typeof value === 'string') return `'${value.replace(/'/g, "\\'")}'`
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return JSON.stringify(value)
}

export async function saveBehaviourDefault(
  behaviourId: string,
  settingKey: string,
  value: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    // behaviourId like 'visibility/fade-in' → 'visibility/fade-in'
    const metaPath = path.resolve(
      process.cwd(),
      'engine/experience/behaviours',
      behaviourId,
      'meta.ts',
    )

    let content: string
    try {
      content = await readFile(metaPath, 'utf-8')
    } catch {
      return { ok: false, error: `Meta file not found: ${metaPath}` }
    }

    // Match the setting key's default value within the settings block.
    // Pattern: `settingKey: { ... default: <value>`
    // We need to find `settingKey:` then `default:` within its object and replace the value.
    const keyPattern = new RegExp(
      `(${escapeRegex(settingKey)}\\s*:\\s*\\{[^}]*?default\\s*:\\s*)([^,}\\n]+)`,
    )

    const match = content.match(keyPattern)
    if (!match) {
      return { ok: false, error: `Could not find default for '${settingKey}' in ${behaviourId}/meta.ts` }
    }

    const serialized = serializeValue(value)
    const updated = content.replace(keyPattern, `$1${serialized}`)

    if (updated === content) {
      return { ok: true } // Already the same value
    }

    await writeFile(metaPath, updated, 'utf-8')
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
