/**
 * Registration Validation Tests
 *
 * Ensures all implementations are registered in their respective registries.
 * Pattern: If folder/file exists → it must be registered
 */

import { describe, it, expect } from 'vitest'
import {
  getFiles,
  getFolders,
  readFile,
  getComponentName,
  relativePath,
  extractBehaviourId,
  extractTransitionId,
} from './helpers'

// Import registries
import { widgetRegistry } from '../../engine/content/widgets/registry'
import { getChromeComponent, getAllChromeMetas, getChromeComponentIds } from '../../engine/content/chrome/registry'
import { behaviourRegistry, getBehaviourIds, getAllBehaviourMetas } from '../../engine/experience/behaviours/registry'
import { effectRegistry } from '../../engine/experience/timeline/effects/registry'
import { sectionRegistry } from '../../engine/content/sections/registry'
import { getThemeIds, getAllThemeMetas } from '../../engine/themes'
import { widgetMetaRegistry } from '../../engine/content/widgets/meta-registry'

describe('Registration Validation', () => {
  describe('Widget Registry', () => {
    it('all primitives are registered', async () => {
      const folders = await getFolders('content/widgets/primitives/*')
      const violations: string[] = []

      for (const folder of folders) {
        const name = getComponentName(folder)
        if (!widgetRegistry[name]) {
          violations.push(`Primitive "${name}" folder exists but is not registered in widgetRegistry`)
        }
      }

      if (violations.length > 0) {
        console.log('Unregistered primitives:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('all layout widgets are registered', async () => {
      const folders = await getFolders('content/widgets/layout/*')
      const violations: string[] = []

      for (const folder of folders) {
        const name = getComponentName(folder)
        if (!widgetRegistry[name]) {
          violations.push(`Layout widget "${name}" folder exists but is not registered in widgetRegistry`)
        }
      }

      if (violations.length > 0) {
        console.log('Unregistered layout widgets:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('all interactive widgets are registered', async () => {
      const folders = await getFolders('content/widgets/interactive/*')
      const violations: string[] = []

      for (const folder of folders) {
        const name = getComponentName(folder)
        if (!widgetRegistry[name]) {
          violations.push(`Interactive widget "${name}" folder exists but is not registered in widgetRegistry`)
        }
      }

      if (violations.length > 0) {
        console.log('Unregistered interactive widgets:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('all repeaters are registered', async () => {
      const folders = await getFolders('content/widgets/repeaters/*')
      const violations: string[] = []

      for (const folder of folders) {
        const name = getComponentName(folder)
        if (!widgetRegistry[name]) {
          violations.push(`Repeater "${name}" folder exists but is not registered in widgetRegistry`)
        }
      }

      if (violations.length > 0) {
        console.log('Unregistered repeaters:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('sections are NOT registered in widgetRegistry (they have their own registry)', async () => {
      const folders = await getFolders('content/sections/patterns/*')
      const violations: string[] = []

      for (const folder of folders) {
        const name = getComponentName(folder)
        if (widgetRegistry[name]) {
          violations.push(`Section "${name}" should NOT be in widgetRegistry (sections use sectionRegistry)`)
        }
      }

      if (violations.length > 0) {
        console.log('Incorrectly registered sections:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('no orphaned widget registry entries', async () => {
      // Get all widget folders
      const primitives = await getFolders('content/widgets/primitives/*')
      const layouts = await getFolders('content/widgets/layout/*')
      const interactives = await getFolders('content/widgets/interactive/*')
      const repeaters = await getFolders('content/widgets/repeaters/*')
      // Chrome overlays can be registered as widgets for use with ExperienceChromeRenderer
      const chromeOverlays = await getFolders('content/chrome/overlays/*')

      const allFolderNames = new Set([
        ...primitives.map(getComponentName),
        ...layouts.map(getComponentName),
        ...interactives.map(getComponentName),
        ...repeaters.map(getComponentName),
        ...chromeOverlays.map(getComponentName),
      ])

      const violations: string[] = []
      for (const name of Object.keys(widgetRegistry)) {
        // Scoped widgets (Section__Widget) register dynamically via registerScopedWidget()
        // and live in sections/patterns/{Section}/components/ — skip them here
        if (name.includes('__')) continue

        if (!allFolderNames.has(name)) {
          violations.push(`widgetRegistry has "${name}" but no corresponding folder exists`)
        }
      }

      if (violations.length > 0) {
        console.log('Orphaned registry entries:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('all widget types in preset schemas are registered', async () => {
      // Get all preset page files
      const presetPages = await getFiles('presets/*/pages/*.ts')
      const violations: string[] = []

      // Section layout types (not widget types)
      const layoutTypes = new Set(['stack', 'grid', 'flex', 'split'])

      for (const file of presetPages) {
        const content = await readFile(file)

        // Find all type: 'WidgetName' patterns in widget definitions
        // Widget types start with uppercase (Text, Flex, Video)
        // Layout types are lowercase (stack, grid) - exclude these
        const typeMatches = content.matchAll(/type:\s*['"]([A-Z]\w*)['"]/g)

        for (const match of typeMatches) {
          const widgetType = match[1]
          // Skip layout types (case-insensitive check just in case)
          if (layoutTypes.has(widgetType.toLowerCase())) continue

          if (!widgetRegistry[widgetType]) {
            violations.push(`${relativePath(file)}: Uses widget type "${widgetType}" which is not registered`)
          }
        }
      }

      if (violations.length > 0) {
        console.log('Unregistered widget types used in schemas:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })
  })

  describe('Widget Meta Registry', () => {
    it('every global widget folder has a meta-registry entry', async () => {
      const primitives = await getFolders('content/widgets/primitives/*')
      const layouts = await getFolders('content/widgets/layout/*')
      const interactives = await getFolders('content/widgets/interactive/*')
      const repeaters = await getFolders('content/widgets/repeaters/*')

      const allFolders = [...primitives, ...layouts, ...interactives, ...repeaters]
      const violations: string[] = []

      for (const folder of allFolders) {
        const name = getComponentName(folder)
        if (!(name in widgetMetaRegistry)) {
          violations.push(`Widget "${name}" has a folder but no entry in widgetMetaRegistry`)
        }
      }

      if (violations.length > 0) {
        console.log('Missing meta-registry entries:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('no orphaned meta-registry entries without corresponding folders', async () => {
      const primitives = await getFolders('content/widgets/primitives/*')
      const layouts = await getFolders('content/widgets/layout/*')
      const interactives = await getFolders('content/widgets/interactive/*')
      const repeaters = await getFolders('content/widgets/repeaters/*')

      const allFolderNames = new Set([
        ...primitives.map(getComponentName),
        ...layouts.map(getComponentName),
        ...interactives.map(getComponentName),
        ...repeaters.map(getComponentName),
      ])

      const violations: string[] = []
      for (const name of Object.keys(widgetMetaRegistry)) {
        if (!allFolderNames.has(name)) {
          violations.push(`widgetMetaRegistry has "${name}" but no corresponding widget folder exists`)
        }
      }

      if (violations.length > 0) {
        console.log('Orphaned meta-registry entries:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })
  })

  describe('Chrome Registry', () => {
    it('all overlay folders are registered', async () => {
      const folders = await getFolders('content/chrome/overlays/*')
      const violations: string[] = []

      for (const folder of folders) {
        const name = getComponentName(folder)
        // Check both the folder name and common variations (e.g., Modal vs ModalRoot)
        const isRegistered = getChromeComponent(name) || getChromeComponent(`${name}Root`)
        if (!isRegistered) {
          violations.push(`Overlay "${name}" folder exists but is not registered in chromeRegistry (checked: ${name}, ${name}Root)`)
        }
      }

      if (violations.length > 0) {
        console.log('Unregistered overlays:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('all chrome components are registered with meta', () => {
      const ids = getChromeComponentIds()
      const metas = getAllChromeMetas()
      const violations: string[] = []

      // Every registered component must have meta
      expect(metas.length).toBe(ids.length)

      for (const meta of metas) {
        if (!meta.id) violations.push(`Chrome meta missing id`)
        if (!meta.name) violations.push(`Chrome meta "${meta.id}" missing name`)
        if (!meta.description) violations.push(`Chrome meta "${meta.id}" missing description`)
        if (!meta.category) violations.push(`Chrome meta "${meta.id}" missing category`)
      }

      expect(violations, `Chrome meta validation failures:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('chrome meta category is overlay', () => {
      const VALID_CHROME_CATEGORIES = ['overlay']
      const metas = getAllChromeMetas()
      const violations: string[] = []

      for (const meta of metas) {
        if (!VALID_CHROME_CATEGORIES.includes(meta.category)) {
          violations.push(`Chrome "${meta.id}": category "${meta.category}" (expected: ${VALID_CHROME_CATEGORIES.join(', ')})`)
        }
      }

      expect(violations, `Invalid chrome meta categories:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Behaviour Registry', () => {
    const TRIGGER_FOLDERS = ['scroll', 'hover', 'visibility', 'animation', 'interaction', 'video', 'intro']

    it('all behaviour folders are registered', async () => {
      const violations: string[] = []

      for (const trigger of TRIGGER_FOLDERS) {
        const folders = await getFolders(`experience/behaviours/${trigger}/*`)

        for (const folder of folders) {
          const name = getComponentName(folder)
          const expectedId = `${trigger}/${name}`

          if (!behaviourRegistry[expectedId]) {
            violations.push(`Behaviour "${expectedId}" folder exists but is not registered`)
          }
        }
      }

      expect(violations, `Unregistered behaviours:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('no orphaned behaviour registry entries', async () => {
      const folderIds = new Set<string>()
      for (const trigger of TRIGGER_FOLDERS) {
        const folders = await getFolders(`experience/behaviours/${trigger}/*`)
        for (const folder of folders) {
          const name = getComponentName(folder)
          folderIds.add(`${trigger}/${name}`)
        }
      }

      const registryIds = getBehaviourIds()
      const orphaned = registryIds.filter((id) => !folderIds.has(id))

      expect(
        orphaned,
        `Orphaned behaviour registry entries:\n${orphaned.join('\n')}`
      ).toHaveLength(0)
    })

    it('behaviour IDs follow trigger/name convention', async () => {
      const violations: string[] = []

      for (const trigger of TRIGGER_FOLDERS) {
        const metaFiles = await getFiles(`experience/behaviours/${trigger}/*/meta.ts`)

        for (const file of metaFiles) {
          const content = await readFile(file)
          const id = extractBehaviourId(content)

          if (!id) continue

          const expectedPrefix = `${trigger}/`
          if (!id.startsWith(expectedPrefix)) {
            violations.push(`${relativePath(file)}: Behaviour ID "${id}" should start with "${expectedPrefix}"`)
          }
        }
      }

      expect(violations, `Incorrect behaviour ID format:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('getAllBehaviourMetas() returns entries with required fields', () => {
      const metas = getAllBehaviourMetas()
      const violations: string[] = []

      for (const meta of metas) {
        if (!meta.id) violations.push(`Behaviour meta missing id`)
        if (!meta.name) violations.push(`Behaviour meta "${meta.id}" missing name`)
        if (!meta.description) violations.push(`Behaviour meta "${meta.id}" missing description`)
        if (!meta.category) violations.push(`Behaviour meta "${meta.id}" missing category`)
      }

      expect(violations, `Behaviour meta validation:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Effect Primitives Registry', () => {
    const EXCLUDED_FILES = ['index.ts', 'registry.ts', 'types.ts']

    it('all effect files are registered', async () => {
      const files = await getFiles('experience/timeline/effects/*.ts')
      const violations: string[] = []

      for (const file of files) {
        const filename = file.split('/').pop() || ''
        if (EXCLUDED_FILES.includes(filename)) continue

        const content = await readFile(file)
        const id = extractTransitionId(content)

        if (!id) {
          violations.push(`${relativePath(file)}: No effect ID found in file`)
          continue
        }

        if (!effectRegistry[id]) {
          violations.push(`${relativePath(file)}: Effect "${id}" not registered in effectRegistry`)
        }
      }

      if (violations.length > 0) {
        console.log('Unregistered effects:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('effect IDs match filename', async () => {
      const files = await getFiles('experience/timeline/effects/*.ts')
      const violations: string[] = []

      for (const file of files) {
        const filename = file.split('/').pop() || ''
        if (EXCLUDED_FILES.includes(filename)) continue

        const content = await readFile(file)
        const id = extractTransitionId(content)

        if (!id) continue

        // ID should match filename (without .ts)
        const expectedId = filename.replace('.ts', '')
        if (id !== expectedId) {
          violations.push(`${relativePath(file)}: Effect ID "${id}" doesn't match filename "${expectedId}"`)
        }
      }

      if (violations.length > 0) {
        console.log('Mismatched effect IDs:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })
  })

  describe('Section Registry', () => {
    it('all section pattern folders are registered', async () => {
      const folders = await getFolders('content/sections/patterns/*')
      const violations: string[] = []

      for (const folder of folders) {
        const name = getComponentName(folder)
        if (!sectionRegistry[name]) {
          violations.push(`Section "${name}" folder exists but is not registered in sectionRegistry`)
        }
      }

      if (violations.length > 0) {
        console.log('Unregistered sections:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('no orphaned section registry entries', async () => {
      const folders = await getFolders('content/sections/patterns/*')
      const allFolderNames = new Set(folders.map(getComponentName))
      const violations: string[] = []

      for (const name of Object.keys(sectionRegistry)) {
        if (!allFolderNames.has(name)) {
          violations.push(`sectionRegistry has "${name}" but no corresponding folder exists`)
        }
      }

      if (violations.length > 0) {
        console.log('Orphaned section registry entries:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('section registry entries have valid meta', async () => {
      const violations: string[] = []

      for (const [name, entry] of Object.entries(sectionRegistry)) {
        if (!entry.meta) {
          violations.push(`sectionRegistry["${name}"] is missing meta`)
          continue
        }

        if (entry.meta.id !== name) {
          violations.push(`sectionRegistry["${name}"].meta.id is "${entry.meta.id}" (should match key)`)
        }

        if (entry.meta.category !== 'section') {
          violations.push(`sectionRegistry["${name}"].meta.category is "${entry.meta.category}" (should be "section")`)
        }

        if (!entry.meta.sectionCategory) {
          violations.push(`sectionRegistry["${name}"].meta.sectionCategory is missing`)
        }

        if (typeof entry.meta.unique !== 'boolean') {
          violations.push(`sectionRegistry["${name}"].meta.unique is not a boolean`)
        }
      }

      if (violations.length > 0) {
        console.log('Invalid section registry entries:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('section registry entries have getFactory functions', async () => {
      const violations: string[] = []

      for (const [name, entry] of Object.entries(sectionRegistry)) {
        if (typeof entry.getFactory !== 'function') {
          violations.push(`sectionRegistry["${name}"].getFactory is not a function`)
        }
      }

      if (violations.length > 0) {
        console.log('Missing getFactory functions:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })
  })

  describe('Theme Registry', () => {
    it('all theme definition files are registered', async () => {
      const files = await getFiles('themes/definitions/*.ts')
      const violations: string[] = []

      for (const file of files) {
        const content = await readFile(file)
        // Extract theme ID from: id: 'theme-name'
        const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/)
        if (!idMatch) {
          violations.push(`${relativePath(file)}: No theme ID found`)
          continue
        }

        const themeId = idMatch[1]
        const registeredIds = getThemeIds()
        if (!registeredIds.includes(themeId)) {
          violations.push(`${relativePath(file)}: Theme "${themeId}" not registered`)
        }
      }

      if (violations.length > 0) {
        console.log('Unregistered themes:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('all registered themes have required meta fields', () => {
      const metas = getAllThemeMetas()
      const violations: string[] = []

      expect(metas.length).toBeGreaterThan(0)

      for (const meta of metas) {
        if (!meta.id) violations.push('Theme meta missing id')
        if (!meta.name) violations.push(`Theme "${meta.id}" missing name`)
        if (!meta.description) violations.push(`Theme "${meta.id}" missing description`)
      }

      expect(violations, `Theme meta validation:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('no orphaned theme registry entries', async () => {
      const files = await getFiles('themes/definitions/*.ts')
      const fileIds = new Set<string>()

      for (const file of files) {
        const content = await readFile(file)
        const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/)
        if (idMatch) fileIds.add(idMatch[1])
      }

      const registeredIds = getThemeIds()
      const orphaned = registeredIds.filter((id) => !fileIds.has(id))

      expect(
        orphaned,
        `Orphaned theme registry entries:\n${orphaned.join('\n')}`
      ).toHaveLength(0)
    })
  })
})
