/**
 * Theme Compliance Tests
 *
 * Enforces theme variable usage across all content CSS.
 * Uses content/**\/*.css to cover widgets, sections (including scoped components),
 * chrome patterns, and chrome overlays.
 *
 * Two enforcement modes:
 * - Strict: allowlist specific files, fail on any new violation
 * - Baseline: count violations, fail if count increases (ratchet down over time)
 */

import { describe, it, expect } from 'vitest'
import { getFiles, readFile, relativePath, findThemeViolations, stripVarExpressions, isCSSComment, isCustomPropertyDecl } from './helpers'

// ---------------------------------------------------------------------------
// Shared regex patterns
// ---------------------------------------------------------------------------

/** Matches hex color values: #fff, #ffffff, #ffffffaa */
const HEX_COLOR = /#[0-9a-fA-F]{3,8}\b/

/** Matches rgb/rgba function calls */
const RGB_COLOR = /rgba?\s*\(/

/** Matches raw size units (px, rem, em) */
const RAW_SIZE_UNIT = /\d+(\.\d+)?\s*(px|rem|em)\b/

/** Matches spacing properties */
const SPACING_PROP = /^(gap|row-gap|column-gap|padding|padding-(?:top|right|bottom|left)|margin|margin-(?:top|right|bottom|left))\s*:/

/** Matches font-size property */
const FONT_SIZE_PROP = /^font-size\s*:/

/** Matches font-weight property */
const FONT_WEIGHT_PROP = /^font-weight\s*:/

/** Matches border-radius properties */
const BORDER_RADIUS_PROP = /border-(?:top-left-|top-right-|bottom-left-|bottom-right-)?radius\s*:/

/** Matches box-shadow property */
const BOX_SHADOW_PROP = /^box-shadow\s*:/

/** Matches transition properties */
const TRANSITION_PROP = /^transition(?:-duration|-timing-function)?\s*:/

// ---------------------------------------------------------------------------
// Color violation helpers
// ---------------------------------------------------------------------------

/** Check if a var()-stripped line contains hardcoded color values */
function hasHardcodedColor(stripped: string): boolean {
  return HEX_COLOR.test(stripped) || RGB_COLOR.test(stripped)
}

// ---------------------------------------------------------------------------
// Baselines — update these downward as violations are fixed
// ---------------------------------------------------------------------------
const SPACING_BASELINE = 45
const FONT_SIZE_BASELINE = 29
const FONT_WEIGHT_BASELINE = 40

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Theme Compliance', () => {
  // -----------------------------------------------------------------------
  // Colors (strict — allowlist)
  // -----------------------------------------------------------------------
  describe('Colors', () => {
    /**
     * All content CSS must use theme CSS variables for colors.
     * Covers widgets, sections, scoped components, chrome patterns, and overlays.
     */
    it('no hardcoded colors in any content CSS', async () => {
      const files = await getFiles('content/**/*.css')
      const violations: string[] = []

      // Files with intentionally hardcoded colors
      const allowlist = [
        'content/widgets/interactive/VideoPlayer/',  // Dark video controls (YouTube/Vimeo-like)
        'content/chrome/overlays/CursorLabel/',       // mix-blend-mode requires literal colors
        'content/chrome/overlays/NavTimeline/',        // Indicator dots/lines
        'content/chrome/overlays/SlideIndicators/',    // Slide dot indicators
        'content/chrome/overlays/Modal/',              // Dark backdrop
      ]

      // Global exclusions
      const globalExclusions = [
        'renderer/dev/DevToolsPanel/',
        'experience/effects/',
        'experience/compositions/',
      ]

      for (const file of files) {
        const rel = relativePath(file)
        if (allowlist.some(a => rel.includes(a))) continue
        if (globalExclusions.some(e => rel.includes(e))) continue

        const content = await readFile(file)
        const lines = content.split('\n')
        let inBlockComment = false

        for (let i = 0; i < lines.length; i++) {
          const trimmed = lines[i].trim()

          if (inBlockComment) {
            if (trimmed.includes('*/')) inBlockComment = false
            continue
          }
          if (trimmed.startsWith('/*') && !trimmed.includes('*/')) {
            inBlockComment = true
            continue
          }
          if (isCSSComment(trimmed)) continue
          if (isCustomPropertyDecl(trimmed)) continue

          const stripped = stripVarExpressions(trimmed)
          if (hasHardcodedColor(stripped)) {
            violations.push(`${rel}:${i + 1}: ${trimmed}`)
          }
        }
      }

      if (violations.length > 0) {
        console.log('Hardcoded color violations:')
        violations.forEach(v => console.log(`  ${v}`))
      }

      expect(
        violations,
        `Hardcoded colors in content CSS (use theme CSS variables):\n${violations.join('\n')}`
      ).toHaveLength(0)
    })

    /**
     * Chrome pattern factory files (TypeScript) must not contain hardcoded colors.
     */
    it('no hardcoded colors in chrome pattern factories', async () => {
      const files = await getFiles('content/chrome/patterns/*/index.ts')
      const violations: string[] = []

      // FixedNav uses hardcoded defaults as prop fallbacks — these are
      // overridden by preset props, so the factory default is acceptable
      const allowlist = [
        'content/chrome/patterns/FixedNav/',
      ]

      for (const file of files) {
        const rel = relativePath(file)
        if (allowlist.some(a => rel.includes(a))) continue

        const content = await readFile(file)
        const lines = content.split('\n')

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (line.startsWith('//') || line.startsWith('*') || line.startsWith('/*')) continue

          // Hex colors as string literals
          if (/'#[0-9a-fA-F]{3,8}'/.test(line) && !line.includes('var(')) {
            violations.push(`${relativePath(file)}:${i + 1}: ${line}`)
          }

          // rgb/rgba as string literals
          if (/'rgba?\(/.test(line) && !line.includes('var(')) {
            violations.push(`${relativePath(file)}:${i + 1}: ${line}`)
          }

          // Named colors as style values
          const namedColorMatch = line.match(
            /(?:color|backgroundColor|background|borderColor)\s*:\s*'(white|black|red|blue|green|gray|grey)'/i
          )
          if (namedColorMatch && !line.includes('var(')) {
            violations.push(`${relativePath(file)}:${i + 1}: ${line}`)
          }
        }
      }

      if (violations.length > 0) {
        console.log('Hardcoded colors in chrome factories:')
        violations.forEach(v => console.log(`  ${v}`))
      }

      expect(
        violations,
        `Hardcoded colors in chrome pattern factories:\n${violations.join('\n')}`
      ).toHaveLength(0)
    })
  })

  // -----------------------------------------------------------------------
  // Typography (baseline)
  // -----------------------------------------------------------------------
  describe('Typography', () => {
    it('hardcoded font-size violations do not exceed baseline', async () => {
      const violations = await findThemeViolations(
        'content/**/*.css',
        FONT_SIZE_PROP,
        (stripped) => RAW_SIZE_UNIT.test(stripped) || /\d+(\.\d+)?\s*cqw\b/.test(stripped),
      )

      console.log(`Font-size violations: ${violations.length} (baseline: ${FONT_SIZE_BASELINE})`)
      if (violations.length > 0) {
        violations.forEach(v => console.log(`  ${v}`))
      }

      expect(
        violations.length,
        `Font-size violations increased! Found ${violations.length}, baseline is ${FONT_SIZE_BASELINE}.\n` +
        `New violations:\n${violations.join('\n')}`
      ).toBeLessThanOrEqual(FONT_SIZE_BASELINE)
    })

    it('hardcoded font-weight violations do not exceed baseline', async () => {
      const violations = await findThemeViolations(
        'content/**/*.css',
        FONT_WEIGHT_PROP,
        (stripped) => /font-weight\s*:\s*(\d{3}|bold|bolder|lighter|normal)\s*(;|$)/.test(stripped),
      )

      console.log(`Font-weight violations: ${violations.length} (baseline: ${FONT_WEIGHT_BASELINE})`)
      if (violations.length > 0) {
        violations.forEach(v => console.log(`  ${v}`))
      }

      expect(
        violations.length,
        `Font-weight violations increased! Found ${violations.length}, baseline is ${FONT_WEIGHT_BASELINE}.\n` +
        `New violations:\n${violations.join('\n')}`
      ).toBeLessThanOrEqual(FONT_WEIGHT_BASELINE)
    })
  })

  // -----------------------------------------------------------------------
  // Spacing (baseline)
  // -----------------------------------------------------------------------
  describe('Spacing', () => {
    it('hardcoded spacing violations do not exceed baseline', async () => {
      const violations = await findThemeViolations(
        'content/**/*.css',
        SPACING_PROP,
        (stripped) => {
          // Extract the value part after the property
          const valueMatch = stripped.match(/:\s*(.+?)(?:;|$)/)
          if (!valueMatch) return false
          const value = valueMatch[1].trim()

          // Safe values
          if (/^(0|auto|inherit|unset|initial|none|VAR)\s*(;|$)/.test(value)) return false
          // All-VAR multi-values like "VAR VAR" are fine
          if (/^(VAR\s*)+$/.test(value.trim())) return false

          // Check if any raw size unit remains after var() stripping
          return RAW_SIZE_UNIT.test(value)
        },
      )

      console.log(`Spacing violations: ${violations.length} (baseline: ${SPACING_BASELINE})`)
      if (violations.length > 0) {
        violations.forEach(v => console.log(`  ${v}`))
      }

      expect(
        violations.length,
        `Spacing violations increased! Found ${violations.length}, baseline is ${SPACING_BASELINE}.\n` +
        `New violations:\n${violations.join('\n')}`
      ).toBeLessThanOrEqual(SPACING_BASELINE)
    })
  })

  // -----------------------------------------------------------------------
  // Shape (strict — allowlist)
  // -----------------------------------------------------------------------
  describe('Shape', () => {
    it('no hardcoded border-radius in content CSS', async () => {
      const allowlist = [
        'content/chrome/overlays/Modal/',             // Intentional dark modal styling
        'content/chrome/overlays/SlideIndicators/',    // Indicator dot shape
      ]

      const violations = await findThemeViolations(
        'content/**/*.css',
        BORDER_RADIUS_PROP,
        (stripped) => {
          const valueMatch = stripped.match(/radius\s*:\s*(.+?)(?:;|$)/)
          if (!valueMatch) return false
          const value = valueMatch[1].trim()

          // Safe values: 0, 50% (circles), inherit, var placeholders
          if (/^(0|50%|inherit|unset|initial|VAR)\s*(;|$)/.test(value)) return false
          if (/^(VAR\s*)+$/.test(value.trim())) return false

          return RAW_SIZE_UNIT.test(value) || /\d+%/.test(value)
        },
        allowlist,
      )

      if (violations.length > 0) {
        console.log('Hardcoded border-radius violations:')
        violations.forEach(v => console.log(`  ${v}`))
      }

      expect(
        violations,
        `Hardcoded border-radius in content CSS (use var(--radius-*)):\n${violations.join('\n')}`
      ).toHaveLength(0)
    })

    it('no hardcoded box-shadow in content CSS', async () => {
      const allowlist = [
        'content/widgets/interactive/VideoPlayer/',    // Dark video controls (own design)
      ]

      const violations = await findThemeViolations(
        'content/**/*.css',
        BOX_SHADOW_PROP,
        (stripped) => {
          const valueMatch = stripped.match(/box-shadow\s*:\s*(.+?)(?:;|$)/)
          if (!valueMatch) return false
          const value = valueMatch[1].trim()

          // Safe values
          if (/^(none|inherit|unset|initial|VAR)\s*(;|$)/.test(value)) return false
          if (/^(VAR\s*)+$/.test(value.trim())) return false

          // Any raw shadow values (px offsets, colors) are violations
          return RAW_SIZE_UNIT.test(value) || HEX_COLOR.test(value) || RGB_COLOR.test(value)
        },
        allowlist,
      )

      if (violations.length > 0) {
        console.log('Hardcoded box-shadow violations:')
        violations.forEach(v => console.log(`  ${v}`))
      }

      expect(
        violations,
        `Hardcoded box-shadow in content CSS (use var(--shadow-*)):\n${violations.join('\n')}`
      ).toHaveLength(0)
    })
  })

  // -----------------------------------------------------------------------
  // Motion (strict — allowlist)
  // -----------------------------------------------------------------------
  describe('Motion', () => {
    it('no hardcoded transition timing in content CSS', async () => {
      const allowlist = [
        'content/widgets/interactive/VideoPlayer/',          // Playback progress bar (intentionally snappy)
        'content/chrome/overlays/SlideIndicators/',           // Indicator transitions
        'content/sections/patterns/ProjectGallery/components/FlexGalleryCardRepeater/', // Thumbnail micro-interaction
      ]

      const violations = await findThemeViolations(
        'content/**/*.css',
        TRANSITION_PROP,
        (stripped) => {
          const valueMatch = stripped.match(/transition(?:-duration|-timing-function)?\s*:\s*(.+?)(?:;|$)/)
          if (!valueMatch) return false
          const value = valueMatch[1].trim()

          // Safe values
          if (/^(none|inherit|unset|initial|VAR)\s*(;|$)/.test(value)) return false
          // All-VAR values like "VAR VAR VAR" are fine
          if (/^([\w-]+\s+)?(VAR\s*)+$/.test(value.trim())) return false

          // Zero durations (0s, 0ms) with optional delay are harmless step transitions
          if (/^[\w-]+\s+0m?s(\s+\d+m?s)?(\s*,\s*[\w-]+\s+0m?s(\s+\d+m?s)?)*\s*$/.test(value)) return false

          // Check for raw duration literals (300ms, 0.3s) or raw easing outside var()
          const hasDuration = /(?<!\b0)(\d+)m?s\b/.test(value)
          const hasEasing = /\b(ease|ease-in|ease-out|ease-in-out|linear)\b/.test(value)
          const hasCubicBezier = /cubic-bezier\s*\(/.test(value)

          return hasDuration || hasEasing || hasCubicBezier
        },
        allowlist,
      )

      if (violations.length > 0) {
        console.log('Hardcoded transition timing violations:')
        violations.forEach(v => console.log(`  ${v}`))
      }

      expect(
        violations,
        `Hardcoded transition timing in content CSS (use var(--duration-*), var(--ease-*)):\n${violations.join('\n')}`
      ).toHaveLength(0)
    })
  })
})
