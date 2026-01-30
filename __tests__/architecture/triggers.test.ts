/**
 * Trigger Validation Tests
 *
 * Validates trigger architecture rules:
 * - All triggers have SSR guards (typeof window)
 * - Triggers clean up event listeners
 * - Triggers are properly typed
 */

import { describe, it, expect } from 'vitest'
import {
  getFiles,
  readFile,
  relativePath,
  hasSSRGuard,
  extractImports,
} from './helpers'

describe('Trigger Validation', () => {
  // TASK-003 FIXED: SSR guards added to triggers
  describe('SSR Safety', () => {
    it('all triggers have SSR guards', async () => {
      const files = await getFiles('experience/triggers/**/*.ts')
      const triggerFiles = files.filter(f =>
        !f.endsWith('index.ts') &&
        !f.endsWith('types.ts')
      )

      const violations: string[] = []

      for (const file of triggerFiles) {
        const content = await readFile(file)

        // Skip type-only files
        if (!content.includes('window') && !content.includes('document')) {
          continue
        }

        if (!hasSSRGuard(content)) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `Triggers missing SSR guard:\\n${violations.join('\\n')}`).toHaveLength(0)
    })
  })

  describe('Trigger structure', () => {
    it('triggers folder has index.ts barrel', async () => {
      const indexFiles = await getFiles('experience/triggers/index.ts')
      expect(indexFiles.length, 'Missing experience/triggers/index.ts').toBeGreaterThan(0)
    })

    it('triggers do not import from content/', async () => {
      const files = await getFiles('experience/triggers/**/*.ts')
      const violations: string[] = []

      for (const file of files) {
        const content = await readFile(file)
        const imports = extractImports(content)

        for (const imp of imports) {
          if (imp.includes('content/') || imp.includes('/content')) {
            violations.push(`${relativePath(file)}: imports "${imp}"`)
          }
        }
      }

      expect(violations, `Triggers importing from content:\\n${violations.join('\\n')}`).toHaveLength(0)
    })

    it('triggers do not import from behaviours/', async () => {
      const files = await getFiles('experience/triggers/**/*.ts')
      const violations: string[] = []

      for (const file of files) {
        const content = await readFile(file)
        const imports = extractImports(content)

        for (const imp of imports) {
          if (imp.includes('behaviours/') || imp.includes('/behaviours')) {
            violations.push(`${relativePath(file)}: imports "${imp}"`)
          }
        }
      }

      expect(violations, `Triggers importing from behaviours:\\n${violations.join('\\n')}`).toHaveLength(0)
    })
  })

  describe('Event listener cleanup', () => {
    it('triggers with addEventListener have removeEventListener', async () => {
      const files = await getFiles('experience/triggers/**/*.ts')
      const violations: string[] = []

      for (const file of files) {
        const content = await readFile(file)

        const addCount = (content.match(/addEventListener/g) || []).length
        const removeCount = (content.match(/removeEventListener/g) || []).length

        // If there are more adds than removes, that's a potential leak
        if (addCount > 0 && removeCount < addCount) {
          violations.push(`${relativePath(file)}: ${addCount} addEventListener, ${removeCount} removeEventListener`)
        }
      }

      expect(violations, `Potential event listener leaks:\\n${violations.join('\\n')}`).toHaveLength(0)
    })
  })
})
