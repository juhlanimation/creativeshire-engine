/**
 * Behaviour Validation Tests
 *
 * Validates behaviour architecture rules:
 * - All behaviours have folder with index.ts + meta.ts
 * - All behaviours have `requires` array
 * - Behaviour IDs match folder structure (scroll/fade in scroll/ folder)
 * - Behaviours are registered in registry
 * - Behaviours don't import from effects/
 * - Meta files use defineBehaviourMeta()
 * - Settings entries have type/label/default
 * - Category matches parent trigger folder
 * - getAllBehaviourMetas() returns all behaviours
 * - No orphaned registry entries
 */

import { describe, it, expect } from 'vitest'
import {
  getFiles,
  getFolders,
  readFile,
  relativePath,
  fileExists,
  extractBehaviourId,
  hasRequiresArray,
  extractImports,
  validateMetaFileContent,
  validateSettingsContent,
} from './helpers'
import path from 'path'

// Import barrel to trigger auto-registration of all behaviours
import '../../engine/experience/behaviours'

// Import registry functions
import {
  getBehaviourIds,
  getAllBehaviourMetas,
  getBehavioursByCategory,
  getBehaviour,
} from '../../engine/experience/behaviours/registry'

const ENGINE = path.join(process.cwd(), 'engine')
const BEHAVIOUR_TRIGGERS = ['scroll', 'hover', 'visibility', 'animation', 'interaction', 'video', 'intro']

describe('Behaviour Validation', () => {
  describe('Folder structure', () => {
    it('every behaviour is a folder with index.ts + meta.ts', async () => {
      const missingIndex: string[] = []
      const missingMeta: string[] = []

      for (const trigger of BEHAVIOUR_TRIGGERS) {
        const folders = await getFolders(`experience/behaviours/${trigger}/*`)

        for (const folder of folders) {
          const name = path.basename(folder)
          const indexPath = path.join(folder, 'index.ts')
          const metaPath = path.join(folder, 'meta.ts')

          if (!(await fileExists(indexPath))) {
            missingIndex.push(`experience/behaviours/${trigger}/${name}/index.ts`)
          }
          if (!(await fileExists(metaPath))) {
            missingMeta.push(`experience/behaviours/${trigger}/${name}/meta.ts`)
          }
        }
      }

      expect(missingIndex, `Behaviour folders missing index.ts:\n${missingIndex.join('\n')}`).toHaveLength(0)
      expect(missingMeta, `Behaviour folders missing meta.ts:\n${missingMeta.join('\n')}`).toHaveLength(0)
    })

    it('behaviour folders are kebab-case', async () => {
      const violations: string[] = []

      for (const trigger of BEHAVIOUR_TRIGGERS) {
        const folders = await getFolders(`experience/behaviours/${trigger}/*`)

        for (const folder of folders) {
          const name = path.basename(folder)
          if (!/^[a-z][a-z0-9-]*$/.test(name)) {
            violations.push(`experience/behaviours/${trigger}/${name}: not kebab-case`)
          }
        }
      }

      expect(violations, `Non-kebab-case behaviour folders:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Meta validation', () => {
    it('all meta.ts files use defineBehaviourMeta()', async () => {
      const violations: string[] = []

      for (const trigger of BEHAVIOUR_TRIGGERS) {
        const metaFiles = await getFiles(`experience/behaviours/${trigger}/*/meta.ts`)

        for (const file of metaFiles) {
          const content = await readFile(file)
          const rel = relativePath(file)
          violations.push(...validateMetaFileContent(content, rel, 'defineBehaviourMeta'))
        }
      }

      expect(violations, `Behaviour meta validation failures:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('meta category matches parent trigger folder', async () => {
      const violations: string[] = []

      for (const trigger of BEHAVIOUR_TRIGGERS) {
        const metaFiles = await getFiles(`experience/behaviours/${trigger}/*/meta.ts`)

        for (const file of metaFiles) {
          const content = await readFile(file)
          const rel = relativePath(file)
          const categoryMatch = content.match(/category:\s*['"](\w+)['"]/)

          if (categoryMatch) {
            const category = categoryMatch[1]
            if (category !== trigger) {
              violations.push(`${rel}: category '${category}' should be '${trigger}'`)
            }
          }
        }
      }

      expect(violations, `Category mismatches:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('meta settings entries have type, label, and default', async () => {
      const violations: string[] = []

      for (const trigger of BEHAVIOUR_TRIGGERS) {
        const metaFiles = await getFiles(`experience/behaviours/${trigger}/*/meta.ts`)

        for (const file of metaFiles) {
          const content = await readFile(file)
          const rel = relativePath(file)
          violations.push(...validateSettingsContent(content, rel))
        }
      }

      expect(violations, `Behaviour settings missing type/label/default:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Required fields', () => {
    it('all behaviours have requires array', async () => {
      const violations: string[] = []

      for (const trigger of BEHAVIOUR_TRIGGERS) {
        const indexFiles = await getFiles(`experience/behaviours/${trigger}/*/index.ts`)

        for (const file of indexFiles) {
          const content = await readFile(file)

          // Skip if not a behaviour definition (barrel file)
          if (!content.includes('registerBehaviour') && !content.includes('compute:')) continue

          if (!hasRequiresArray(content)) {
            violations.push(relativePath(file))
          }
        }
      }

      expect(violations, `Behaviours missing requires array:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('all behaviours have compute() function', async () => {
      const violations: string[] = []

      for (const trigger of BEHAVIOUR_TRIGGERS) {
        const indexFiles = await getFiles(`experience/behaviours/${trigger}/*/index.ts`)

        for (const file of indexFiles) {
          const content = await readFile(file)

          // Skip if not a behaviour definition
          if (!content.includes('registerBehaviour')) continue

          if (!content.includes('compute:') && !content.includes('compute(')) {
            violations.push(relativePath(file))
          }
        }
      }

      expect(violations, `Behaviours missing compute() function:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Behaviour ID naming', () => {
    it('behaviour IDs match folder structure', async () => {
      const violations: string[] = []

      for (const trigger of BEHAVIOUR_TRIGGERS) {
        const metaFiles = await getFiles(`experience/behaviours/${trigger}/*/meta.ts`)

        for (const file of metaFiles) {
          const content = await readFile(file)
          const id = extractBehaviourId(content)

          if (id && !id.startsWith(`${trigger}/`)) {
            violations.push(`${relativePath(file)}: id "${id}" should start with "${trigger}/"`)
          }
        }
      }

      expect(violations, `Behaviour ID mismatches:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('behaviour IDs are kebab-case', async () => {
      const violations: string[] = []

      for (const trigger of BEHAVIOUR_TRIGGERS) {
        const metaFiles = await getFiles(`experience/behaviours/${trigger}/*/meta.ts`)

        for (const file of metaFiles) {
          const content = await readFile(file)
          const id = extractBehaviourId(content)

          if (id) {
            if (!/^[a-z][a-z0-9\-\/]*$/.test(id)) {
              violations.push(`${relativePath(file)}: id "${id}" is not kebab-case`)
            }
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
          if ((imp.includes('content/') || imp.match(/\/content['"]/)) && !imp.startsWith('./')) {
            violations.push(`${relativePath(file)}: imports "${imp}"`)
          }
        }
      }

      expect(violations, `Behaviours importing from content:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Behaviour structure', () => {
    it('each trigger folder has an index.ts barrel', async () => {
      const missing: string[] = []

      for (const trigger of BEHAVIOUR_TRIGGERS) {
        const indexFiles = await getFiles(`experience/behaviours/${trigger}/index.ts`)
        if (indexFiles.length === 0) {
          missing.push(`experience/behaviours/${trigger}/index.ts`)
        }
      }

      expect(missing, `Missing barrel files:\n${missing.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Registry completeness', () => {
    it('getAllBehaviourMetas() returns all behaviours', async () => {
      // Count all behaviour folders across all triggers
      let totalFolders = 0
      for (const trigger of BEHAVIOUR_TRIGGERS) {
        const folders = await getFolders(`experience/behaviours/${trigger}/*`)
        totalFolders += folders.length
      }

      const metas = getAllBehaviourMetas()
      expect(
        metas.length,
        `Expected ${totalFolders} behaviour metas, got ${metas.length}. Missing: ${
          totalFolders - metas.length
        }`
      ).toBe(totalFolders)
    })

    it('all behaviour metas have id, name, description, category', () => {
      const metas = getAllBehaviourMetas()
      const violations: string[] = []

      for (const meta of metas) {
        if (!meta.id) violations.push(`Meta missing id`)
        if (!meta.name) violations.push(`Meta "${meta.id}" missing name`)
        if (!meta.description) violations.push(`Meta "${meta.id}" missing description`)
        if (!meta.category) violations.push(`Meta "${meta.id}" missing category`)
      }

      expect(violations, `Behaviour meta validation:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('no orphaned behaviour registry entries', async () => {
      // Collect all behaviour folder IDs from filesystem
      const folderIds = new Set<string>()
      for (const trigger of BEHAVIOUR_TRIGGERS) {
        const folders = await getFolders(`experience/behaviours/${trigger}/*`)
        for (const folder of folders) {
          const name = path.basename(folder)
          folderIds.add(`${trigger}/${name}`)
        }
      }

      // Compare against registry
      const registryIds = getBehaviourIds()
      const orphaned = registryIds.filter((id) => !folderIds.has(id))

      expect(
        orphaned,
        `Orphaned behaviour registry entries (no folder):\n${orphaned.join('\n')}`
      ).toHaveLength(0)
    })

    it('all behaviour folders are registered', async () => {
      const registryIds = new Set(getBehaviourIds())
      const unregistered: string[] = []

      for (const trigger of BEHAVIOUR_TRIGGERS) {
        const folders = await getFolders(`experience/behaviours/${trigger}/*`)
        for (const folder of folders) {
          const name = path.basename(folder)
          const expectedId = `${trigger}/${name}`
          if (!registryIds.has(expectedId)) {
            unregistered.push(expectedId)
          }
        }
      }

      expect(
        unregistered,
        `Behaviour folders not registered:\n${unregistered.join('\n')}`
      ).toHaveLength(0)
    })

    it('behaviour category matches trigger group', () => {
      const violations: string[] = []

      for (const trigger of BEHAVIOUR_TRIGGERS) {
        const behaviours = getBehavioursByCategory(trigger as any)

        for (const b of behaviours) {
          if (!b.id.startsWith(`${trigger}/`)) {
            violations.push(`${b.id}: in category '${trigger}' but ID doesn't match`)
          }
        }
      }

      expect(violations, `Category/ID mismatches:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Settings drift', () => {
    it('behaviour settings match meta.ts settings (no drift)', async () => {
      const violations: string[] = []

      for (const trigger of BEHAVIOUR_TRIGGERS) {
        const metaFiles = await getFiles(`experience/behaviours/${trigger}/*/meta.ts`)

        for (const file of metaFiles) {
          const metaContent = await readFile(file)
          const folder = path.dirname(file)
          const indexPath = path.join(folder, 'index.ts')

          if (!(await fileExists(indexPath))) continue
          const indexContent = await readFile(indexPath)

          // Check that index.ts uses ...meta spread (which includes settings from meta.ts)
          if (!indexContent.includes('...meta')) {
            // If no spread, check if settings are defined separately
            const metaHasSettings = metaContent.includes('settings:')
            const indexHasSettings = indexContent.includes('settings:')

            if (metaHasSettings && !indexHasSettings) {
              violations.push(`${relativePath(indexPath)}: meta.ts has settings but index.ts doesn't use ...meta spread`)
            }
          }
        }
      }

      expect(violations, `Settings drift detected:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })
})
