/**
 * Validation Orchestrator
 *
 * Runs all validators and generates reports.
 */

import fs from 'fs/promises'
import path from 'path'

import { generateConsoleOutput, generateMarkdownReport } from './reporter'
import type { CategoryReport, ValidationReport, ValidationResult, Validator } from './types'
import { validators } from './validators'

export interface ValidateOptions {
  verbose?: boolean
  writeReport?: boolean
  reportPath?: string
}

/**
 * Group validation results by category (derived from validator name)
 */
function groupByCategory(
  validatorResults: Map<string, ValidationResult[]>
): CategoryReport[] {
  const categories: CategoryReport[] = []

  for (const [validatorName, results] of validatorResults) {
    const passCount = results.filter((r) => r.status === 'pass').length
    const warningCount = results.filter((r) => r.status === 'warning').length
    const failCount = results.filter((r) => r.status === 'fail').length

    categories.push({
      category: validatorName,
      results,
      passCount,
      warningCount,
      failCount,
    })
  }

  return categories
}

/**
 * Calculate summary statistics from category reports
 */
function calculateSummary(categories: CategoryReport[]): ValidationReport['summary'] {
  const allResults = categories.flatMap((c) => c.results)
  const uniqueFiles = new Set(allResults.map((r) => r.file).filter(Boolean))
  const uniqueRules = new Set(allResults.map((r) => r.rule))

  return {
    totalFiles: uniqueFiles.size,
    totalRules: uniqueRules.size,
    passCount: categories.reduce((sum, c) => sum + c.passCount, 0),
    warningCount: categories.reduce((sum, c) => sum + c.warningCount, 0),
    failCount: categories.reduce((sum, c) => sum + c.failCount, 0),
  }
}

/**
 * Run all validators and generate a validation report
 */
export async function runValidation(
  options: ValidateOptions = {}
): Promise<ValidationReport> {
  const { verbose = false, writeReport = false, reportPath } = options

  const startTime = Date.now()
  const validatorResults = new Map<string, ValidationResult[]>()

  // Run all validators
  for (const validator of validators) {
    if (verbose) {
      console.log(`Running validator: ${validator.name}...`)
    }

    try {
      const results = await validator.validate()
      validatorResults.set(validator.name, results)
    } catch (error) {
      // If a validator fails, record it as an error result
      validatorResults.set(validator.name, [
        {
          file: '',
          rule: 'validator-error',
          status: 'fail',
          message: `Validator "${validator.name}" threw an error`,
          details: error instanceof Error ? error.message : String(error),
        },
      ])
    }
  }

  const duration = Date.now() - startTime
  const categories = groupByCategory(validatorResults)
  const summary = calculateSummary(categories)

  const report: ValidationReport = {
    timestamp: new Date().toISOString(),
    duration,
    categories,
    summary,
  }

  // Output to console
  console.log(generateConsoleOutput(report, verbose))

  // Write markdown report if requested
  if (writeReport) {
    const markdown = generateMarkdownReport(report)
    const outputPath =
      reportPath ||
      path.join(
        process.cwd(),
        'scripts',
        'reports',
        `validation-${new Date().toISOString().slice(0, 10)}.md`
      )

    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    await fs.writeFile(outputPath, markdown, 'utf-8')

    if (verbose) {
      console.log(`Report written to: ${outputPath}`)
    }
  }

  return report
}

/**
 * CLI entry point
 */
async function main() {
  const args = process.argv.slice(2)
  const verbose = args.includes('--verbose') || args.includes('-v')
  const writeReport = args.includes('--report') || args.includes('-r')

  const report = await runValidation({ verbose, writeReport })

  // Exit with error code if there are failures
  if (report.summary.failCount > 0) {
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Validation failed:', error)
    process.exit(1)
  })
}
