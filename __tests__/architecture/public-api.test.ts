/**
 * Public API Validation Tests
 *
 * Validates that all registries are accessible through public barrel exports.
 * This catches the class of bug where internal registrations work but the
 * platform team can't access them because barrel re-exports are missing.
 *
 * RULE: Tests import from PUBLIC barrels only (the same paths the platform uses).
 * If it's not importable from a barrel, the platform can't use it.
 */

import { describe, it, expect } from 'vitest'
import { readFile, getFiles } from './helpers'
import fg from 'fast-glob'
import path from 'path'
import fs from 'fs/promises'

const ROOT = process.cwd()
const ENGINE = path.join(ROOT, 'engine')

// ==========================================================================
// Import from PUBLIC barrels — same paths the platform team uses
// ==========================================================================

// Content barrels
import {
  widgetRegistry,
  getWidget,
  getAllWidgetMeta,
} from '../../engine/content/widgets'

import {
  getSectionPattern,
  getAllSectionMetas,
} from '../../engine/content/sections'

import {
  getChromeComponent,
  getAllChromeMetas,
  getChromeComponentIds,
} from '../../engine/content/chrome'

// Experience barrel
import {
  // Experiences
  getExperienceIds,
  getAllExperienceMetas,
  // Behaviours
  behaviourRegistry,
  getBehaviour,
  getBehaviourIds,
  getAllBehaviourMetas,
  getBehavioursByCategory,
  // Transitions
  getPageTransitionIds,
  getAllPageTransitionMetas,
} from '../../engine/experience'

// Also verify the direct subpath barrel works
import {
  getBehaviourIds as getBehaviourIdsDirect,
  getAllBehaviourMetas as getAllBehaviourMetasDirect,
} from '../../engine/experience/behaviours'

// Intro barrel
import {
  getIntroPatternIds,
  getAllIntroPatternMetas,
  getIntroPattern,
} from '../../engine/intro'

// Validation barrel
import { validateSite } from '../../engine/validation'

// Migrations barrel
import { needsMigration, getMigrationsForSite } from '../../engine/migrations'

// Config barrel
import { BREAKPOINTS } from '../../engine/config'

describe('Public API Validation', () => {
  describe('package.json subpath exports', () => {
    it('every barrel has a subpath export in package.json', async () => {
      const pkgJson = JSON.parse(await fs.readFile(path.join(ROOT, 'package.json'), 'utf-8'))
      const exports = pkgJson.exports as Record<string, string>

      // These are the subpaths the platform team relies on
      const REQUIRED_SUBPATHS = [
        '.',
        './renderer',
        './schema',
        './experience',
        './experience/behaviours',
        './intro',
        './interface',
        './validation',
        './config',
        './migrations',
        './content/widgets',
        './content/sections',
        './content/chrome',
      ]

      const missing = REQUIRED_SUBPATHS.filter((sp) => !exports[sp])

      expect(
        missing,
        `Missing required subpath exports in package.json:\n${missing.join('\n')}`
      ).toHaveLength(0)
    })

    it('all subpath exports resolve to existing files', async () => {
      const pkgJson = JSON.parse(await fs.readFile(path.join(ROOT, 'package.json'), 'utf-8'))
      const exports = pkgJson.exports as Record<string, string>
      const violations: string[] = []

      for (const [subpath, target] of Object.entries(exports)) {
        if (subpath.includes('*')) continue // Skip wildcards

        const resolvedPath = path.join(ROOT, target)
        try {
          await fs.access(resolvedPath)
        } catch {
          violations.push(`"${subpath}": "${target}" → file not found`)
        }
      }

      expect(violations, `Broken subpath exports:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('every top-level engine barrel has a subpath export', async () => {
      const pkgJson = JSON.parse(await fs.readFile(path.join(ROOT, 'package.json'), 'utf-8'))
      const exports = pkgJson.exports as Record<string, string>
      const exportTargets = new Set(Object.values(exports))

      // Find all top-level barrels: engine/*/index.ts
      const barrels = await fg('*/index.ts', {
        cwd: ENGINE,
        absolute: false,
        ignore: ['**/node_modules/**'],
      })

      // Internal-only modules that don't need subpath exports
      const INTERNAL_ONLY = ['styles']

      const missing: string[] = []
      for (const barrel of barrels) {
        const folderName = barrel.split('/')[0]
        if (INTERNAL_ONLY.includes(folderName)) continue

        const target = `./engine/${barrel}`
        if (!exportTargets.has(target)) {
          missing.push(`./${folderName} → ${target}`)
        }
      }

      expect(
        missing,
        `Top-level barrels missing from package.json exports:\n${missing.join('\n')}\nAdd these to package.json "exports" field.`
      ).toHaveLength(0)
    })
  })

  describe('Widget registry accessible via barrel', () => {
    it('widgetRegistry is populated', () => {
      const keys = Object.keys(widgetRegistry)
      expect(keys.length, 'widgetRegistry should have entries').toBeGreaterThan(0)
    })

    it('getWidget returns components for all registered widgets', () => {
      const violations: string[] = []

      for (const name of Object.keys(widgetRegistry)) {
        const component = getWidget(name)
        if (!component) {
          violations.push(`getWidget("${name}") returned undefined`)
        }
      }

      expect(violations, `Missing widget components:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('getAllWidgetMeta returns metadata', () => {
      const metas = getAllWidgetMeta()
      expect(metas.length, 'getAllWidgetMeta() should return entries').toBeGreaterThan(0)
    })
  })

  describe('Section registry accessible via barrel', () => {
    it('getAllSectionMetas returns metadata', () => {
      const metas = getAllSectionMetas()
      expect(metas.length, 'getAllSectionMetas() should return entries').toBeGreaterThan(0)

      for (const meta of metas) {
        expect(meta.id, 'Section meta missing id').toBeTruthy()
        expect(meta.name, `Section "${meta.id}" missing name`).toBeTruthy()
      }
    })

    it('getSectionPattern returns entries for all known sections', () => {
      const metas = getAllSectionMetas()
      const violations: string[] = []

      for (const meta of metas) {
        const entry = getSectionPattern(meta.id)
        if (!entry) {
          violations.push(`getSectionPattern("${meta.id}") returned undefined`)
        }
      }

      expect(violations, `Missing section patterns:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Chrome registry accessible via barrel', () => {
    it('getAllChromeMetas returns metadata', () => {
      const metas = getAllChromeMetas()
      expect(metas.length, 'getAllChromeMetas() should return entries').toBeGreaterThan(0)

      for (const meta of metas) {
        expect(meta.id, 'Chrome meta missing id').toBeTruthy()
        expect(meta.name, `Chrome "${meta.id}" missing name`).toBeTruthy()
      }
    })

    it('getChromeComponent returns components for all registered IDs', () => {
      const ids = getChromeComponentIds()
      const violations: string[] = []

      for (const id of ids) {
        const component = getChromeComponent(id)
        if (!component) {
          violations.push(`getChromeComponent("${id}") returned undefined`)
        }
      }

      expect(violations, `Missing chrome components:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Experience registry accessible via barrel', () => {
    it('getExperienceIds returns IDs', () => {
      const ids = getExperienceIds()
      expect(ids.length, 'getExperienceIds() should return entries').toBeGreaterThan(0)
    })

    it('getAllExperienceMetas returns metadata', () => {
      const metas = getAllExperienceMetas()
      expect(metas.length, 'getAllExperienceMetas() should return entries').toBeGreaterThan(0)

      for (const meta of metas) {
        expect(meta.id, 'Experience meta missing id').toBeTruthy()
        expect(meta.name, `Experience "${meta.id}" missing name`).toBeTruthy()
      }
    })
  })

  describe('Behaviour registry accessible via barrel', () => {
    it('getBehaviourIds returns IDs via experience barrel', () => {
      const ids = getBehaviourIds()
      expect(ids.length, 'getBehaviourIds() should return entries').toBeGreaterThan(0)
    })

    it('getAllBehaviourMetas returns metadata via experience barrel', () => {
      const metas = getAllBehaviourMetas()
      expect(metas.length, 'getAllBehaviourMetas() should return entries').toBeGreaterThan(0)

      for (const meta of metas) {
        expect(meta.id, 'Behaviour meta missing id').toBeTruthy()
        expect(meta.name, `Behaviour "${meta.id}" missing name`).toBeTruthy()
        expect(meta.description, `Behaviour "${meta.id}" missing description`).toBeTruthy()
        expect(meta.category, `Behaviour "${meta.id}" missing category`).toBeTruthy()
      }
    })

    it('getBehaviour returns entries for all registered IDs', () => {
      const ids = getBehaviourIds()
      const violations: string[] = []

      for (const id of ids) {
        const behaviour = getBehaviour(id)
        if (!behaviour) {
          violations.push(`getBehaviour("${id}") returned undefined`)
        }
      }

      expect(violations, `Missing behaviours:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('getBehavioursByCategory covers all categories', () => {
      const CATEGORIES = ['scroll', 'hover', 'visibility', 'animation', 'interaction', 'video', 'intro'] as const
      const violations: string[] = []

      for (const category of CATEGORIES) {
        const behaviours = getBehavioursByCategory(category)
        if (behaviours.length === 0) {
          violations.push(`getBehavioursByCategory("${category}") returned empty`)
        }
      }

      expect(violations, `Empty behaviour categories:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('behaviourRegistry proxy works via experience barrel', () => {
      const ids = getBehaviourIds()
      expect(ids.length).toBeGreaterThan(0)

      // Verify the proxy-backed behaviourRegistry returns values
      for (const id of ids) {
        expect(behaviourRegistry[id], `behaviourRegistry["${id}"] is undefined`).toBeTruthy()
      }
    })

    it('direct subpath ./experience/behaviours returns same data', () => {
      const idsFromBarrel = getBehaviourIds().sort()
      const idsDirect = getBehaviourIdsDirect().sort()

      expect(idsFromBarrel).toEqual(idsDirect)

      const metasFromBarrel = getAllBehaviourMetas()
      const metasDirect = getAllBehaviourMetasDirect()

      expect(metasFromBarrel.length).toBe(metasDirect.length)
    })
  })

  describe('Transition registry accessible via barrel', () => {
    it('getPageTransitionIds returns IDs', () => {
      const ids = getPageTransitionIds()
      expect(ids.length, 'getPageTransitionIds() should return entries').toBeGreaterThan(0)
    })

    it('getAllPageTransitionMetas returns metadata', () => {
      const metas = getAllPageTransitionMetas()
      expect(metas.length, 'getAllPageTransitionMetas() should return entries').toBeGreaterThan(0)

      for (const meta of metas) {
        expect(meta.id, 'Transition meta missing id').toBeTruthy()
        expect(meta.name, `Transition "${meta.id}" missing name`).toBeTruthy()
      }
    })
  })

  describe('Intro registry accessible via barrel', () => {
    it('getIntroPatternIds returns IDs', () => {
      const ids = getIntroPatternIds()
      expect(ids.length, 'getIntroPatternIds() should return entries').toBeGreaterThan(0)
    })

    it('getAllIntroPatternMetas returns metadata', () => {
      const metas = getAllIntroPatternMetas()
      expect(metas.length, 'getAllIntroPatternMetas() should return entries').toBeGreaterThan(0)

      for (const meta of metas) {
        expect(meta.id, 'Intro pattern meta missing id').toBeTruthy()
        expect(meta.name, `Intro pattern "${meta.id}" missing name`).toBeTruthy()
      }
    })

    it('getIntroPattern returns entries for all registered IDs', () => {
      const ids = getIntroPatternIds()
      const violations: string[] = []

      for (const id of ids) {
        const pattern = getIntroPattern(id)
        if (!pattern) {
          violations.push(`getIntroPattern("${id}") returned undefined`)
        }
      }

      expect(violations, `Missing intro patterns:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Validation accessible via barrel', () => {
    it('validateSite is a function', () => {
      expect(typeof validateSite).toBe('function')
    })
  })

  describe('Migrations accessible via barrel', () => {
    it('needsMigration is a function', () => {
      expect(typeof needsMigration).toBe('function')
    })

    it('getMigrationsForSite is a function', () => {
      expect(typeof getMigrationsForSite).toBe('function')
    })
  })

  describe('Config accessible via barrel', () => {
    it('BREAKPOINTS is defined', () => {
      expect(BREAKPOINTS).toBeDefined()
      expect(typeof BREAKPOINTS).toBe('object')
    })
  })

  describe('Barrel re-export completeness', () => {
    it('experience barrel re-exports behaviour API', async () => {
      const barrelContent = await readFile(path.join(ENGINE, 'experience/index.ts'))

      const REQUIRED_BEHAVIOUR_EXPORTS = [
        'behaviourRegistry',
        'getBehaviour',
        'getBehaviourIds',
        'getAllBehaviourMetas',
        'getBehavioursByCategory',
        'registerBehaviour',
        'defineBehaviourMeta',
        'resolveBehaviour',
        'BehaviourWrapper',
      ]

      const REQUIRED_BEHAVIOUR_TYPES = [
        'Behaviour',
        'BehaviourMeta',
        'BehaviourCategory',
      ]

      const missingExports = REQUIRED_BEHAVIOUR_EXPORTS.filter(
        (name) => !barrelContent.includes(name)
      )
      const missingTypes = REQUIRED_BEHAVIOUR_TYPES.filter(
        (name) => !barrelContent.includes(name)
      )

      expect(
        missingExports,
        `experience/index.ts missing behaviour exports:\n${missingExports.join('\n')}`
      ).toHaveLength(0)
      expect(
        missingTypes,
        `experience/index.ts missing behaviour types:\n${missingTypes.join('\n')}`
      ).toHaveLength(0)
    })

    it('experience barrel re-exports experience API', async () => {
      const barrelContent = await readFile(path.join(ENGINE, 'experience/index.ts'))

      const REQUIRED = [
        'getExperienceIds',
        'getAllExperienceMetas',
        'getExperience',
        'getExperienceAsync',
        'ExperienceProvider',
        'useExperience',
      ]

      const missing = REQUIRED.filter((name) => !barrelContent.includes(name))

      expect(
        missing,
        `experience/index.ts missing experience exports:\n${missing.join('\n')}`
      ).toHaveLength(0)
    })

    it('experience barrel re-exports transition API', async () => {
      const barrelContent = await readFile(path.join(ENGINE, 'experience/index.ts'))

      const REQUIRED = [
        'getPageTransitionIds',
        'getAllPageTransitionMetas',
        'getPageTransition',
        'getPageTransitionAsync',
      ]

      const missing = REQUIRED.filter((name) => !barrelContent.includes(name))

      expect(
        missing,
        `experience/index.ts missing transition exports:\n${missing.join('\n')}`
      ).toHaveLength(0)
    })
  })
})
