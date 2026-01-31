/**
 * ComponentMeta Validation Tests
 *
 * Validates that every component has a meta.ts file with proper structure:
 * - Every widget (primitive, layout, pattern, interactive) has meta.ts
 * - Every section pattern has meta.ts
 * - Every chrome component has meta.ts
 * - Patterns have component: false
 * - Interactive/primitives/layouts have component: true
 * - The old composite/ folder no longer exists
 */

import { describe, it, expect } from 'vitest'
import { getFiles, readFile, relativePath, fileExists } from './helpers'
import path from 'path'

const CREATIVESHIRE = path.join(process.cwd(), 'creativeshire')

describe('ComponentMeta Validation', () => {
  describe('Widget meta.ts files', () => {
    it('every primitive widget has meta.ts', async () => {
      const componentDirs = await getFiles('content/widgets/primitives/*/')
      const missing: string[] = []

      for (const dir of componentDirs) {
        const metaPath = path.join(dir, 'meta.ts')
        if (!(await fileExists(metaPath))) {
          missing.push(relativePath(dir))
        }
      }

      expect(missing, `Primitives missing meta.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('every layout widget has meta.ts', async () => {
      const componentDirs = await getFiles('content/widgets/layout/*/')
      const missing: string[] = []

      for (const dir of componentDirs) {
        const metaPath = path.join(dir, 'meta.ts')
        if (!(await fileExists(metaPath))) {
          missing.push(relativePath(dir))
        }
      }

      expect(missing, `Layouts missing meta.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('every pattern widget has meta.ts', async () => {
      const componentDirs = await getFiles('content/widgets/patterns/*/')
      const missing: string[] = []

      for (const dir of componentDirs) {
        const metaPath = path.join(dir, 'meta.ts')
        if (!(await fileExists(metaPath))) {
          missing.push(relativePath(dir))
        }
      }

      expect(missing, `Patterns missing meta.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('every interactive widget has meta.ts', async () => {
      const componentDirs = await getFiles('content/widgets/interactive/*/')
      const missing: string[] = []

      for (const dir of componentDirs) {
        const metaPath = path.join(dir, 'meta.ts')
        if (!(await fileExists(metaPath))) {
          missing.push(relativePath(dir))
        }
      }

      expect(missing, `Interactive widgets missing meta.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Pattern meta.ts validation', () => {
    it('pattern widgets have component: false', async () => {
      const metaFiles = await getFiles('content/widgets/patterns/*/meta.ts')
      const violations: string[] = []

      for (const file of metaFiles) {
        const content = await readFile(file)

        // Should have component: false since patterns are factory functions
        if (!content.includes('component: false')) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `Patterns missing component: false:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Interactive meta.ts validation', () => {
    it('interactive widgets have component: true', async () => {
      const metaFiles = await getFiles('content/widgets/interactive/*/meta.ts')
      const violations: string[] = []

      for (const file of metaFiles) {
        const content = await readFile(file)

        // Should have component: true since interactive are React components
        if (!content.includes('component: true')) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `Interactive widgets missing component: true:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Section meta.ts files', () => {
    it('every section pattern has meta.ts', async () => {
      const componentDirs = await getFiles('content/sections/patterns/*/')
      const missing: string[] = []

      for (const dir of componentDirs) {
        const metaPath = path.join(dir, 'meta.ts')
        if (!(await fileExists(metaPath))) {
          missing.push(relativePath(dir))
        }
      }

      expect(missing, `Section patterns missing meta.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Chrome meta.ts files', () => {
    it('every chrome region has meta.ts', async () => {
      const componentDirs = await getFiles('content/chrome/regions/*/')
      const missing: string[] = []

      for (const dir of componentDirs) {
        const metaPath = path.join(dir, 'meta.ts')
        if (!(await fileExists(metaPath))) {
          missing.push(relativePath(dir))
        }
      }

      expect(missing, `Chrome regions missing meta.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('every chrome overlay has meta.ts', async () => {
      const componentDirs = await getFiles('content/chrome/overlays/*/')
      const missing: string[] = []

      for (const dir of componentDirs) {
        const metaPath = path.join(dir, 'meta.ts')
        if (!(await fileExists(metaPath))) {
          missing.push(relativePath(dir))
        }
      }

      expect(missing, `Chrome overlays missing meta.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Widget structure', () => {
    it('composite/ folder no longer exists', async () => {
      const compositeFiles = await getFiles('content/widgets/composite/**/*')

      expect(
        compositeFiles.length,
        'composite/ folder should be renamed to patterns/ and interactive/'
      ).toBe(0)
    })

    it('patterns/ folder contains factory functions only', async () => {
      const patternDirs = await getFiles('content/widgets/patterns/*/')
      const violations: string[] = []

      for (const dir of patternDirs) {
        // Check for index.ts (factory) vs index.tsx (React component)
        const hasFactoryIndex = await fileExists(path.join(dir, 'index.ts'))
        const hasReactIndex = await fileExists(path.join(dir, 'index.tsx'))

        // Patterns should have index.ts, not index.tsx
        if (hasReactIndex && !hasFactoryIndex) {
          violations.push(`${relativePath(dir)}: has index.tsx instead of index.ts`)
        }
      }

      expect(violations, `Patterns with React components (should be in interactive/):\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('interactive/ folder contains React components only', async () => {
      const interactiveDirs = await getFiles('content/widgets/interactive/*/')
      const violations: string[] = []

      for (const dir of interactiveDirs) {
        // Check for index.tsx (React component)
        const hasReactIndex = await fileExists(path.join(dir, 'index.tsx'))

        if (!hasReactIndex) {
          violations.push(`${relativePath(dir)}: missing index.tsx`)
        }
      }

      expect(violations, `Interactive widgets missing index.tsx:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Meta structure validation', () => {
    it('all meta.ts files export const meta', async () => {
      const metaFiles = await getFiles('content/**/meta.ts')
      const violations: string[] = []

      for (const file of metaFiles) {
        const content = await readFile(file)

        if (!content.includes('export const meta')) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `Meta files missing 'export const meta':\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('all meta.ts files have required fields', async () => {
      const metaFiles = await getFiles('content/**/meta.ts')
      const violations: string[] = []

      const requiredFields = ['id:', 'name:', 'description:', 'category:']

      for (const file of metaFiles) {
        const content = await readFile(file)

        for (const field of requiredFields) {
          if (!content.includes(field)) {
            violations.push(`${relativePath(file)}: missing ${field}`)
          }
        }
      }

      expect(violations, `Meta files missing required fields:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })
})
