/**
 * Server action: scaffold a new intro sequence file.
 * Creates {id}.ts in engine/intro/sequences/ and updates the barrel import.
 */

'use server'

import { writeFile, readFile, access } from 'fs/promises'
import path from 'path'

function titleCase(id: string): string {
  return id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const SEQUENCE_TS = (id: string, name: string) => `/**
 * ${name} — auto-generated intro sequence.
 * Created by the /dev authoring tool.
 */

import type { IntroConfig, IntroMeta } from '../types'
import { registerIntroSequence } from '../registry'

export const meta: IntroMeta = {
  id: '${id}',
  name: '${name}',
  description: '',
  category: 'sequence',
}

export const config: IntroConfig = {
  pattern: 'sequence-timed',
  settings: {
    steps: [],
  },
}

registerIntroSequence(meta, config)
`

export async function createIntroSequence(
  id: string,
  name?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const seqRoot = path.resolve(process.cwd(), 'engine/intro/sequences')
    const filePath = path.join(seqRoot, `${id}.ts`)

    // Check if file already exists
    try {
      await access(filePath)
      return { ok: false, error: `Intro sequence "${id}" already exists.` }
    } catch {
      // Does not exist — good
    }

    const displayName = name ?? titleCase(id)
    await writeFile(filePath, SEQUENCE_TS(id, displayName), 'utf-8')

    // Update barrel import
    const barrelPath = path.join(seqRoot, 'index.ts')
    const barrel = await readFile(barrelPath, 'utf-8')
    const importLine = `import './${id}'`
    if (!barrel.includes(importLine)) {
      await writeFile(barrelPath, barrel.trimEnd() + `\n${importLine}\n`, 'utf-8')
    }

    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}
