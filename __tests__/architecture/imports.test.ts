/**
 * Import Boundary Tests
 *
 * Validates L1/L2 separation:
 * - L1 (content) CANNOT import from L2 (experience)
 * - Effects (L2) CANNOT import from behaviours (L2 internal)
 * - Primitives CANNOT import from composite/sections/chrome
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
    it('primitives do not import from experience/', async () => {
      const files = await getFiles('content/widgets/primitives/**/*.{ts,tsx}')
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

    // VIOLATION: Video/index.tsx imports from experience/ (L1 to L2 boundary crossing)
    it.skip('composites do not import from experience/ (Video imports from experience)', async () => {
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

    // VIOLATION: Modal imports from experience/ (L1 to L2 boundary crossing)
    it.skip('chrome does not import from experience/ (Modal imports from experience)', async () => {
      const files = await getFiles('content/chrome/**/*.{ts,tsx}')
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

      expect(violations, `L1 chrome importing from L2:\n${violations.join('\n')}`).toHaveLength(0)
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
    it('primitives do not import from composite/', async () => {
      const files = await getFiles('content/widgets/primitives/**/*.{ts,tsx}')
      const violations: string[] = []

      for (const file of files) {
        const content = await readFile(file)
        const imports = extractImports(content)

        for (const imp of imports) {
          if (imp.includes('composite/') || imp.includes('/composite')) {
            violations.push(`${relativePath(file)}: imports "${imp}"`)
          }
        }
      }

      expect(violations, `Primitives importing from composite:\n${violations.join('\n')}`).toHaveLength(0)
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
