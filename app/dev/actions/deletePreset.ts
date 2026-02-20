/**
 * Server action: delete a preset directory.
 */

'use server'

import { rm, access } from 'fs/promises'
import path from 'path'

export async function deletePreset(
  presetId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const presetsRoot = path.resolve(process.cwd(), 'engine/presets')
    const presetDir = path.join(presetsRoot, presetId)

    // Safety: ensure it's inside presets/ directory
    if (!presetDir.startsWith(presetsRoot)) {
      return { ok: false, error: 'Invalid preset path.' }
    }

    // Check existence
    try {
      await access(presetDir)
    } catch {
      return { ok: false, error: `Preset "${presetId}" not found.` }
    }

    await rm(presetDir, { recursive: true, force: true })
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}
