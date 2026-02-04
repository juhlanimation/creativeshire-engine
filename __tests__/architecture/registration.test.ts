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
import { chromeRegistry } from '../../engine/content/chrome/registry'
import { behaviourRegistry } from '../../engine/experience/behaviours/registry'
import { transitionRegistry } from '../../engine/experience/drivers/gsap/transitions/registry'

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

    it('patterns are NOT registered (they are factories)', async () => {
      const folders = await getFolders('content/widgets/patterns/*')
      const violations: string[] = []

      for (const folder of folders) {
        const name = getComponentName(folder)
        if (widgetRegistry[name]) {
          violations.push(`Pattern "${name}" should NOT be in widgetRegistry (patterns are factories, not components)`)
        }
      }

      if (violations.length > 0) {
        console.log('Incorrectly registered patterns:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('sections are NOT registered (they are factories)', async () => {
      const folders = await getFolders('content/sections/patterns/*')
      const violations: string[] = []

      for (const folder of folders) {
        const name = getComponentName(folder)
        if (widgetRegistry[name]) {
          violations.push(`Section "${name}" should NOT be in widgetRegistry (sections are factories, not components)`)
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
      // Chrome overlays can be registered as widgets for use with ExperienceChromeRenderer
      const chromeOverlays = await getFolders('content/chrome/overlays/*')

      const allFolderNames = new Set([
        ...primitives.map(getComponentName),
        ...layouts.map(getComponentName),
        ...interactives.map(getComponentName),
        ...chromeOverlays.map(getComponentName),
      ])

      const violations: string[] = []
      for (const name of Object.keys(widgetRegistry)) {
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

  describe('Chrome Registry', () => {
    it('all region folders are registered', async () => {
      const folders = await getFolders('content/chrome/regions/*')
      const violations: string[] = []

      for (const folder of folders) {
        const name = getComponentName(folder)
        if (!chromeRegistry[name]) {
          violations.push(`Region "${name}" folder exists but is not registered in chromeRegistry`)
        }
      }

      if (violations.length > 0) {
        console.log('Unregistered regions:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('all overlay folders are registered', async () => {
      const folders = await getFolders('content/chrome/overlays/*')
      const violations: string[] = []

      for (const folder of folders) {
        const name = getComponentName(folder)
        // Check both the folder name and common variations (e.g., Modal vs ModalRoot)
        const isRegistered = chromeRegistry[name] || chromeRegistry[`${name}Root`]
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
  })

  describe('Behaviour Registry', () => {
    const TRIGGER_FOLDERS = ['scroll', 'hover', 'visibility', 'animation', 'interaction']
    const EXCLUDED_FILES = ['index.ts', 'registry.ts', 'types.ts', 'resolve.ts', 'BehaviourWrapper.tsx']

    it('all behaviour files are registered', async () => {
      const violations: string[] = []

      for (const trigger of TRIGGER_FOLDERS) {
        const files = await getFiles(`experience/behaviours/${trigger}/*.ts`)

        for (const file of files) {
          const filename = file.split('/').pop() || ''
          if (EXCLUDED_FILES.includes(filename)) continue

          const content = await readFile(file)
          const id = extractBehaviourId(content)

          if (!id) {
            violations.push(`${relativePath(file)}: No behaviour ID found in file`)
            continue
          }

          if (!behaviourRegistry[id]) {
            violations.push(`${relativePath(file)}: Behaviour "${id}" not registered in behaviourRegistry`)
          }
        }
      }

      if (violations.length > 0) {
        console.log('Unregistered behaviours:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('behaviour IDs follow trigger/name convention', async () => {
      const violations: string[] = []

      for (const trigger of TRIGGER_FOLDERS) {
        const files = await getFiles(`experience/behaviours/${trigger}/*.ts`)

        for (const file of files) {
          const filename = file.split('/').pop() || ''
          if (EXCLUDED_FILES.includes(filename)) continue

          const content = await readFile(file)
          const id = extractBehaviourId(content)

          if (!id) continue

          // ID should be trigger/name format
          const expectedPrefix = `${trigger}/`
          if (!id.startsWith(expectedPrefix)) {
            violations.push(`${relativePath(file)}: Behaviour ID "${id}" should start with "${expectedPrefix}"`)
          }
        }
      }

      if (violations.length > 0) {
        console.log('Incorrect behaviour ID format:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })
  })

  describe('Transition Registry', () => {
    const EXCLUDED_FILES = ['index.ts', 'registry.ts', 'types.ts', 'resolve.ts']

    it('all transition files are registered', async () => {
      const files = await getFiles('experience/drivers/gsap/transitions/*.ts')
      const violations: string[] = []

      for (const file of files) {
        const filename = file.split('/').pop() || ''
        if (EXCLUDED_FILES.includes(filename)) continue

        const content = await readFile(file)
        const id = extractTransitionId(content)

        if (!id) {
          violations.push(`${relativePath(file)}: No transition ID found in file`)
          continue
        }

        if (!transitionRegistry[id]) {
          violations.push(`${relativePath(file)}: Transition "${id}" not registered in transitionRegistry`)
        }
      }

      if (violations.length > 0) {
        console.log('Unregistered transitions:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('transition IDs match filename', async () => {
      const files = await getFiles('experience/drivers/gsap/transitions/*.ts')
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
          violations.push(`${relativePath(file)}: Transition ID "${id}" doesn't match filename "${expectedId}"`)
        }
      }

      if (violations.length > 0) {
        console.log('Mismatched transition IDs:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })
  })
})
