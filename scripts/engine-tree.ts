#!/usr/bin/env npx tsx
/**
 * Engine Tree Report
 *
 * Generates a markdown tree view of the full engine/ directory structure.
 *
 * Usage:
 *   npx tsx scripts/engine-tree.ts
 */

import fs from 'fs/promises'
import path from 'path'

const ROOT = process.cwd()
const ENGINE = path.join(ROOT, 'engine')
const OUTPUT = path.join(ROOT, 'scripts', 'reports', 'tree.md')

interface TreeEntry {
  name: string
  isDir: boolean
  children?: TreeEntry[]
}

const IGNORED = new Set([
  'node_modules',
  '.git',
  '.next',
  '.turbo',
])

async function buildTree(dirPath: string): Promise<TreeEntry[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  const sorted = entries
    .filter(e => !IGNORED.has(e.name))
    .sort((a, b) => {
      // Directories first, then files
      if (a.isDirectory() && !b.isDirectory()) return -1
      if (!a.isDirectory() && b.isDirectory()) return 1
      return a.name.localeCompare(b.name)
    })

  const result: TreeEntry[] = []
  for (const entry of sorted) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      const children = await buildTree(fullPath)
      result.push({ name: entry.name, isDir: true, children })
    } else {
      result.push({ name: entry.name, isDir: false })
    }
  }
  return result
}

function renderTree(entries: TreeEntry[], prefix = ''): string[] {
  const lines: string[] = []
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    const isLast = i === entries.length - 1
    const connector = isLast ? '└── ' : '├── '
    const childPrefix = isLast ? '    ' : '│   '

    if (entry.isDir) {
      lines.push(`${prefix}${connector}${entry.name}/`)
      if (entry.children && entry.children.length > 0) {
        lines.push(...renderTree(entry.children, prefix + childPrefix))
      }
    } else {
      lines.push(`${prefix}${connector}${entry.name}`)
    }
  }
  return lines
}

function countEntries(entries: TreeEntry[]): { files: number; dirs: number } {
  let files = 0
  let dirs = 0
  for (const entry of entries) {
    if (entry.isDir) {
      dirs++
      if (entry.children) {
        const sub = countEntries(entry.children)
        files += sub.files
        dirs += sub.dirs
      }
    } else {
      files++
    }
  }
  return { files, dirs }
}

async function main() {
  console.log('🌳 Generating Engine Tree...\n')

  const tree = await buildTree(ENGINE)
  const treeLines = renderTree(tree)
  const { files, dirs } = countEntries(tree)

  const lines: string[] = [
    '# Engine Directory Tree',
    '',
    `**Generated:** ${new Date().toISOString().split('T')[0]}`,
    `**Files:** ${files} | **Directories:** ${dirs}`,
    '',
    '```',
    'engine/',
    ...treeLines,
    '```',
    '',
  ]

  await fs.mkdir(path.dirname(OUTPUT), { recursive: true })
  await fs.writeFile(OUTPUT, lines.join('\n'), 'utf-8')

  console.log(`✅ Tree written to: ${OUTPUT}`)
  console.log(`📊 ${files} files across ${dirs} directories`)
}

main().catch(console.error)
