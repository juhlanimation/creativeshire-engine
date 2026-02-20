/**
 * Server action: patch experience name in its source files (meta.ts + index.ts).
 * Same regex-based file patching pattern as savePreset.ts patchMetaName.
 */

'use server'

import { readFile, writeFile } from 'fs/promises'
import path from 'path'

/**
 * Patch `name: 'X'` in a file. Matches first occurrence of `name: 'xxx'` or `name: "xxx"`.
 */
async function patchNameInFile(filePath: string, name: string): Promise<boolean> {
  let content: string
  try {
    content = await readFile(filePath, 'utf-8')
  } catch {
    return false
  }

  const updated = content.replace(
    /(name:\s*)(['"])([^'"]*)\2/,
    `$1$2${name.replace(/['"\\]/g, '\\$&')}$2`,
  )

  if (updated !== content) {
    await writeFile(filePath, updated, 'utf-8')
    return true
  }
  return false
}

export async function saveExperienceName(
  experienceId: string,
  name: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const experienceDir = path.resolve(
      process.cwd(),
      'engine/experience/experiences',
      experienceId,
    )

    const metaPath = path.join(experienceDir, 'meta.ts')
    const indexPath = path.join(experienceDir, 'index.ts')

    const [metaPatched, indexPatched] = await Promise.all([
      patchNameInFile(metaPath, name),
      patchNameInFile(indexPath, name),
    ])

    if (!metaPatched && !indexPatched) {
      return { ok: false, error: `Could not find name field in ${experienceId}/meta.ts or index.ts` }
    }

    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}
