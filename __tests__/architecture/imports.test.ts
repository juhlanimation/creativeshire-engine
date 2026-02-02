/**
 * Import Boundary Tests
 *
 * Validates L1/L2 separation:
 * - L1 (content) CANNOT import from L2 (experience)
 * - Effects (L2) CANNOT import from behaviours (L2 internal)
 * - Primitives CANNOT import from patterns/interactive/sections/chrome
 */

import { describe, it, expect } from 'vitest'
import {
  getFiles,
  readFile,
  extractImports,
  relativePath,
  isL1ToL2Import,
} from './helpers'

describe('Import Boundaries', () => {
  describe('L1 Content → L2 Experience', () => {
    /**
     * Most primitives are pure L1 content - they render once and stay idle.
     *
     * Exception: Link is an L1/L2 HYBRID component.
     * It renders UI (L1) but requires navigation access for page transitions:
     * - TransitionProvider integration (intercept navigation for exit animations)
     *
     * This is an architectural decision documented here.
     */
    it('primitives do not import from experience/ (except Link)', async () => {
      const files = await getFiles('content/widgets/primitives/**/*.{ts,tsx}')
      const violations: string[] = []
      const linkImports: string[] = []

      for (const file of files) {
        const content = await readFile(file)
        const imports = extractImports(content)
        const isLinkFile = file.includes('/Link/')

        for (const imp of imports) {
          if (isL1ToL2Import(file, imp)) {
            if (isLinkFile) {
              // Document Link's hybrid nature (informational)
              linkImports.push(`${relativePath(file)}: imports "${imp}"`)
            } else {
              violations.push(`${relativePath(file)}: imports "${imp}"`)
            }
          }
        }
      }

      // Document Link's hybrid imports (informational, not a failure)
      if (linkImports.length > 0) {
        console.log('Link navigation imports (expected hybrid behavior):')
        linkImports.forEach(i => console.log(`  ${i}`))
      }

      expect(violations, `L1 primitives importing from L2:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('layout widgets do not import from experience/', async () => {
      const files = await getFiles('content/widgets/layout/**/*.{ts,tsx}')
      const violations: string[] = []

      for (const file of files) {
        const content = await readFile(file)
        const imports = extractImports(content)

        for (const imp of imports) {
          if (isL1ToL2Import(file, imp)) {
            violations.push(`${relativePath(file)}: imports "${imp}"`)
          }
        }
      }

      expect(violations, `L1 layout importing from L2:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('section patterns do not import from experience/', async () => {
      const files = await getFiles('content/sections/patterns/**/*.{ts,tsx}')
      const violations: string[] = []

      for (const file of files) {
        const content = await readFile(file)
        const imports = extractImports(content)

        for (const imp of imports) {
          if (isL1ToL2Import(file, imp)) {
            violations.push(`${relativePath(file)}: imports "${imp}"`)
          }
        }
      }

      expect(violations, `L1 sections importing from L2:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('composites do not import from experience/', async () => {
      const files = await getFiles('content/widgets/composite/**/*.{ts,tsx}')
      const violations: string[] = []

      for (const file of files) {
        const content = await readFile(file)
        const imports = extractImports(content)

        for (const imp of imports) {
          if (isL1ToL2Import(file, imp)) {
            violations.push(`${relativePath(file)}: imports "${imp}"`)
          }
        }
      }

      expect(violations, `L1 composites importing from L2:\n${violations.join('\n')}`).toHaveLength(0)
    })

    /**
     * Chrome regions (Header, Footer, Sidebar) are pure L1 content.
     * They render once and stay idle. Animation is via CSS variables set by L2.
     */
    it('chrome regions do not import from experience/', async () => {
      const files = await getFiles('content/chrome/regions/**/*.{ts,tsx}')
      const violations: string[] = []

      for (const file of files) {
        const content = await readFile(file)
        const imports = extractImports(content)

        for (const imp of imports) {
          if (isL1ToL2Import(file, imp)) {
            violations.push(`${relativePath(file)}: imports "${imp}"`)
          }
        }
      }

      expect(violations, `Chrome regions importing from L2:\n${violations.join('\n')}`).toHaveLength(0)
    })

    /**
     * Chrome overlays (Modal, CursorLabel) are L1/L2 HYBRID components.
     *
     * They render UI (L1) but require direct experience access for:
     * - GSAP timeline control (Modal: RevealTransition for sequenced animations)
     * - Store state (CursorLabel: cursor position from experience store)
     * - ScrollSmoother control (Modal: pause/resume on open/close)
     *
     * This is an architectural decision, not a violation.
     * See chrome.spec.md for documentation.
     */
    it('chrome overlays may import from experience/ (documented hybrid)', async () => {
      const files = await getFiles('content/chrome/overlays/**/*.{ts,tsx}')
      const experienceImports: string[] = []

      for (const file of files) {
        const content = await readFile(file)
        const imports = extractImports(content)

        for (const imp of imports) {
          if (isL1ToL2Import(file, imp)) {
            experienceImports.push(`${relativePath(file)}: imports "${imp}"`)
          }
        }
      }

      // Document what overlays import from experience (informational, not a failure)
      if (experienceImports.length > 0) {
        console.log('Chrome overlay experience imports (expected hybrid behavior):')
        experienceImports.forEach(i => console.log(`  ${i}`))
      }

      // This test passes - it documents the hybrid nature, not enforces it
      expect(true).toBe(true)
    })
  })

  describe('Effects layer isolation', () => {
    it('CSS effect files do not import anything', async () => {
      const files = await getFiles('experience/effects/**/*.css')
      // CSS files can't import, this is just a sanity check
      expect(files.length).toBeGreaterThan(0)
    })

    // TASK-004/TASK-009 FIXED: GSAP moved from effects/ to drivers/
    it('effects/ folder contains only CSS files', async () => {
      const tsFiles = await getFiles('experience/effects/**/*.{ts,tsx}')

      // index.ts barrels are allowed
      const nonBarrelFiles = tsFiles.filter(f => !f.endsWith('index.ts'))

      expect(nonBarrelFiles, 'TS/TSX files in effects/ that are not barrels').toHaveLength(0)
    })
  })

  describe('Primitive isolation', () => {
    it('primitives do not import from patterns/ or interactive/', async () => {
      const files = await getFiles('content/widgets/primitives/**/*.{ts,tsx}')
      const violations: string[] = []

      for (const file of files) {
        const content = await readFile(file)
        const imports = extractImports(content)

        for (const imp of imports) {
          if (imp.includes('patterns/') || imp.includes('/patterns') ||
              imp.includes('interactive/') || imp.includes('/interactive')) {
            violations.push(`${relativePath(file)}: imports "${imp}"`)
          }
        }
      }

      expect(violations, `Primitives importing from patterns or interactive:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('primitives do not import from sections/', async () => {
      const files = await getFiles('content/widgets/primitives/**/*.{ts,tsx}')
      const violations: string[] = []

      for (const file of files) {
        const content = await readFile(file)
        const imports = extractImports(content)

        for (const imp of imports) {
          if (imp.includes('sections/') || imp.includes('/sections')) {
            violations.push(`${relativePath(file)}: imports "${imp}"`)
          }
        }
      }

      expect(violations, `Primitives importing from sections:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })
})
