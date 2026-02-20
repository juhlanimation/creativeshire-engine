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
  fileExists,
  relativePath,
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

  describe('Theme variable usage', () => {
    /**
     * Widget/section/chrome CSS must use theme CSS variables for font-family,
     * not hardcoded font names. This ensures theme changes propagate everywhere.
     *
     * Allowed: font-family: var(--font-paragraph, system-ui, sans-serif)
     * Allowed: font-family: inherit
     * Violation: font-family: 'Plus Jakarta Sans', system-ui, sans-serif
     * Violation: font-family: Inter, system-ui, sans-serif
     */
    it('no hardcoded font-family in content CSS', async () => {
      const cssFiles = await getFiles('content/**/*.css')
      const violations: string[] = []

      for (const file of cssFiles) {
        const content = await readFile(file)
        const lines = content.split('\n')

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()

          // Skip comments
          if (line.startsWith('*') || line.startsWith('/*') || line.startsWith('//')) continue

          // Match font-family declarations
          if (!/font-family\s*:/.test(line)) continue

          // Allowed: var(--font-*), inherit, unset
          if (/font-family\s*:\s*(var\(--font-|inherit|unset)/.test(line)) continue

          violations.push(`${relativePath(file)}:${i + 1}: ${line}`)
        }
      }

      expect(
        violations,
        `Hardcoded font-family (use var(--font-*) instead):\n${violations.join('\n')}`
      ).toHaveLength(0)
    })

    /**
     * React components that render raw HTML text elements (span, p, h1-h6, button, label)
     * must have font-family declared in their sibling styles.css.
     *
     * Components that only compose other widgets (via schema trees) don't need this —
     * the Text widget handles font-family. But interactive React components that render
     * their own HTML text must explicitly set font-family to a theme variable.
     *
     * The global [data-site-renderer] { font-family: var(--font-paragraph) } in base.css
     * provides a safety net, but chrome overlays and interactive widgets should explicitly
     * set font-family (typically --font-ui) for clarity and to survive portal boundaries.
     */
    it('components rendering text have font-family in CSS', async () => {
      const tsxFiles = await getFiles('content/**/*.tsx')
      const violations: string[] = []

      // Components that don't need font-family in their own CSS:
      // - They render minimal UI text (e.g. a × close button) that inherits correctly
      // - Or they are pure containers that delegate text to child widgets
      const allowlist = [
        'Icon/index.tsx',           // Renders SVG/icon font in <span>, not readable text
        'Modal/index.tsx',          // Close button (×) inherits from site renderer
        'Modal/ModalRoot.tsx',      // Container — delegates to handler components
        'FixedCard/index.tsx',      // Container — renders child widgets, no direct text
      ]

      // Patterns indicating direct text rendering in JSX
      const textElementPatterns = [
        /<span[\s>]/,        // <span> or <span ...>
        /<p[\s>]/,           // <p> or <p ...>
        /<h[1-6][\s>]/,      // <h1>-<h6>
        /<button[\s>]/,      // <button> (often contains text)
        /<label[\s>]/,       // <label>
      ]

      for (const file of tsxFiles) {
        const rel = relativePath(file)

        // Skip allowlisted files
        if (allowlist.some(a => rel.endsWith(a))) continue

        const content = await readFile(file)

        // Check if this component renders raw text elements
        const rendersText = textElementPatterns.some(pattern => pattern.test(content))
        if (!rendersText) continue

        // Find sibling styles.css
        const dir = file.replace(/[/\\][^/\\]+$/, '')
        const cssPath = dir + '/styles.css'

        const cssExists = await fileExists(cssPath)
        if (!cssExists) {
          violations.push(`${rel}: renders text but has no styles.css`)
          continue
        }

        const cssContent = await readFile(cssPath)

        // CSS must contain font-family with a theme variable or inherit
        if (!/font-family\s*:\s*(var\(--font-|inherit)/.test(cssContent)) {
          violations.push(`${rel}: renders text but styles.css has no font-family`)
        }
      }

      expect(
        violations,
        `Components rendering text without font-family in CSS:\n${violations.join('\n')}`
      ).toHaveLength(0)
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

  describe('Widget theme compliance', () => {
    /**
     * Widget CSS files must not contain hardcoded color values.
     * Colors should reference theme CSS variables.
     *
     * Exception: VideoPlayer/ uses intentionally hardcoded dark colors
     * (video players are always dark, like YouTube/Vimeo controls).
     */
    it('no hardcoded colors in widget CSS', async () => {
      const files = await getFiles('content/widgets/**/*.css')
      const violations: string[] = []

      for (const file of files) {
        // VideoPlayer intentionally uses hardcoded dark colors
        if (file.includes('/VideoPlayer/')) continue

        const content = await readFile(file)
        const lines = content.split('\n')

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (line.startsWith('/*') || line.startsWith('*') || line.startsWith('//')) continue

          // Check for hex colors not inside var() fallbacks
          const hexMatch = line.match(/#[0-9a-fA-F]{3,8}\b/)
          if (hexMatch && !line.includes('var(')) {
            violations.push(`${relativePath(file)}:${i + 1}: ${line}`)
          }

          // Check for rgb/rgba not inside var()
          if (/rgba?\(/.test(line) && !line.includes('var(') && !line.includes('/*')) {
            violations.push(`${relativePath(file)}:${i + 1}: ${line}`)
          }
        }
      }

      expect(
        violations,
        `Hardcoded colors in widget CSS (use theme CSS variables):\n${violations.join('\n')}`
      ).toHaveLength(0)
    })
  })

  describe('Section theme compliance', () => {
    /**
     * Section factory files must not contain hardcoded color values.
     * Colors should come from theme CSS variables or be passed as props
     * from the preset. This ensures theme changes propagate correctly.
     */
    it('no hardcoded colors in section factory files', async () => {
      const files = await getFiles('content/sections/patterns/*/index.ts')
      const violations: string[] = []

      for (const file of files) {
        const content = await readFile(file)
        const lines = content.split('\n')

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()

          // Skip comments
          if (line.startsWith('//') || line.startsWith('*') || line.startsWith('/*')) continue

          // Check for hex colors as string values (not inside var() fallbacks)
          if (/'#[0-9a-fA-F]{3,8}'/.test(line) && !line.includes('var(')) {
            violations.push(`${relativePath(file)}:${i + 1}: ${line}`)
          }

          // Check for rgb/rgba as string values
          if (/'rgba?\(/.test(line) && !line.includes('var(')) {
            violations.push(`${relativePath(file)}:${i + 1}: ${line}`)
          }

          // Check for named colors as style values
          // Pattern: property: 'colorname' (not props.color or colorMode etc)
          const namedColorMatch = line.match(/(?:color|backgroundColor|background|borderColor)\s*:\s*'(white|black|red|blue|green|gray|grey|transparent)'/i)
          if (namedColorMatch && !line.includes('var(')) {
            violations.push(`${relativePath(file)}:${i + 1}: ${line}`)
          }
        }
      }

      expect(
        violations,
        `Hardcoded colors in section factories (use theme CSS variables):\n${violations.join('\n')}`
      ).toHaveLength(0)
    })

    /**
     * Section CSS files must not contain hardcoded color values.
     * All colors should reference theme CSS variables.
     */
    it('no hardcoded colors in section CSS', async () => {
      const files = await getFiles('content/sections/patterns/*/styles.css')
      const violations: string[] = []

      for (const file of files) {
        const content = await readFile(file)
        const lines = content.split('\n')

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (line.startsWith('/*') || line.startsWith('*') || line.startsWith('//')) continue

          // Check for hex colors not inside var() fallbacks
          // Allow: var(--something, #fff) but not: color: #fff
          const hexMatch = line.match(/#[0-9a-fA-F]{3,8}\b/)
          if (hexMatch && !line.includes('var(')) {
            violations.push(`${relativePath(file)}:${i + 1}: ${line}`)
          }

          // Check for rgb/rgba not inside var()
          if (/rgba?\(/.test(line) && !line.includes('var(') && !line.includes('/*')) {
            violations.push(`${relativePath(file)}:${i + 1}: ${line}`)
          }
        }
      }

      expect(
        violations,
        `Hardcoded colors in section CSS (use theme CSS variables):\n${violations.join('\n')}`
      ).toHaveLength(0)
    })

    // Scoped widget CSS files (inside sections/patterns/{Section}/components/)
    // must not contain hardcoded color values.
    // These are checked separately from global widget CSS.
    it('no hardcoded colors in scoped widget CSS', async () => {
      const files = await getFiles('content/sections/patterns/*/components/**/*.css')
      const violations: string[] = []

      for (const file of files) {
        const content = await readFile(file)
        const lines = content.split('\n')

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (line.startsWith('/*') || line.startsWith('*') || line.startsWith('//')) continue

          // Check for hex colors not inside var() fallbacks
          const hexMatch = line.match(/#[0-9a-fA-F]{3,8}\b/)
          if (hexMatch && !line.includes('var(')) {
            violations.push(`${relativePath(file)}:${i + 1}: ${line}`)
          }

          // Check for rgb/rgba not inside var() or color-mix()
          if (/rgba?\(/.test(line) && !line.includes('var(') && !line.includes('color-mix(') && !line.includes('/*')) {
            violations.push(`${relativePath(file)}:${i + 1}: ${line}`)
          }
        }
      }

      expect(
        violations,
        `Hardcoded colors in scoped widget CSS (use theme CSS variables):\n${violations.join('\n')}`
      ).toHaveLength(0)
    })

    /**
     * Section factory files must not contain hardcoded font-size values.
     * Font sizes should use theme CSS variables like var(--font-size-*).
     */
    it('no hardcoded font-size in section factory files', async () => {
      const files = await getFiles('content/sections/patterns/*/index.ts')
      const violations: string[] = []

      for (const file of files) {
        const content = await readFile(file)
        const lines = content.split('\n')

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (line.startsWith('//') || line.startsWith('*') || line.startsWith('/*')) continue

          // fontSize: 'Npx' or fontSize: 'Nrem' (not inside var())
          if (/fontSize\s*:\s*'[\d.]+(?:px|rem|em)'/.test(line) && !line.includes('var(')) {
            violations.push(`${relativePath(file)}:${i + 1}: ${line}`)
          }
        }
      }

      expect(
        violations,
        `Hardcoded font-size in section factories (use var(--font-size-*)):\n${violations.join('\n')}`
      ).toHaveLength(0)
    })
  })

  describe('Cross-component CSS coupling', () => {
    /**
     * Section CSS must not target global widget class names.
     * Widget classes (.flex-widget, .text-widget, etc.) are implementation details
     * that can change. Sections should target widget IDs or use CSS variable bridges.
     */
    it('section CSS must not target widget class names', async () => {
      const sectionCssFiles = await getFiles('content/sections/patterns/**/*.css')
      const violations: string[] = []

      // Global widget classes that sections must not reference
      const widgetClasses = [
        '.flex-widget', '.text-widget', '.image-widget',
        '.stack-widget', '.box-widget', '.grid-widget',
        '.split-widget', '.container-widget', '.marquee-widget',
        '.video-widget', '.video-player', '.button-widget',
        '.link-widget', '.icon-widget', '.expand-row-image-repeater',
      ]

      for (const file of sectionCssFiles) {
        const content = await readFile(file)
        const lines = content.split('\n')

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()

          // Skip comments
          if (line.startsWith('/*') || line.startsWith('*') || line.startsWith('//')) continue

          // Skip lines that are property declarations (not selectors)
          if (line.includes(':') && !line.includes('{')) continue

          for (const widgetClass of widgetClasses) {
            if (line.includes(widgetClass)) {
              violations.push(`${relativePath(file)}:${i + 1}: ${line}`)
            }
          }
        }
      }

      expect(
        violations,
        `Section CSS targeting widget class names (use IDs or CSS variable bridge):\n${violations.join('\n')}`
      ).toHaveLength(0)
    })

    /**
     * Widget CSS must not target section infrastructure ([data-section-id]).
     * Widgets should be self-contained; z-index/positioning relative to sections
     * belongs in the section CSS, not the widget CSS.
     */
    it('widget CSS must not target section infrastructure', async () => {
      const widgetCssFiles = [
        ...await getFiles('content/widgets/**/*.css'),
        ...await getFiles('content/sections/patterns/*/components/**/*.css'),
      ]
      const violations: string[] = []

      for (const file of widgetCssFiles) {
        const content = await readFile(file)
        const lines = content.split('\n')

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()

          // Skip comments
          if (line.startsWith('/*') || line.startsWith('*') || line.startsWith('//')) continue

          if (line.includes('[data-section-id]')) {
            violations.push(`${relativePath(file)}:${i + 1}: ${line}`)
          }
        }
      }

      expect(
        violations,
        `Widget CSS targeting section infrastructure (move to section CSS):\n${violations.join('\n')}`
      ).toHaveLength(0)
    })
  })
})
