#!/usr/bin/env npx tsx
/**
 * Validation CLI Entry Point
 *
 * Usage:
 *   npm run validate           # Quick validation
 *   npm run validate:verbose   # Detailed output
 *   npm run validate:report    # Generate markdown report
 *
 * Direct usage:
 *   npx tsx scripts/validate.ts --verbose --report
 */

import { runValidation } from './validate/index'

async function main() {
  const args = process.argv.slice(2)
  const verbose = args.includes('--verbose') || args.includes('-v')
  const writeReport = args.includes('--report') || args.includes('-r')

  console.log('🔍 Running Creativeshire Engine Validation...\n')

  const report = await runValidation({ verbose, writeReport })

  // Exit with appropriate code
  if (report.summary.failCount > 0) {
    console.log('\n❌ Validation FAILED\n')
    process.exit(1)
  } else if (report.summary.warningCount > 0) {
    console.log('\n⚠️  Validation passed with warnings\n')
    process.exit(0)
  } else {
    console.log('\n✅ Validation PASSED\n')
    process.exit(0)
  }
}

main().catch((error) => {
  console.error('Validation error:', error)
  process.exit(2)
})
