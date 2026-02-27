#!/usr/bin/env tsx
/**
 * Visual Diff — Pixel-perfect comparison between reference and engine render.
 *
 * Usage:
 *   npm run visual:diff -- --reference ./reference/hero.png --story "l1-content-sections-herotitle--default"
 *   npm run visual:diff -- --reference ./reference/hero.png --story "l1-content-sections-herotitle--default" --threshold 0.05
 *   npm run visual:diff -- --reference ./reference/hero.png --story "l1-content-sections-herotitle--default" --width 1920 --height 1080
 *
 * Options:
 *   --reference       Path to reference PNG image (required)
 *   --story           Storybook story ID (required)
 *   --threshold       pixelmatch sensitivity 0-1 (default: 0.1)
 *   --width           Viewport width in px (default: 1440)
 *   --height          Viewport height in px (default: 900)
 *   --pass-threshold  Minimum match % to pass (default: 95)
 *   --url             Storybook base URL (default: http://localhost:6006)
 *
 * Requires: Storybook running on localhost:6006
 * Output: Match percentage + diff image highlighting pixel differences
 */

import { chromium } from 'playwright'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, basename } from 'path'
import { parseArgs } from 'util'

// =============================================================================
// CLI Argument Parsing
// =============================================================================

const { values } = parseArgs({
  options: {
    reference: { type: 'string' },
    story: { type: 'string' },
    threshold: { type: 'string', default: '0.1' },
    width: { type: 'string', default: '1440' },
    height: { type: 'string', default: '900' },
    'pass-threshold': { type: 'string', default: '95' },
    url: { type: 'string', default: 'http://localhost:6006' },
  },
})

if (!values.reference || !values.story) {
  console.error('\x1b[31mError: --reference and --story are required.\x1b[0m')
  console.error('')
  console.error('Usage:')
  console.error(
    '  npm run visual:diff -- --reference ./reference/hero.png --story "l1-content-sections-herotitle--default"'
  )
  process.exit(1)
}

const referencePath = resolve(values.reference)
const storyId = values.story!
const threshold = parseFloat(values.threshold!)
const viewportWidth = parseInt(values.width!, 10)
const viewportHeight = parseInt(values.height!, 10)
const passThreshold = parseFloat(values['pass-threshold']!)
const storybookUrl = values.url!

// =============================================================================
// Validation
// =============================================================================

if (!existsSync(referencePath)) {
  console.error(`\x1b[31mError: Reference image not found: ${referencePath}\x1b[0m`)
  process.exit(1)
}

if (threshold < 0 || threshold > 1) {
  console.error('\x1b[31mError: --threshold must be between 0 and 1.\x1b[0m')
  process.exit(1)
}

if (passThreshold < 0 || passThreshold > 100) {
  console.error('\x1b[31mError: --pass-threshold must be between 0 and 100.\x1b[0m')
  process.exit(1)
}

// =============================================================================
// Helpers
// =============================================================================

/** Parse a PNG buffer into a pngjs PNG instance. */
function parsePng(buffer: Buffer): PNG {
  return PNG.sync.read(buffer)
}

/**
 * Resize an image to target dimensions by creating a new canvas and compositing.
 * Uses nearest-neighbor (pixel copy) — good enough for screenshot comparison.
 * If the source is larger, it crops from top-left. If smaller, it pads with transparent black.
 */
function resizeToMatch(source: PNG, targetWidth: number, targetHeight: number): PNG {
  const output = new PNG({ width: targetWidth, height: targetHeight, fill: true })

  // Fill with transparent black
  output.data.fill(0)

  // Copy pixels from source, clamped to the overlapping region
  const copyWidth = Math.min(source.width, targetWidth)
  const copyHeight = Math.min(source.height, targetHeight)

  for (let y = 0; y < copyHeight; y++) {
    for (let x = 0; x < copyWidth; x++) {
      const srcIdx = (y * source.width + x) * 4
      const dstIdx = (y * targetWidth + x) * 4
      output.data[dstIdx] = source.data[srcIdx] // R
      output.data[dstIdx + 1] = source.data[srcIdx + 1] // G
      output.data[dstIdx + 2] = source.data[srcIdx + 2] // B
      output.data[dstIdx + 3] = source.data[srcIdx + 3] // A
    }
  }

  return output
}

function formatPercent(value: number): string {
  return value.toFixed(2) + '%'
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  const iframeUrl = `${storybookUrl}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`

  console.log('')
  console.log('\x1b[36m--- Visual Diff ---\x1b[0m')
  console.log(`  Reference:  ${referencePath}`)
  console.log(`  Story:      ${storyId}`)
  console.log(`  Story URL:  ${iframeUrl}`)
  console.log(`  Viewport:   ${viewportWidth}x${viewportHeight}`)
  console.log(`  Threshold:  ${threshold} (pixelmatch sensitivity)`)
  console.log(`  Pass at:    >= ${formatPercent(passThreshold)}`)
  console.log('')

  // --- Step 1: Load reference image ---
  console.log('Loading reference image...')
  const referenceBuffer = readFileSync(referencePath)
  const referenceImg = parsePng(referenceBuffer)
  console.log(`  Reference size: ${referenceImg.width}x${referenceImg.height}`)

  // --- Step 2: Capture screenshot from Storybook ---
  console.log('Launching browser...')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: viewportWidth, height: viewportHeight },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()

  console.log(`Navigating to story: ${storyId}`)
  try {
    await page.goto(iframeUrl, { waitUntil: 'networkidle', timeout: 30000 })
  } catch (err) {
    console.error(
      `\x1b[31mError: Could not load Storybook. Is it running at ${storybookUrl}?\x1b[0m`
    )
    await browser.close()
    process.exit(1)
  }

  // Wait for CSS transitions/animations to settle
  await page.waitForTimeout(500)

  console.log('Taking screenshot...')
  const screenshotBuffer = await page.screenshot({ fullPage: true, type: 'png' })
  await browser.close()

  let screenshotImg = parsePng(Buffer.from(screenshotBuffer))
  console.log(`  Screenshot size: ${screenshotImg.width}x${screenshotImg.height}`)

  // --- Step 3: Match dimensions ---
  // Use reference dimensions as the ground truth. Resize screenshot to match.
  const compareWidth = referenceImg.width
  const compareHeight = referenceImg.height

  if (screenshotImg.width !== compareWidth || screenshotImg.height !== compareHeight) {
    console.log(
      `  Resizing screenshot from ${screenshotImg.width}x${screenshotImg.height} to ${compareWidth}x${compareHeight}`
    )
    screenshotImg = resizeToMatch(screenshotImg, compareWidth, compareHeight)
  }

  // --- Step 4: Run pixelmatch ---
  console.log('Comparing...')
  const diffImg = new PNG({ width: compareWidth, height: compareHeight })

  const diffPixels = pixelmatch(
    referenceImg.data,
    screenshotImg.data,
    diffImg.data,
    compareWidth,
    compareHeight,
    { threshold }
  )

  const totalPixels = compareWidth * compareHeight
  const matchPercent = (1 - diffPixels / totalPixels) * 100
  const passed = matchPercent >= passThreshold

  // --- Step 5: Save diff image ---
  const diffDir = resolve('reference', 'diffs')
  mkdirSync(diffDir, { recursive: true })

  const storySlug = storyId.replace(/[^a-zA-Z0-9-]/g, '_')
  const diffPath = resolve(diffDir, `${storySlug}-diff.png`)
  writeFileSync(diffPath, PNG.sync.write(diffImg))

  // Also save the captured screenshot for reference
  const capturePath = resolve(diffDir, `${storySlug}-capture.png`)
  writeFileSync(capturePath, screenshotBuffer)

  // --- Step 6: Report ---
  console.log('')
  console.log('\x1b[36m--- Results ---\x1b[0m')
  console.log(`  Total pixels:  ${totalPixels.toLocaleString()}`)
  console.log(`  Diff pixels:   ${diffPixels.toLocaleString()}`)

  const matchColor = passed ? '\x1b[32m' : '\x1b[31m'
  console.log(`  Match:         ${matchColor}${formatPercent(matchPercent)}\x1b[0m`)

  console.log('')
  console.log(`  Diff image:    ${diffPath}`)
  console.log(`  Capture:       ${capturePath}`)
  console.log('')

  if (passed) {
    console.log(`\x1b[32mPASS\x1b[0m  Match ${formatPercent(matchPercent)} >= ${formatPercent(passThreshold)}`)
  } else {
    console.log(`\x1b[31mFAIL\x1b[0m  Match ${formatPercent(matchPercent)} < ${formatPercent(passThreshold)}`)
  }

  console.log('')
  process.exit(passed ? 0 : 1)
}

main().catch((err) => {
  console.error('\x1b[31mUnexpected error:\x1b[0m', err)
  process.exit(1)
})
