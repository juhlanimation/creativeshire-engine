/**
 * Widget Structure Validation Tests
 *
 * Validates widget architecture rules:
 * - Primitives have no React state (useState/useReducer)
 * - Layout widgets use widgets array, not children
 * - Composites are assemblies of Layout + Primitives
 * - Proper barrel exports
 */

import { describe, it, expect } from 'vitest'
import {
  getFiles,
  readFile,
  relativePath,
  hasReactState,
  extractImports,
} from './helpers'

describe('Widget Structure Validation', () => {
  describe('Primitives', () => {
    // Primitives should be stateless - no React state hooks
    describe('No React state', () => {
      it('primitives do not use useState or useReducer', async () => {
        const files = await getFiles('content/widgets/primitives/**/*.tsx')
        const violations: string[] = []

        for (const file of files) {
          const content = await readFile(file)

          if (hasReactState(content)) {
            violations.push(relativePath(file))
          }
        }

        expect(violations, `Primitives with React state:\\n${violations.join('\\n')}`).toHaveLength(0)
      })
    })

    it('primitives folder has index.ts barrel', async () => {
      const indexFiles = await getFiles('content/widgets/primitives/index.ts')
      expect(indexFiles.length, 'Missing primitives/index.ts').toBeGreaterThan(0)
    })

    it('primitives do not have onClick handlers', async () => {
      const files = await getFiles('content/widgets/primitives/**/*.tsx')
      const violations: string[] = []

      // All primitives should avoid onClick - use BehaviourWrapper for event handling
      // This ensures RSC (React Server Components) serialization compatibility

      for (const file of files) {
        const content = await readFile(file)

        // Check for onClick props
        if (/onClick\s*[=:]/.test(content)) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `Primitives with onClick (use BehaviourWrapper instead):\\n${violations.join('\\n')}`).toHaveLength(0)
    })
  })

  describe('Layout widgets', () => {
    // TASK-005 FIXED: Layout widgets use widgets: WidgetSchema[]
    describe('Schema-driven rendering', () => {
      it('layout widgets accept widgets array prop', async () => {
        const files = await getFiles('content/widgets/layout/**/*.tsx')
        const layoutFiles = files.filter(f => !f.endsWith('index.tsx') && !f.endsWith('index.ts'))
        const violations: string[] = []

        for (const file of layoutFiles) {
          const content = await readFile(file)

          // Should have widgets: Widget[] in props
          if (!content.includes('widgets:') && !content.includes('widgets?:')) {
            violations.push(relativePath(file))
          }
        }

        expect(violations, `Layouts missing widgets prop:\\n${violations.join('\\n')}`).toHaveLength(0)
      })

      it('layout widgets do not use React children', async () => {
        const files = await getFiles('content/widgets/layout/**/*.tsx')
        const layoutFiles = files.filter(f => !f.endsWith('index.tsx') && !f.endsWith('index.ts'))
        const violations: string[] = []

        for (const file of layoutFiles) {
          const content = await readFile(file)

          // Should not use {children} or props.children
          if (/\{children\}|props\.children/.test(content)) {
            violations.push(relativePath(file))
          }
        }

        expect(violations, `Layouts using children:\\n${violations.join('\\n')}`).toHaveLength(0)
      })
    })

    it('layout folder has index.ts barrel', async () => {
      const indexFiles = await getFiles('content/widgets/layout/index.ts')
      expect(indexFiles.length, 'Missing layout/index.ts').toBeGreaterThan(0)
    })
  })

  describe('Composites', () => {
    /**
     * Component CSS is ALLOWED for structural styling (display, layout, positioning).
     * What's NOT allowed: @keyframes - animations belong in effects/ folder.
     */
    it('composite CSS has no @keyframes (animations belong in effects/)', async () => {
      const cssFiles = await getFiles('content/widgets/composite/**/*.css')
      const violations: string[] = []

      for (const file of cssFiles) {
        const content = await readFile(file)
        if (/@keyframes\s/.test(content)) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `@keyframes in composites (use effects/):\\n${violations.join('\\n')}`).toHaveLength(0)
    })

    it('composites folder has index.ts barrel', async () => {
      const indexFiles = await getFiles('content/widgets/composite/index.ts')
      expect(indexFiles.length, 'Missing composite/index.ts').toBeGreaterThan(0)
    })

    /**
     * Composites use schema-based composition:
     * - Factory composites (createProjectCard) return WidgetSchema referencing primitives/layouts
     * - React composites (Video, VideoPlayer) can import other composites
     * This test validates that factory files (not hooks) reference the widget types.
     */
    it('factory composites return WidgetSchema (not React components)', async () => {
      const files = await getFiles('content/widgets/composite/**/*.ts')
      const factoryFiles = files.filter(f =>
        !f.endsWith('index.ts') &&
        !f.endsWith('.tsx') &&
        !f.includes('types') &&
        !f.includes('hooks/') &&
        !f.includes('/hooks') &&
        !f.includes('use') // Exclude hook files like useVisibilityPlayback.ts
      )

      // Factory files should export functions that return WidgetSchema
      for (const file of factoryFiles) {
        const content = await readFile(file)
        // Should reference WidgetSchema type
        if (content.includes('export function') || content.includes('export const')) {
          expect(
            content.includes('WidgetSchema') || content.includes('Widget'),
            `${relativePath(file)} should return WidgetSchema`
          ).toBe(true)
        }
      }
    })
  })

  describe('Section patterns', () => {
    it('sections folder has index.ts barrel', async () => {
      const indexFiles = await getFiles('content/sections/index.ts')
      expect(indexFiles.length, 'Missing sections/index.ts').toBeGreaterThan(0)
    })

    it('section patterns folder has index.ts barrel', async () => {
      const indexFiles = await getFiles('content/sections/patterns/index.ts')
      expect(indexFiles.length, 'Missing sections/patterns/index.ts').toBeGreaterThan(0)
    })
  })

  describe('Chrome regions', () => {
    it('chrome folder has index.ts barrel', async () => {
      const indexFiles = await getFiles('content/chrome/index.ts')
      expect(indexFiles.length, 'Missing chrome/index.ts').toBeGreaterThan(0)
    })

    it('chrome regions folder exists', async () => {
      const regionFiles = await getFiles('content/chrome/regions/**/*.tsx')
      expect(regionFiles.length, 'No region files in chrome/regions/').toBeGreaterThan(0)
    })
  })
})
