/**
 * Server action: save a content contract to disk as content-contract.ts.
 * Writes the ContentContract as a TypeScript data literal, following
 * the same pattern as savePreset.ts.
 */

'use server'

import { writeFile, readFile } from 'fs/promises'
import path from 'path'
import type { ContentContract } from '../../../engine/presets/types'

/** Serialize a ContentContract to a TypeScript source string */
function serializeContract(contract: ContentContract, presetId: string): string {
  const json = JSON.stringify(contract, null, 2)

  // Replace JSON keys with unquoted TS keys where safe (valid identifiers)
  const tsLiteral = json.replace(/"([a-zA-Z_$][a-zA-Z0-9_$]*)"\s*:/g, '$1:')

  // Generate a camelCase export name from the preset ID
  const exportName = presetId
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    + 'ContentContract'

  return `/**
 * Auto-generated content contract.
 * Saved by the /dev authoring tool.
 */

import type { ContentContract } from '../types'

export const ${exportName}: ContentContract = ${tsLiteral}
`
}

/** Update index.ts to import/export the contract if not already */
async function ensureIndexImportsContract(presetDir: string, presetId: string): Promise<void> {
  const indexPath = path.join(presetDir, 'index.ts')
  let content: string
  try {
    content = await readFile(indexPath, 'utf-8')
  } catch {
    return
  }

  // Check if it already imports from ./content-contract
  if (
    content.includes("from './content-contract'") ||
    content.includes('from "./content-contract"')
  ) {
    return
  }

  // Generate export name
  const exportName = presetId
    .replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    + 'ContentContract'

  const importLine = `export { ${exportName} } from './content-contract'\n`
  const lastImportIdx = content.lastIndexOf('\nimport ')
  const lastExportIdx = content.lastIndexOf('\nexport ')
  const insertAfter = Math.max(lastImportIdx, lastExportIdx)

  if (insertAfter >= 0) {
    const lineEnd = content.indexOf('\n', insertAfter + 1)
    content = content.slice(0, lineEnd + 1) + importLine + content.slice(lineEnd + 1)
  } else {
    content = importLine + content
  }

  await writeFile(indexPath, content, 'utf-8')
}

export async function saveContract(
  presetId: string,
  contract: ContentContract,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const presetsRoot = path.resolve(process.cwd(), 'engine/presets')
    const presetDir = path.join(presetsRoot, presetId)
    const contractPath = path.join(presetDir, 'content-contract.ts')

    const source = serializeContract(contract, presetId)
    await writeFile(contractPath, source, 'utf-8')
    await ensureIndexImportsContract(presetDir, presetId)

    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}
