/**
 * Widget Structure Validation Tests
 *
 * Validates widget architecture rules:
 * - Primitives have no React state (useState/useReducer)
 * - Layout widgets use widgets array, not children
 * - Interactive widgets are React components with state
 * - Proper barrel exports
 */

import { describe, it, expect } from 'vitest'
import {
  getFiles,
  readFile,
  relativePath,
  hasReactState,
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

    /**
     * Most primitives should avoid onClick - use BehaviourWrapper for event handling.
     * This ensures RSC (React Server Components) serialization compatibility.
     *
     * Exception: Link requires onClick for navigation interception.
     * Link intercepts clicks to run exit transitions before navigation.
     * This is fundamental to page transition coordination.
     */
    it('primitives do not have onClick handlers (except Link)', async () => {
      const files = await getFiles('content/widgets/primitives/**/*.tsx')
      const violations: string[] = []

      for (const file of files) {
        // Link is allowed onClick for navigation interception
        if (file.includes('/Link/')) continue

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

  describe('Interactive widgets', () => {
    /**
     * Interactive widgets are React components with internal state,
     * complex event handling, or multiple render modes.
     * - React Component Pattern (index.tsx) - CAN have CSS
     */

    it('interactive folder has index.ts barrel', async () => {
      const indexFiles = await getFiles('content/widgets/interactive/index.ts')
      expect(indexFiles.length, 'Missing interactive/index.ts').toBeGreaterThan(0)
    })

    it('interactive widgets are React components (index.tsx)', async () => {
      const dirs = await getFiles('content/widgets/interactive/*/')
      const violations: string[] = []

      for (const dir of dirs) {
        const files = await getFiles(`content/widgets/interactive/${dir.split(/[\\/]/).pop()}/*.tsx`)
        const hasReactComponent = files.some(f => f.endsWith('index.tsx'))

        if (!hasReactComponent) {
          violations.push(relativePath(dir))
        }
      }

      expect(violations, `Interactive widgets missing index.tsx:\\n${violations.join('\\n')}`).toHaveLength(0)
    })

    it('interactive widget props extend WidgetBaseProps', async () => {
      const typeFiles = await getFiles('content/widgets/interactive/*/types.ts')
      const violations: string[] = []

      for (const file of typeFiles) {
        const content = await readFile(file)

        // Check if file imports WidgetBaseProps
        const importsWidgetBaseProps = content.includes('WidgetBaseProps')

        // Check if the main props interface extends it
        // Pattern: "interface XxxProps extends WidgetBaseProps" or "extends WidgetBaseProps {"
        const extendsWidgetBaseProps = /extends\s+WidgetBaseProps/.test(content)

        if (!importsWidgetBaseProps || !extendsWidgetBaseProps) {
          violations.push(`${relativePath(file)}: Props should extend WidgetBaseProps`)
        }
      }

      if (violations.length > 0) {
        console.log('Widget props not extending WidgetBaseProps:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
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

  describe('Chrome', () => {
    it('chrome folder has index.ts barrel', async () => {
      const indexFiles = await getFiles('content/chrome/index.ts')
      expect(indexFiles.length, 'Missing chrome/index.ts').toBeGreaterThan(0)
    })
  })
})
