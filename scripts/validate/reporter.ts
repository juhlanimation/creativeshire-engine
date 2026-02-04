/**
 * Validation Reporter
 *
 * Generates markdown reports from validation results.
 */

import type { CategoryReport, ValidationReport, ValidationResult, ValidationStatus } from './types'

const STATUS_EMOJI: Record<ValidationStatus, string> = {
  pass: '✅',
  warning: '⚠️',
  fail: '❌',
}

/**
 * Format a date for display in reports
 */
function formatDate(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/**
 * Format duration in milliseconds to human-readable string
 */
function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`
  }
  return `${(ms / 1000).toFixed(2)}s`
}

/**
 * Generate the summary table section
 */
function generateSummaryTable(report: ValidationReport): string {
  const { summary } = report
  const lines: string[] = []

  lines.push('## Summary')
  lines.push('')
  lines.push('| Metric | Count |')
  lines.push('|--------|-------|')
  lines.push(`| Total Files | ${summary.totalFiles} |`)
  lines.push(`| Total Rules | ${summary.totalRules} |`)
  lines.push(`| ${STATUS_EMOJI.pass} Pass | ${summary.passCount} |`)
  lines.push(`| ${STATUS_EMOJI.warning} Warning | ${summary.warningCount} |`)
  lines.push(`| ${STATUS_EMOJI.fail} Fail | ${summary.failCount} |`)
  lines.push('')

  return lines.join('\n')
}

/**
 * Generate a category section with results table
 */
function generateCategorySection(category: CategoryReport): string {
  const lines: string[] = []

  const statusSummary = [
    category.passCount > 0 ? `${STATUS_EMOJI.pass} ${category.passCount}` : null,
    category.warningCount > 0 ? `${STATUS_EMOJI.warning} ${category.warningCount}` : null,
    category.failCount > 0 ? `${STATUS_EMOJI.fail} ${category.failCount}` : null,
  ]
    .filter(Boolean)
    .join(' | ')

  lines.push(`### ${category.category}`)
  lines.push('')
  lines.push(`**Results:** ${statusSummary || 'No results'}`)
  lines.push('')

  // Only show table if there are non-pass results (warnings or fails)
  const nonPassResults = category.results.filter((r) => r.status !== 'pass')

  if (nonPassResults.length > 0) {
    lines.push('| Status | File | Rule | Message |')
    lines.push('|--------|------|------|---------|')

    for (const result of nonPassResults) {
      const emoji = STATUS_EMOJI[result.status]
      const file = result.file || '-'
      const details = result.details ? ` (${result.details})` : ''
      lines.push(`| ${emoji} | \`${file}\` | ${result.rule} | ${result.message}${details} |`)
    }

    lines.push('')
  } else if (category.passCount > 0) {
    lines.push('All checks passed.')
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Generate the full markdown report
 */
export function generateMarkdownReport(report: ValidationReport): string {
  const lines: string[] = []

  // Header
  lines.push('# Creativeshire Engine Validation Report')
  lines.push('')
  lines.push(`**Generated:** ${formatDate(report.timestamp)}`)
  lines.push(`**Duration:** ${formatDuration(report.duration)}`)
  lines.push('')

  // Overall status banner
  const { summary } = report
  if (summary.failCount > 0) {
    lines.push('> ❌ **Validation FAILED** - There are issues that must be fixed.')
  } else if (summary.warningCount > 0) {
    lines.push('> ⚠️ **Validation PASSED with warnings** - Consider reviewing the warnings.')
  } else {
    lines.push('> ✅ **Validation PASSED** - All checks passed successfully.')
  }
  lines.push('')

  // Summary table
  lines.push(generateSummaryTable(report))

  // Category sections
  lines.push('## Details')
  lines.push('')

  for (const category of report.categories) {
    lines.push(generateCategorySection(category))
  }

  return lines.join('\n')
}

/**
 * Generate console output for validation results
 */
export function generateConsoleOutput(report: ValidationReport, verbose: boolean = false): string {
  const lines: string[] = []
  const { summary } = report

  lines.push('')
  lines.push('='.repeat(60))
  lines.push('  CREATIVESHIRE ENGINE VALIDATION')
  lines.push('='.repeat(60))
  lines.push('')

  // Summary
  lines.push(`  ${STATUS_EMOJI.pass} Pass:    ${summary.passCount}`)
  lines.push(`  ${STATUS_EMOJI.warning} Warning: ${summary.warningCount}`)
  lines.push(`  ${STATUS_EMOJI.fail} Fail:    ${summary.failCount}`)
  lines.push('')

  // Show failures and warnings
  const issues: ValidationResult[] = []
  for (const category of report.categories) {
    for (const result of category.results) {
      if (result.status === 'fail' || (verbose && result.status === 'warning')) {
        issues.push(result)
      }
    }
  }

  if (issues.length > 0) {
    lines.push('-'.repeat(60))
    lines.push(verbose ? '  ISSUES:' : '  FAILURES:')
    lines.push('-'.repeat(60))

    for (const issue of issues) {
      const emoji = STATUS_EMOJI[issue.status]
      lines.push(`  ${emoji} [${issue.rule}] ${issue.file}`)
      lines.push(`     ${issue.message}`)
      if (issue.details) {
        lines.push(`     ${issue.details}`)
      }
      lines.push('')
    }
  }

  lines.push('='.repeat(60))
  lines.push(`  Duration: ${formatDuration(report.duration)}`)
  lines.push('='.repeat(60))
  lines.push('')

  return lines.join('\n')
}
