/**
 * Server action: scaffold a new preset directory.
 * Creates index.ts, preset.ts, and content-contract.ts.
 */

'use server'

import { mkdir, writeFile, access } from 'fs/promises'
import path from 'path'

/** Minimal empty SitePreset */
const EMPTY_PRESET_TS = (name: string) => `/**
 * Auto-generated preset file.
 * Saved by the /dev authoring tool.
 */

import type { SitePreset } from '../types'

export const preset: SitePreset = {
  chrome: {
    regions: {
      header: "hidden",
      footer: "hidden",
    },
  },
  pages: {
    home: {
      id: "home",
      slug: "/",
      sections: [],
    },
  },
}
`

const INDEX_TS = (id: string, name: string) => `/**
 * ${name} Preset
 * Created by the /dev authoring tool.
 */

import type { SitePreset } from '../types'
import { registerPreset, type PresetMeta } from '../registry'
import { preset } from './preset'

export const ${camelCase(id)}Meta: PresetMeta = {
  id: '${id}',
  name: '${name}',
  description: 'Created via authoring tool.',
}

export { preset as ${camelCase(id)}Preset }

// Auto-register on module load
registerPreset(${camelCase(id)}Meta, preset)
`

const CONTRACT_TS = `/**
 * Content contract — placeholder.
 */

import type { ContentContract } from '../types'

export const contentContract: ContentContract = {
  sourceFields: [],
  sections: [],
}
`

function camelCase(id: string): string {
  return id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

export async function createPreset(
  id: string,
  name: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const presetsRoot = path.resolve(process.cwd(), 'engine/presets')
    const presetDir = path.join(presetsRoot, id)

    // Check if it already exists
    try {
      await access(presetDir)
      return { ok: false, error: `Preset directory "${id}" already exists.` }
    } catch {
      // Does not exist — good
    }

    await mkdir(presetDir, { recursive: true })
    await Promise.all([
      writeFile(path.join(presetDir, 'preset.ts'), EMPTY_PRESET_TS(name), 'utf-8'),
      writeFile(path.join(presetDir, 'index.ts'), INDEX_TS(id, name), 'utf-8'),
      writeFile(path.join(presetDir, 'content-contract.ts'), CONTRACT_TS, 'utf-8'),
    ])

    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}
