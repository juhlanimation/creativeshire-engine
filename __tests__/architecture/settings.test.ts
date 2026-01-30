/**
 * Settings Schema Coverage Tests
 *
 * Validates that all components have corresponding settings schemas
 * for CMS editor integration.
 *
 * See: .claude/skills/creativeshire/specs/layers/settings.spec.md
 */

import { describe, it, expect } from 'vitest'
import path from 'path'
import { getFiles, readFile, fileExists, relativePath } from './helpers'

describe('Settings Schema Coverage', () => {
  describe('Widget settings', () => {
    it('every primitive widget has a .settings.ts file', async () => {
      const settingsDir = path.join(process.cwd(), 'creativeshire/settings/widgets')
      const dirExists = await fileExists(settingsDir)

      if (!dirExists) {
        console.warn('Settings layer not yet implemented (creativeshire/settings/)')
        return // Skip until settings layer is created
      }

      const primitives = await getFiles('content/widgets/primitives/*/index.tsx')
      const settingsFiles = await getFiles('../settings/widgets/*.settings.ts')

      const widgetNames = primitives.map(f => path.basename(path.dirname(f)))
      const settingsNames = settingsFiles.map(f => path.basename(f, '.settings.ts'))

      const missing = widgetNames.filter(w => !settingsNames.includes(w))

      expect(
        missing,
        `Primitive widgets missing settings:\n${missing.join('\n')}`
      ).toHaveLength(0)
    })

    it('every layout widget has a .settings.ts file', async () => {
      const settingsDir = path.join(process.cwd(), 'creativeshire/settings/widgets')
      const dirExists = await fileExists(settingsDir)

      if (!dirExists) {
        console.warn('Settings layer not yet implemented (creativeshire/settings/)')
        return
      }

      const layouts = await getFiles('content/widgets/layout/*/index.tsx')
      const settingsFiles = await getFiles('../settings/widgets/*.settings.ts')

      const widgetNames = layouts.map(f => path.basename(path.dirname(f)))
      const settingsNames = settingsFiles.map(f => path.basename(f, '.settings.ts'))

      const missing = widgetNames.filter(w => !settingsNames.includes(w))

      expect(
        missing,
        `Layout widgets missing settings:\n${missing.join('\n')}`
      ).toHaveLength(0)
    })

    it('every composite widget has a .settings.ts file', async () => {
      const settingsDir = path.join(process.cwd(), 'creativeshire/settings/widgets')
      const dirExists = await fileExists(settingsDir)

      if (!dirExists) {
        console.warn('Settings layer not yet implemented (creativeshire/settings/)')
        return
      }

      const composites = await getFiles('content/widgets/composite/*/index.{ts,tsx}')
      const settingsFiles = await getFiles('../settings/widgets/*.settings.ts')

      const widgetNames = composites.map(f => path.basename(path.dirname(f)))
      const settingsNames = settingsFiles.map(f => path.basename(f, '.settings.ts'))

      const missing = widgetNames.filter(w => !settingsNames.includes(w))

      expect(
        missing,
        `Composite widgets missing settings:\n${missing.join('\n')}`
      ).toHaveLength(0)
    })
  })

  describe('Section pattern settings', () => {
    it('every section pattern has a .settings.ts file', async () => {
      const settingsDir = path.join(process.cwd(), 'creativeshire/settings/sections')
      const dirExists = await fileExists(settingsDir)

      if (!dirExists) {
        console.warn('Settings layer not yet implemented (creativeshire/settings/)')
        return
      }

      const sections = await getFiles('content/sections/patterns/*/index.ts')
      const settingsFiles = await getFiles('../settings/sections/*.settings.ts')

      const sectionNames = sections.map(f => path.basename(path.dirname(f)))
      const settingsNames = settingsFiles.map(f => path.basename(f, '.settings.ts'))

      const missing = sectionNames.filter(s => !settingsNames.includes(s))

      expect(
        missing,
        `Section patterns missing settings:\n${missing.join('\n')}`
      ).toHaveLength(0)
    })
  })

  describe('Settings schema structure', () => {
    it('settings schemas have required fields', async () => {
      const settingsDir = path.join(process.cwd(), 'creativeshire/settings')
      const dirExists = await fileExists(settingsDir)

      if (!dirExists) {
        console.warn('Settings layer not yet implemented (creativeshire/settings/)')
        return
      }

      const settingsFiles = await getFiles('../settings/**/*.settings.ts')
      const violations: string[] = []

      for (const file of settingsFiles) {
        const content = await readFile(file)
        const relPath = relativePath(file)

        if (!content.includes('component:')) {
          violations.push(`${relPath}: missing 'component' field`)
        }
        if (!content.includes('displayName:')) {
          violations.push(`${relPath}: missing 'displayName' field`)
        }
        if (!content.includes('SettingsSchema')) {
          violations.push(`${relPath}: missing SettingsSchema type`)
        }
      }

      expect(
        violations,
        `Settings schema violations:\n${violations.join('\n')}`
      ).toHaveLength(0)
    })

    it('settings field keys match component prop names', async () => {
      const settingsDir = path.join(process.cwd(), 'creativeshire/settings/widgets')
      const dirExists = await fileExists(settingsDir)

      if (!dirExists) {
        console.warn('Settings layer not yet implemented (creativeshire/settings/)')
        return
      }

      // This test validates that settings keys correspond to actual props
      // by checking the component's types.ts file
      const settingsFiles = await getFiles('../settings/widgets/*.settings.ts')
      const violations: string[] = []

      for (const file of settingsFiles) {
        const settingsContent = await readFile(file)
        const componentName = path.basename(file, '.settings.ts')

        // Find the component's types.ts
        const typesFiles = await getFiles(`content/widgets/*/${componentName}/types.ts`)
        if (typesFiles.length === 0) continue

        const typesContent = await readFile(typesFiles[0])

        // Extract keys from settings file
        const settingsKeys = [...settingsContent.matchAll(/key:\s*['"]([^'"]+)['"]/g)]
          .map(m => m[1])
          .filter(k => !k.includes('.')) // Skip nested keys like 'style.color'

        // Extract props from types file (simple heuristic)
        const propsMatch = typesContent.match(/interface\s+\w+Props\s*\{([^}]+)\}/s)
        if (!propsMatch) continue

        const propsBlock = propsMatch[1]
        const propNames = [...propsBlock.matchAll(/^\s*['"]?(\w+)['"]?\s*[?:]:/gm)]
          .map(m => m[1])

        // Check for settings keys that don't exist as props
        for (const key of settingsKeys) {
          if (!propNames.includes(key) && key !== 'id' && key !== 'className' && key !== 'style') {
            violations.push(`${componentName}: settings key '${key}' not found in props`)
          }
        }
      }

      expect(
        violations,
        `Settings/props mismatch:\n${violations.join('\n')}`
      ).toHaveLength(0)
    })
  })
})
