/**
 * Behaviour Validation Tests
 *
 * Validates behaviour architecture rules:
 * - All behaviours have `requires` array
 * - Behaviour IDs match folder structure (scroll/fade in scroll/ folder)
 * - Behaviours are registered in registry
 * - Behaviours don't import from effects/
 */

import { describe, it, expect } from 'vitest'
import {
  getFiles,
  readFile,
  relativePath,
  extractBehaviourId,
  hasRequiresArray,
  extractImports,
} from './helpers'

describe('Behaviour Validation', () => {
  // TASK-002 FIXED: All behaviours now have requires array
  describe('Required fields', () => {
    it('all behaviours have requires array', async () => {
      const files = await getFiles('experience/behaviours/**/*.ts')
      const behaviourFiles = files.filter(f =>
        !f.endsWith('index.ts') &&
        !f.endsWith('types.ts') &&
        !f.endsWith('registry.ts') &&
        !f.endsWith('resolve.ts') &&
        !f.includes('BehaviourWrapper')
      )

      const violations: string[] = []

      for (const file of behaviourFiles) {
        const content = await readFile(file)

        // Skip if not a behaviour definition
        if (!content.includes('registerBehaviour') && !content.includes('id:')) {
          continue
        }

        if (!hasRequiresArray(content)) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `Behaviours missing requires array:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('all behaviours have compute() function', async () => {
      const files = await getFiles('experience/behaviours/**/*.ts')
      const behaviourFiles = files.filter(f =>
        !f.endsWith('index.ts') &&
        !f.endsWith('types.ts') &&
        !f.endsWith('registry.ts') &&
        !f.endsWith('resolve.ts') &&
        !f.includes('BehaviourWrapper')
      )

      const violations: string[] = []

      for (const file of behaviourFiles) {
        const content = await readFile(file)

        // Skip if not a behaviour definition
        if (!content.includes('registerBehaviour') && !content.includes('id:')) {
          continue
        }

        // Check for compute function
        if (!content.includes('compute:') && !content.includes('compute(')) {
          violations.push(relativePath(file))
        }
      }

      if (violations.length > 0) {
        console.log('Behaviours missing compute():')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations, `Behaviours missing compute() function:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Behaviour ID naming', () => {
    it('behaviour IDs match folder structure', async () => {
      const folders = ['scroll', 'hover', 'visibility', 'animation']
      const violations: string[] = []

      for (const folder of folders) {
        const files = await getFiles(`experience/behaviours/${folder}/*.ts`)
        const behaviourFiles = files.filter(f => !f.endsWith('index.ts'))

        for (const file of behaviourFiles) {
          const content = await readFile(file)
          const id = extractBehaviourId(content)

          if (id && !id.startsWith(`${folder}/`)) {
            violations.push(`${relativePath(file)}: id "${id}" should start with "${folder}/"`)
          }
        }
      }

      expect(violations, `Behaviour ID mismatches:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('behaviour IDs are kebab-case', async () => {
      const files = await getFiles('experience/behaviours/**/*.ts')
      const behaviourFiles = files.filter(f =>
        !f.endsWith('index.ts') &&
        !f.endsWith('types.ts') &&
        !f.endsWith('registry.ts') &&
        !f.endsWith('resolve.ts') &&
        !f.includes('BehaviourWrapper')
      )

      const violations: string[] = []

      for (const file of behaviourFiles) {
        const content = await readFile(file)
        const id = extractBehaviourId(content)

        if (id) {
          // Check kebab-case: lowercase letters, numbers, hyphens, and slashes
          if (!/^[a-z][a-z0-9\-\/]*$/.test(id)) {
            violations.push(`${relativePath(file)}: id "${id}" is not kebab-case`)
          }
        }
      }

      expect(violations, `Non-kebab-case IDs:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Behaviour imports', () => {
    it('behaviours do not import from effects/', async () => {
      const files = await getFiles('experience/behaviours/**/*.ts')
      const violations: string[] = []

      for (const file of files) {
        const content = await readFile(file)
        const imports = extractImports(content)

        for (const imp of imports) {
          if (imp.includes('effects/') || imp.includes('/effects')) {
            violations.push(`${relativePath(file)}: imports "${imp}"`)
          }
        }
      }

      expect(violations, `Behaviours importing from effects:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('behaviours do not import from content/', async () => {
      const files = await getFiles('experience/behaviours/**/*.ts')
      const violations: string[] = []

      for (const file of files) {
        const content = await readFile(file)
        const imports = extractImports(content)

        for (const imp of imports) {
          // Check for imports from content folder (not local files like ./content-reveal)
          // Match: ../content/, ../../content/, /content/, content/
          // Don't match: ./content-reveal (local relative import)
          if ((imp.includes('content/') || imp.match(/\/content['"]/)) && !imp.startsWith('./')) {
            violations.push(`${relativePath(file)}: imports "${imp}"`)
          }
        }
      }

      expect(violations, `Behaviours importing from content:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Behaviour structure', () => {
    it('each behaviour folder has an index.ts barrel', async () => {
      const folders = ['scroll', 'hover', 'visibility', 'animation']
      const missing: string[] = []

      for (const folder of folders) {
        const indexFiles = await getFiles(`experience/behaviours/${folder}/index.ts`)
        if (indexFiles.length === 0) {
          missing.push(`experience/behaviours/${folder}/index.ts`)
        }
      }

      expect(missing, `Missing barrel files:\n${missing.join('\n')}`).toHaveLength(0)
    })
  })
})
