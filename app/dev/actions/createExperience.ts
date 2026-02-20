/**
 * Server action: scaffold a new experience.
 * Creates {id}/ folder with index.ts + meta.ts and updates registry imports.
 */

'use server'

import { mkdir, writeFile, readFile, access } from 'fs/promises'
import path from 'path'

function titleCase(id: string): string {
  return id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function camelCase(id: string): string {
  return id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

const META_TS = (id: string, name: string) => `/**
 * ${name} experience metadata.
 * Created by the /dev authoring tool.
 */

import { defineExperienceMeta } from '../registry'

export const meta = defineExperienceMeta({
  id: '${id}',
  name: '${name}',
  description: '',
  tags: [],
  category: 'simple',
})
`

const INDEX_TS = (id: string, name: string) => `/**
 * ${name} experience definition.
 * Created by the /dev authoring tool.
 */

import type { Experience } from '../types'

export const ${camelCase(id)}Experience: Experience = {
  id: '${id}',
  name: '${name}',
  description: '',
  category: 'simple',

  sectionBehaviours: {
    '*': [],
  },
}
`

export async function createExperience(
  id: string,
  name?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const expRoot = path.resolve(process.cwd(), 'engine/experience/experiences')
    const expDir = path.join(expRoot, id)

    // Check if directory already exists
    try {
      await access(expDir)
      return { ok: false, error: `Experience "${id}" already exists.` }
    } catch {
      // Does not exist — good
    }

    const displayName = name ?? titleCase(id)
    await mkdir(expDir, { recursive: true })
    await Promise.all([
      writeFile(path.join(expDir, 'meta.ts'), META_TS(id, displayName), 'utf-8'),
      writeFile(path.join(expDir, 'index.ts'), INDEX_TS(id, displayName), 'utf-8'),
    ])

    // Update registry.ts to import and register the new experience
    const registryPath = path.join(expRoot, 'registry.ts')
    const registry = await readFile(registryPath, 'utf-8')
    const varName = `${camelCase(id)}Experience`
    const importLine = `import { ${varName} } from './${id}'`
    const registerLine = `registerExperience(${varName})`

    if (!registry.includes(importLine)) {
      // Add import at end of import block, register before export block
      // Simple approach: append both before the first export
      const lines = registry.split('\n')
      const lastImportIdx = lines.reduce(
        (last, line, i) => (line.startsWith('import ') ? i : last),
        -1,
      )
      // Insert import after last import
      lines.splice(lastImportIdx + 1, 0, importLine)
      // Find the registerExperience calls and add ours after the last one
      const lastRegisterIdx = lines.reduce(
        (last, line, i) => (line.startsWith('registerExperience(') ? i : last),
        -1,
      )
      if (lastRegisterIdx >= 0) {
        lines.splice(lastRegisterIdx + 1, 0, registerLine)
      } else {
        // No existing registerExperience calls — add after imports
        lines.splice(lastImportIdx + 2, 0, '', registerLine)
      }
      await writeFile(registryPath, lines.join('\n'), 'utf-8')
    }

    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}
