#!/usr/bin/env npx tsx
/**
 * Engine File Size Report
 *
 * Walks all .ts, .tsx, .css files under engine/ and produces
 * a sorted markdown table with line counts and summary stats.
 *
 * Usage:
 *   npx tsx scripts/engine-file-sizes.ts
 */

import fs from 'fs/promises'
import path from 'path'
import fg from 'fast-glob'

const ROOT = process.cwd()
const ENGINE = path.join(ROOT, 'engine')
const OUTPUT = path.join(ROOT, 'scripts', 'reports', 'file-sizes.md')

const LARGE_THRESHOLD = 400
const VERY_LARGE_THRESHOLD = 600

interface FileInfo {
  path: string
  lines: number
  ext: string
  flag: '' | 'Large' | 'Very large'
}

async function countLines(filePath: string): Promise<number> {
  const content = await fs.readFile(filePath, 'utf-8')
  return content.split('\n').length
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2)
}

function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.ceil((p / 100) * sorted.length) - 1
  return sorted[Math.max(0, index)]
}

async function main() {
  console.log('📏 Generating File Size Report...\n')

  const files = await fg('**/*.{ts,tsx,css}', {
    cwd: ENGINE,
    absolute: true,
    onlyFiles: true,
    ignore: ['**/node_modules/**'],
  })

  const fileInfos: FileInfo[] = []

  for (const filePath of files) {
    const lines = await countLines(filePath)
    const relPath = path.relative(ENGINE, filePath).replace(/\\/g, '/')
    const ext = path.extname(filePath)

    let flag: FileInfo['flag'] = ''
    if (lines >= VERY_LARGE_THRESHOLD) flag = 'Very large'
    else if (lines >= LARGE_THRESHOLD) flag = 'Large'

    fileInfos.push({ path: relPath, lines, ext, flag })
  }

  // Sort by lines descending
  fileInfos.sort((a, b) => b.lines - a.lines)

  const allLines = fileInfos.map(f => f.lines)
  const totalFiles = fileInfos.length
  const totalLines = allLines.reduce((s, n) => s + n, 0)
  const avgLines = Math.round(totalLines / totalFiles)
  const medianLines = median(allLines)
  const p95Lines = percentile(allLines, 95)
  const maxLines = allLines[0]
  const largeCount = fileInfos.filter(f => f.flag === 'Large').length
  const veryLargeCount = fileInfos.filter(f => f.flag === 'Very large').length

  // Count by extension
  const byExt = new Map<string, { count: number; lines: number }>()
  for (const f of fileInfos) {
    const entry = byExt.get(f.ext) || { count: 0, lines: 0 }
    entry.count++
    entry.lines += f.lines
    byExt.set(f.ext, entry)
  }

  const md: string[] = [
    '# Engine File Size Report',
    '',
    `**Generated:** ${new Date().toISOString().split('T')[0]}`,
    '',
    '## Summary',
    '',
    '| Metric | Value |',
    '|--------|------:|',
    `| Total files | ${totalFiles} |`,
    `| Total lines | ${totalLines.toLocaleString()} |`,
    `| Average | ${avgLines} |`,
    `| Median | ${medianLines} |`,
    `| P95 | ${p95Lines} |`,
    `| Max | ${maxLines} |`,
    `| Large (${LARGE_THRESHOLD}+) | ${largeCount} |`,
    `| Very large (${VERY_LARGE_THRESHOLD}+) | ${veryLargeCount} |`,
    '',
    '## By Extension',
    '',
    '| Extension | Files | Lines |',
    '|-----------|------:|------:|',
    ...[...byExt.entries()]
      .sort((a, b) => b[1].lines - a[1].lines)
      .map(([ext, { count, lines }]) =>
        `| ${ext} | ${count} | ${lines.toLocaleString()} |`
      ),
    '',
  ]

  // Flagged files section
  const flagged = fileInfos.filter(f => f.flag)
  if (flagged.length > 0) {
    md.push('## Flagged Files')
    md.push('')
    md.push(`| File | Lines | Flag |`)
    md.push('|------|------:|------|')
    for (const f of flagged) {
      md.push(`| \`${f.path}\` | ${f.lines} | ${f.flag} |`)
    }
    md.push('')
  }

  // Full table
  md.push('## All Files (sorted by size)')
  md.push('')
  md.push('| File | Lines | Flag |')
  md.push('|------|------:|------|')
  for (const f of fileInfos) {
    md.push(`| \`${f.path}\` | ${f.lines} | ${f.flag} |`)
  }
  md.push('')

  await fs.mkdir(path.dirname(OUTPUT), { recursive: true })
  await fs.writeFile(OUTPUT, md.join('\n'), 'utf-8')

  console.log(`✅ Report written to: ${OUTPUT}`)
  console.log(`📊 ${totalFiles} files, ${totalLines.toLocaleString()} total lines`)
  console.log(`   Average: ${avgLines} | Median: ${medianLines} | P95: ${p95Lines} | Max: ${maxLines}`)
  if (flagged.length > 0) {
    console.log(`⚠️  ${veryLargeCount} very large (${VERY_LARGE_THRESHOLD}+), ${largeCount} large (${LARGE_THRESHOLD}+)`)
  }
}

main().catch(console.error)
