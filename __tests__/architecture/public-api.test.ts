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
  getIntroOverride,
  setIntroOverride,
  DEV_INTRO_PARAM,
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

    it('every engine barrel (depth 1 and 2) has a subpath export or is re-exported by parent', async () => {
      const pkgJson = JSON.parse(await fs.readFile(path.join(ROOT, 'package.json'), 'utf-8'))
      const exports = pkgJson.exports as Record<string, string>
      const exportSubpaths = new Set(Object.keys(exports))

      // Find all barrels at depth 1 (engine/*/index.ts) and depth 2 (engine/*/*/index.ts)
      const depth1 = await fg('*/index.ts', { cwd: ENGINE, absolute: false, ignore: ['**/node_modules/**'] })
      const depth2 = await fg('*/*/index.ts', { cwd: ENGINE, absolute: false, ignore: ['**/node_modules/**'] })
      const allBarrels = [...depth1, ...depth2]

      // Barrels that are internal implementation details, re-exported by a parent barrel.
      // Each entry maps to the parent subpath that re-exports its contents.
      const RE_EXPORTED_BY_PARENT: Record<string, string> = {
        // experience sub-barrels → re-exported by ./experience
        'experience/drivers': './experience',
        'experience/compositions': './experience',
        'experience/lifecycle': './experience',
        'experience/navigation': './experience',
        'experience/transitions': './experience',
        'experience/triggers': './experience',
        // intro sub-barrels → re-exported by ./intro
        'intro/intros': './intro',
        'intro/patterns': './intro',
        'intro/sequences': './intro',
        'intro/triggers': './intro',
        // content sub-barrels → re-exported by parent content barrel
        'content/actions': './content/chrome',
        'content/chrome/overlays': './content/chrome',
        'content/widgets/interactive': './content/widgets',
        'content/widgets/layout': './content/widgets',
        'content/widgets/primitives': './content/widgets',
        'content/sections/patterns': './content/sections',
        // interface sub-barrels
        'interface/validation': './interface',
        // renderer sub-barrels
        'renderer/hooks': './renderer',
        // timeline sub-barrels
        'experience/timeline': './experience',
        'experience/timeline/gsap': './experience',
        'experience/timeline/primitives': './experience',
        'experience/transitions/configs': './experience',
      }

      const missing: string[] = []
      for (const barrel of allBarrels) {
        const subpath = './' + barrel.replace('/index.ts', '')

        // Check if it has its own export
        if (exportSubpaths.has(subpath)) continue

        // Check if it's wildcard-covered (e.g., ./presets/*)
        const wildcardMatch = [...exportSubpaths].some((sp) => {
          if (!sp.includes('*')) return false
          const prefix = sp.replace('/*', '/')
          return subpath.startsWith(prefix)
        })
        if (wildcardMatch) continue

        // Check if it's re-exported by parent
        const folderPath = barrel.replace('/index.ts', '')
        if (RE_EXPORTED_BY_PARENT[folderPath]) {
          const parentSubpath = RE_EXPORTED_BY_PARENT[folderPath]
          if (exportSubpaths.has(parentSubpath)) continue
        }

        missing.push(`${subpath} → ./engine/${barrel}`)
      }

      expect(
        missing,
        `Engine barrels missing from package.json exports (add subpath or document as re-exported):\n${missing.join('\n')}`
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

  describe('Intro dev override accessible via barrel', () => {
    it('getIntroOverride is a function', () => {
      expect(typeof getIntroOverride).toBe('function')
    })

    it('setIntroOverride is a function', () => {
      expect(typeof setIntroOverride).toBe('function')
    })

    it('DEV_INTRO_PARAM is defined', () => {
      expect(DEV_INTRO_PARAM).toBe('_intro')
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
