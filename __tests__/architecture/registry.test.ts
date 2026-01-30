/**
 * Registry Consistency Tests
 *
 * Validates that the widget registry is consistent with actual components:
 * - All registered widgets exist as components
 * - All widget components are registered (except factories)
 *
 * See: .claude/skills/creativeshire/specs/components/renderer/registry.spec.md
 */

import { describe, it, expect } from 'vitest'
import path from 'path'
import { getFiles, readFile, fileExists, relativePath } from './helpers'

describe('Registry Consistency', () => {
  describe('Widget registry', () => {
    it('all registered widgets exist as components', async () => {
      const registryPath = path.join(
        process.cwd(),
        'creativeshire/content/widgets/registry.ts'
      )
      const registryContent = await readFile(registryPath)

      // Extract widget names from registry object
      // Match patterns like: Text, Image, (with trailing comma or end of object)
      const registryMatch = registryContent.match(
        /widgetRegistry[^{]*\{([^}]+)\}/s
      )
      if (!registryMatch) {
        throw new Error('Could not parse widget registry')
      }

      const registryBlock = registryMatch[1]
      // Match widget names (capitalized identifiers on their own line)
      const registeredWidgets = [...registryBlock.matchAll(/^\s*(\w+),?\s*(?:\/\/.*)?$/gm)]
        .map(m => m[1])
        .filter(name => name && /^[A-Z]/.test(name)) // Only PascalCase names

      const violations: string[] = []

      for (const widgetName of registeredWidgets) {
        // Check if component exists in any widget folder
        const primitiveExists = await fileExists(
          path.join(process.cwd(), `creativeshire/content/widgets/primitives/${widgetName}/index.tsx`)
        )
        const layoutExists = await fileExists(
          path.join(process.cwd(), `creativeshire/content/widgets/layout/${widgetName}/index.tsx`)
        )
        const compositeExists = await fileExists(
          path.join(process.cwd(), `creativeshire/content/widgets/composite/${widgetName}/index.tsx`)
        )

        if (!primitiveExists && !layoutExists && !compositeExists) {
          violations.push(`Registry has '${widgetName}' but no component exists`)
        }
      }

      expect(
        violations,
        `Registry references missing components:\n${violations.join('\n')}`
      ).toHaveLength(0)
    })

    it('all primitive widget components are registered', async () => {
      const registryPath = path.join(
        process.cwd(),
        'creativeshire/content/widgets/registry.ts'
      )
      const registryContent = await readFile(registryPath)

      const primitives = await getFiles('content/widgets/primitives/*/index.tsx')
      const widgetNames = primitives.map(f => path.basename(path.dirname(f)))

      const missing = widgetNames.filter(name => !registryContent.includes(name))

      expect(
        missing,
        `Primitives not in registry:\n${missing.join('\n')}`
      ).toHaveLength(0)
    })

    it('all layout widget components are registered', async () => {
      const registryPath = path.join(
        process.cwd(),
        'creativeshire/content/widgets/registry.ts'
      )
      const registryContent = await readFile(registryPath)

      const layouts = await getFiles('content/widgets/layout/*/index.tsx')
      const widgetNames = layouts.map(f => path.basename(path.dirname(f)))

      const missing = widgetNames.filter(name => !registryContent.includes(name))

      expect(
        missing,
        `Layouts not in registry:\n${missing.join('\n')}`
      ).toHaveLength(0)
    })

    it('composite React components are registered (factories excluded)', async () => {
      const registryPath = path.join(
        process.cwd(),
        'creativeshire/content/widgets/registry.ts'
      )
      const registryContent = await readFile(registryPath)

      // Get all composite folders
      const composites = await getFiles('content/widgets/composite/*/index.{ts,tsx}')
      const violations: string[] = []

      for (const file of composites) {
        const name = path.basename(path.dirname(file))
        const content = await readFile(file)

        // Check if it's a React component (has JSX or React import)
        // vs a factory (exports a function returning WidgetSchema)
        const isReactComponent =
          file.endsWith('.tsx') ||
          content.includes('from \'react\'') ||
          content.includes('from "react"')

        const isFactory =
          content.includes('function create') ||
          content.includes('export function create') ||
          content.includes(': WidgetSchema')

        // React components should be registered, factories should not
        if (isReactComponent && !isFactory) {
          if (!registryContent.includes(name)) {
            violations.push(`${name} is a React component but not in registry`)
          }
        }
      }

      expect(
        violations,
        `Composite components missing from registry:\n${violations.join('\n')}`
      ).toHaveLength(0)
    })
  })

  describe('Behaviour registry', () => {
    it('behaviour registry exports all behaviours', async () => {
      const registryPath = path.join(
        process.cwd(),
        'creativeshire/experience/behaviours/index.ts'
      )

      if (!(await fileExists(registryPath))) {
        console.warn('Behaviour registry not found at behaviours/index.ts')
        return
      }

      const registryContent = await readFile(registryPath)

      // Get all behaviour folders (trigger categories)
      const triggerFolders = ['scroll', 'hover', 'visibility', 'animation', 'interaction']
      const violations: string[] = []

      for (const trigger of triggerFolders) {
        const behaviourFiles = await getFiles(`experience/behaviours/${trigger}/*.ts`)
        const behaviourNames = behaviourFiles
          .filter(f => !f.endsWith('index.ts'))
          .map(f => path.basename(f, '.ts'))

        for (const name of behaviourNames) {
          // Check if the behaviour is exported (via import.meta.glob or direct export)
          if (!registryContent.includes(name) && !registryContent.includes('import.meta.glob')) {
            violations.push(`${trigger}/${name} not exported from behaviours/index.ts`)
          }
        }
      }

      // If using import.meta.glob, trust it discovers all behaviours
      if (registryContent.includes('import.meta.glob')) {
        return // Auto-discovery pattern - no explicit checks needed
      }

      expect(
        violations,
        `Behaviours missing from registry:\n${violations.join('\n')}`
      ).toHaveLength(0)
    })
  })

  describe('Chrome registry', () => {
    it('all chrome regions are exported', async () => {
      const registryPath = path.join(
        process.cwd(),
        'creativeshire/content/chrome/index.ts'
      )

      if (!(await fileExists(registryPath))) {
        console.warn('Chrome registry not found at chrome/index.ts')
        return
      }

      const registryContent = await readFile(registryPath)

      const regions = await getFiles('content/chrome/regions/*/index.tsx')
      const regionNames = regions.map(f => path.basename(path.dirname(f)))

      const missing = regionNames.filter(name => !registryContent.includes(name))

      expect(
        missing,
        `Chrome regions not exported:\n${missing.join('\n')}`
      ).toHaveLength(0)
    })

    it('all chrome overlays are exported', async () => {
      const registryPath = path.join(
        process.cwd(),
        'creativeshire/content/chrome/index.ts'
      )

      if (!(await fileExists(registryPath))) {
        console.warn('Chrome registry not found at chrome/index.ts')
        return
      }

      const registryContent = await readFile(registryPath)

      const overlays = await getFiles('content/chrome/overlays/*/index.tsx')
      const overlayNames = overlays.map(f => path.basename(path.dirname(f)))

      const missing = overlayNames.filter(name => !registryContent.includes(name))

      expect(
        missing,
        `Chrome overlays not exported:\n${missing.join('\n')}`
      ).toHaveLength(0)
    })
  })

  describe('Section pattern registry', () => {
    it('all section patterns are exported from barrel', async () => {
      const registryPath = path.join(
        process.cwd(),
        'creativeshire/content/sections/patterns/index.ts'
      )

      if (!(await fileExists(registryPath))) {
        console.warn('Section patterns index not found')
        return
      }

      const registryContent = await readFile(registryPath)

      const patterns = await getFiles('content/sections/patterns/*/index.ts')
      const patternNames = patterns
        .map(f => path.basename(path.dirname(f)))
        .filter(name => name !== 'patterns') // Exclude the patterns folder itself

      const missing: string[] = []

      for (const name of patternNames) {
        // Check for export (either direct or re-export)
        // Common patterns: export { createHero } from './Hero'
        //                  export * from './Hero'
        const folderPattern = new RegExp(`from\\s+['\"]\\.\\/\\.\\/${name}['\"]|from\\s+['\"]\\.\\./${name}['\"]|from\\s+['\"]\\.\/${name}['\"]`, 'i')
        if (!folderPattern.test(registryContent) && !registryContent.toLowerCase().includes(name.toLowerCase())) {
          missing.push(name)
        }
      }

      expect(
        missing,
        `Section patterns not exported:\n${missing.join('\n')}`
      ).toHaveLength(0)
    })
  })
})
