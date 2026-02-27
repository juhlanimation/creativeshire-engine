#!/usr/bin/env tsx
/**
 * Visual Capture — Take reference screenshots for visual diff comparison.
 *
 * Usage:
 *   npm run visual:capture -- --url "https://example.com" --output ./reference/
 *   npm run visual:capture -- --url "https://example.com" --output ./reference/ --viewport 1440x900
 *   npm run visual:capture -- --url "https://example.com" --output ./reference/ --name hero
 *   npm run visual:capture -- --url "https://example.com" --output ./reference/ --no-full-page
 *
 * Options:
 *   --url          Page URL to screenshot (required)
 *   --output       Directory to save the screenshot (required)
 *   --viewport     Viewport size as WxH (default: 1440x900)
 *   --full-page    Capture full scrollable page (default: true, use --no-full-page to disable)
 *   --name         Custom filename (without extension). Defaults to sanitized URL.
 *   --settle       Extra settle time in ms after load (default: 1000)
 *
 * Output: Saves PNG screenshot to the output directory.
 */

import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
import { resolve } from 'path'
import { parseArgs } from 'util'

// =============================================================================
// CLI Argument Parsing
// =============================================================================

const { values } = parseArgs({
  options: {
    url: { type: 'string' },
    output: { type: 'string' },
    viewport: { type: 'string', default: '1440x900' },
    'full-page': { type: 'boolean', default: true },
    'no-full-page': { type: 'boolean', default: false },
    name: { type: 'string' },
    settle: { type: 'string', default: '1000' },
  },
})

if (!values.url || !values.output) {
  console.error('\x1b[31mError: --url and --output are required.\x1b[0m')
  console.error('')
  console.error('Usage:')
  console.error(
    '  npm run visual:capture -- --url "https://example.com" --output ./reference/'
  )
  process.exit(1)
}

const targetUrl = values.url!
const outputDir = resolve(values.output!)
const fullPage = values['no-full-page'] ? false : values['full-page']!
const settleMs = parseInt(values.settle!, 10)

// Parse viewport
const viewportParts = values.viewport!.split('x')
if (viewportParts.length !== 2) {
  console.error('\x1b[31mError: --viewport must be in WxH format (e.g. 1440x900).\x1b[0m')
  process.exit(1)
}
const viewportWidth = parseInt(viewportParts[0], 10)
const viewportHeight = parseInt(viewportParts[1], 10)

if (isNaN(viewportWidth) || isNaN(viewportHeight)) {
  console.error('\x1b[31mError: --viewport dimensions must be numbers.\x1b[0m')
  process.exit(1)
}

// =============================================================================
// Helpers
// =============================================================================

/** Sanitize a URL into a filesystem-safe filename. */
function sanitizeFilename(url: string): string {
  return url
    .replace(/^https?:\/\//, '') // Remove protocol
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace unsafe chars
    .replace(/_+/g, '_') // Collapse underscores
    .replace(/^_|_$/g, '') // Trim leading/trailing underscores
    .substring(0, 100) // Limit length
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  const filename = values.name || sanitizeFilename(targetUrl)
  const outputPath = resolve(outputDir, `${filename}.png`)

  console.log('')
  console.log('\x1b[36m--- Visual Capture ---\x1b[0m')
  console.log(`  URL:        ${targetUrl}`)
  console.log(`  Viewport:   ${viewportWidth}x${viewportHeight}`)
  console.log(`  Full page:  ${fullPage}`)
  console.log(`  Settle:     ${settleMs}ms`)
  console.log(`  Output:     ${outputPath}`)
  console.log('')

  // Ensure output directory exists
  mkdirSync(outputDir, { recursive: true })

  // Launch browser
  console.log('Launching browser...')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: viewportWidth, height: viewportHeight },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()

  // Navigate
  console.log('Navigating...')
  try {
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 })
  } catch (err) {
    console.error(`\x1b[31mError: Could not load URL: ${targetUrl}\x1b[0m`)
    console.error(`  ${err instanceof Error ? err.message : String(err)}`)
    await browser.close()
    process.exit(1)
  }

  // Extra settle time for lazy-loaded content, CSS transitions, etc.
  if (settleMs > 0) {
    console.log(`Settling for ${settleMs}ms...`)
    await page.waitForTimeout(settleMs)
  }

  // Capture screenshot
  console.log('Capturing screenshot...')
  await page.screenshot({
    path: outputPath,
    fullPage,
    type: 'png',
  })

  await browser.close()

  console.log('')
  console.log(`\x1b[32mSaved:\x1b[0m ${outputPath}`)
  console.log('')
}

main().catch((err) => {
  console.error('\x1b[31mUnexpected error:\x1b[0m', err)
  process.exit(1)
})
