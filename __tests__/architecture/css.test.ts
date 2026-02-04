/**
 * CSS Rule Validation Tests
 *
 * Validates CSS architecture rules:
 * - No viewport units (vh/vw) without dynamic prefixes (svh, dvh, lvh)
 * - No calc(var(--...)) patterns (CSS can't animate calc)
 * - Effects are CSS-only (no TS/TSX except barrels)
 * - Effect files named by mechanism, not widget
 */

import { describe, it, expect } from 'vitest'
import {
  getFiles,
  readFile,
  relativePath,
  hasViewportUnits,
  hasCalcWithVar,
} from './helpers'

describe('CSS Rule Validation', () => {
  describe('Viewport units in sections', () => {
    // TASK-007 FIXED: Bojuhl-specific CSS moved to preset
    // Rule: Generic section styles must NOT use viewport units (vh/vw/svh/dvh)
    // Viewport sizing is handled by BehaviourWrapper in L2
    describe('No viewport units in generic sections', () => {
      it('sections/styles.css has no viewport units', async () => {
        const files = await getFiles('content/sections/styles.css')
        const violations: string[] = []

        for (const file of files) {
          const content = await readFile(file)

          // Check for ANY viewport units (vh, vw, svh, dvh, lvh)
          const vhMatch = content.match(/\d+[sdl]?vh\b/gm)
          const vwMatch = content.match(/\d+[sdl]?vw\b/gm)

          if (vhMatch || vwMatch) {
            violations.push(`${relativePath(file)}: ${[...(vhMatch || []), ...(vwMatch || [])].join(', ')}`)
          }
        }

        expect(violations, `Viewport units in generic sections:\\n${violations.join('\\n')}`).toHaveLength(0)
      })

      it('sections/styles.css has no site-specific selectors', async () => {
        const files = await getFiles('content/sections/styles.css')
        const violations: string[] = []

        // Site-specific selectors that should be in presets
        const siteSpecificSelectors = /#hero|#about|#featured-projects|#contact|\.other-projects/g

        for (const file of files) {
          const content = await readFile(file)
          const matches = content.match(siteSpecificSelectors)

          if (matches) {
            violations.push(`${relativePath(file)}: ${matches.join(', ')}`)
          }
        }

        expect(violations, `Site-specific selectors in generic sections:\\n${violations.join('\\n')}`).toHaveLength(0)
      })
    })
  })

  describe('Calc patterns', () => {
    // TASK-006 FIXED: CSS calc(var()) patterns fixed
    describe('No calc(var())', () => {
      it('no calc wrapping CSS variables directly', async () => {
        const files = await getFiles('**/*.{ts,tsx,css}')
        const violations: string[] = []

        for (const file of files) {
          const content = await readFile(file)

          if (hasCalcWithVar(content)) {
            violations.push(relativePath(file))
          }
        }

        expect(violations, `Files with calc(var()):\\n${violations.join('\\n')}`).toHaveLength(0)
      })
    })
  })

  describe('Effects structure', () => {
    // TASK-004/TASK-009 FIXED: GSAP moved from effects/ to drivers/
    describe('Effects folder is CSS-only', () => {
      it('effects/ contains only CSS and barrel files', async () => {
        const tsFiles = await getFiles('experience/effects/**/*.{ts,tsx}')

        // Filter out index.ts barrels
        const nonBarrelFiles = tsFiles.filter(f => !f.endsWith('index.ts'))

        const violations = nonBarrelFiles.map(f => relativePath(f))

        expect(violations, `Non-CSS files in effects/:\\n${violations.join('\\n')}`).toHaveLength(0)
      })
    })

    it('effect CSS files exist', async () => {
      const cssFiles = await getFiles('experience/effects/**/*.css')
      expect(cssFiles.length, 'No CSS files in effects/').toBeGreaterThan(0)
    })

    /**
     * Per effect.spec.md: Effects are pure CSS. The barrel is index.css, not index.ts.
     * Effects are imported via CSS @import or included via the root index.css.
     */
    it('effects folder has index.css barrel', async () => {
      const indexFiles = await getFiles('experience/effects/index.css')
      expect(indexFiles.length, 'Missing experience/effects/index.css').toBeGreaterThan(0)
    })

    it('effect CSS files use [data-effect~=""] selector', async () => {
      const cssFiles = await getFiles('experience/effects/**/*.css')
      const violations: string[] = []

      for (const file of cssFiles) {
        // Skip index.css barrel - it only imports others
        if (file.endsWith('index.css')) continue

        const content = await readFile(file)

        // Check for [data-effect~=""] selector pattern
        if (!/\[data-effect~=["'][^"']+["']\]/.test(content)) {
          violations.push(`${relativePath(file)}: missing [data-effect~=""] selector`)
        }
      }

      if (violations.length > 0) {
        console.log('Effect CSS files missing data-effect selector:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations, `Effect CSS files missing [data-effect~=""] selector:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Effect naming conventions', () => {
    it('effect files are named by mechanism (not widget)', async () => {
      const cssFiles = await getFiles('experience/effects/**/*.css')
      const violations: string[] = []

      // Widget names that shouldn't appear in effect filenames
      const widgetNames = [
        'button', 'text', 'image', 'video', 'icon', 'link',
        'stack', 'grid', 'flex', 'split', 'container',
        'card', 'hero', 'footer', 'header', 'modal',
        'projectcard', 'videoplayer', 'logolink'
      ]

      for (const file of cssFiles) {
        const filename = file.split('/').pop()?.toLowerCase() || ''

        for (const widget of widgetNames) {
          if (filename.includes(widget)) {
            violations.push(`${relativePath(file)}: contains widget name "${widget}"`)
          }
        }
      }

      expect(violations, `Effects named by widget (should be mechanism):\\n${violations.join('\\n')}`).toHaveLength(0)
    })

    it('effect mechanism folders follow naming convention', async () => {
      const expectedMechanisms = ['transform', 'mask', 'emphasis', 'page']
      const found: string[] = []

      for (const mechanism of expectedMechanisms) {
        const files = await getFiles(`experience/effects/${mechanism}/**/*.css`)
        if (files.length > 0) {
          found.push(mechanism)
        }
      }

      // At least some mechanism folders should exist
      expect(found.length, 'No mechanism folders in effects/').toBeGreaterThan(0)
    })
  })
})
