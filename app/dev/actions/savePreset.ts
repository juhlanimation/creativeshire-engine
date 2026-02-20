/**
 * Server action: save a preset to disk as preset.ts.
 * Writes the full SitePreset as a TypeScript data literal.
 */

'use server'

import { writeFile, readFile } from 'fs/promises'
import path from 'path'
import type { SitePreset } from '../../../engine/presets/types'

/** Serialize a SitePreset to a TypeScript source string */
function serializePreset(preset: SitePreset): string {
  // JSON.stringify with indent, then convert to TS literal
  const json = JSON.stringify(preset, null, 2)

  // Replace JSON keys with unquoted TS keys where safe (valid identifiers)
  const tsLiteral = json.replace(/"([a-zA-Z_$][a-zA-Z0-9_$]*)"\s*:/g, '$1:')

  return `/**
 * Auto-generated preset file.
 * Saved by the /dev authoring tool.
 */

import type { SitePreset } from '../types'

export const preset: SitePreset = ${tsLiteral}
`
}

/** Update the meta `name:` field in index.ts if the preset has a name */
async function patchMetaName(presetDir: string, name: string | undefined): Promise<void> {
  if (!name) return
  const indexPath = path.join(presetDir, 'index.ts')
  let content: string
  try {
    content = await readFile(indexPath, 'utf-8')
  } catch {
    return
  }

  // Match `name: 'xxx'` or `name: "xxx"` inside the meta object
  const updated = content.replace(
    /(name:\s*)(['"])([^'"]*)\2/,
    `$1$2${name.replace(/['"\\]/g, '\\$&')}$2`,
  )
  if (updated !== content) {
    await writeFile(indexPath, updated, 'utf-8')
  }
}

/** Update index.ts to import from ./preset if not already */
async function ensureIndexImportsPreset(presetDir: string): Promise<void> {
  const indexPath = path.join(presetDir, 'index.ts')
  let content: string
  try {
    content = await readFile(indexPath, 'utf-8')
  } catch {
    return // No index.ts — nothing to patch
  }

  // Check if it already imports from ./preset
  if (content.includes("from './preset'") || content.includes('from "./preset"')) {
    return
  }

  // Add import and re-export at top of file, after existing imports
  const importLine = "export { preset } from './preset'\n"
  const lastImportIdx = content.lastIndexOf('\nimport ')
  if (lastImportIdx >= 0) {
    const lineEnd = content.indexOf('\n', lastImportIdx + 1)
    content = content.slice(0, lineEnd + 1) + importLine + content.slice(lineEnd + 1)
  } else {
    content = importLine + content
  }

  await writeFile(indexPath, content, 'utf-8')
}

export async function savePreset(
  presetId: string,
  presetData: SitePreset,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const presetsRoot = path.resolve(process.cwd(), 'engine/presets')
    const presetDir = path.join(presetsRoot, presetId)
    const presetPath = path.join(presetDir, 'preset.ts')

    const source = serializePreset(presetData)
    await writeFile(presetPath, source, 'utf-8')
    await ensureIndexImportsPreset(presetDir)
    await patchMetaName(presetDir, presetData.name)

    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}
