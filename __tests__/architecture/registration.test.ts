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
  fileExists,
} from './helpers'

// Import registries
import { widgetRegistry } from '../../engine/content/widgets/registry'
import { getChromeComponent, getAllChromeMetas, getChromeComponentIds } from '../../engine/content/chrome/registry'
import { behaviourRegistry, getBehaviourIds, getAllBehaviourMetas } from '../../engine/experience/behaviours/registry'
import { effectRegistry } from '../../engine/experience/timeline/primitives/registry'
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
      const files = await getFiles('experience/timeline/primitives/*.ts')
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
      const files = await getFiles('experience/timeline/primitives/*.ts')
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

  describe('Behaviour-Effect Contract', () => {
    it('data-effect attributes in widgets reference existing CSS effect selectors', async () => {
      // 1. Collect all known data-effect selectors from CSS files
      const effectCssFiles = await getFiles('experience/effects/**/*.css')
      const widgetCssFiles = await getFiles('content/**/*.css')
      const allCssFiles = [...effectCssFiles, ...widgetCssFiles]
      const knownEffects = new Set<string>()

      for (const file of allCssFiles) {
        const content = await readFile(file)
        // Match [data-effect~="name"] and [data-effect="name"]
        const matches = content.matchAll(/\[data-effect[~]?=\s*"([^"]+)"\]/g)
        for (const match of matches) {
          knownEffects.add(match[1])
        }
      }

      // 2. Scan widgets, sections, and chrome for data-effect usage in TSX/TS
      const tsxFiles = [
        ...await getFiles('content/**/*.{tsx,ts}'),
        ...await getFiles('experience/**/*.{tsx,ts}'),
      ]
      const violations: string[] = []

      for (const file of tsxFiles) {
        const content = await readFile(file)
        // Match data-effect="xxx" or data-effect: "xxx" or 'data-effect': 'xxx'
        const usages = content.matchAll(/data-effect['":\s]*[=:]\s*['"`]([^'"`]+)['"`]/g)
        for (const match of usages) {
          const effectNames = match[1].split(/\s+/) // data-effect can be space-separated
          for (const effectName of effectNames) {
            if (effectName && !knownEffects.has(effectName)) {
              violations.push(
                `${relativePath(file)}: Uses data-effect="${effectName}" but no CSS selector [data-effect~="${effectName}"] exists`
              )
            }
          }
        }
      }

      if (violations.length > 0) {
        console.log('Unmatched data-effect attributes:')
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

  describe('Content Declarations', () => {
    const VALID_FIELD_TYPES = ['text', 'textarea', 'number', 'toggle', 'image', 'string-list', 'collection']

    it('all section patterns have content.ts or definition.ts', async () => {
      const folders = await getFolders('content/sections/patterns/*')
      const violations: string[] = []

      for (const folder of folders) {
        const name = getComponentName(folder)
        const hasContent = await fileExists(`${folder}/content.ts`)
        const hasDefinition = await fileExists(`${folder}/definition.ts`)
        if (!hasContent && !hasDefinition) {
          violations.push(`Section "${name}" is missing content.ts or definition.ts`)
        }
      }

      expect(violations, `Missing content.ts/definition.ts files:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('section content declarations export valid structure', async () => {
      const folders = await getFolders('content/sections/patterns/*')
      const violations: string[] = []

      for (const folder of folders) {
        const name = getComponentName(folder)
        const hasContent = await fileExists(`${folder}/content.ts`)
        const hasDefinition = await fileExists(`${folder}/definition.ts`)
        // Determine source file: content.ts (old) or definition.ts (new consolidated)
        const sourceFile = hasContent ? 'content.ts' : hasDefinition ? 'definition.ts' : null
        if (!sourceFile) continue

        try {
          const mod = await import(`${folder}/${sourceFile}`)
          const declaration = mod.content

          if (!declaration) {
            violations.push(`${name}/${sourceFile}: missing "content" export`)
            continue
          }
          if (typeof declaration.label !== 'string' || !declaration.label) {
            violations.push(`${name}/${sourceFile}: "label" must be a non-empty string`)
          }
          if (!Array.isArray(declaration.contentFields)) {
            violations.push(`${name}/${sourceFile}: "contentFields" must be an array`)
          }
          if (!declaration.sampleContent || typeof declaration.sampleContent !== 'object') {
            violations.push(`${name}/${sourceFile}: "sampleContent" must be an object`)
          }
        } catch (err) {
          violations.push(`${name}/${sourceFile}: failed to import — ${err}`)
        }
      }

      expect(violations, `Invalid content declarations:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('chrome content declarations export valid structure', async () => {
      const contentFiles = await getFiles('content/chrome/patterns/*/content.ts')
      const violations: string[] = []

      for (const file of contentFiles) {
        const rel = relativePath(file)

        try {
          const mod = await import(file)
          const declaration = mod.content

          if (!declaration) {
            violations.push(`${rel}: missing "content" export`)
            continue
          }
          if (typeof declaration.label !== 'string' || !declaration.label) {
            violations.push(`${rel}: "label" must be a non-empty string`)
          }
          if (!Array.isArray(declaration.contentFields)) {
            violations.push(`${rel}: "contentFields" must be an array`)
          }
          if (!declaration.sampleContent || typeof declaration.sampleContent !== 'object') {
            violations.push(`${rel}: "sampleContent" must be an object`)
          }
        } catch (err) {
          violations.push(`${rel}: failed to import — ${err}`)
        }
      }

      expect(violations, `Invalid chrome content declarations:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('content field types are valid', async () => {
      const sectionFiles = await getFiles('content/sections/patterns/*/content.ts')
      const sectionDefinitionFiles = await getFiles('content/sections/patterns/*/definition.ts')
      const chromeFiles = await getFiles('content/chrome/patterns/*/content.ts')
      const allFiles = [...sectionFiles, ...sectionDefinitionFiles, ...chromeFiles]
      const violations: string[] = []

      function validateFields(fields: unknown[], context: string): void {
        if (!Array.isArray(fields)) return
        for (const field of fields) {
          const f = field as Record<string, unknown>
          if (f.type && !VALID_FIELD_TYPES.includes(f.type as string)) {
            violations.push(`${context}: field "${f.path}" has invalid type "${f.type}"`)
          }
          if (Array.isArray(f.itemFields)) {
            validateFields(f.itemFields, context)
          }
        }
      }

      for (const file of allFiles) {
        const rel = relativePath(file)
        try {
          const mod = await import(file)
          if (mod.content?.contentFields) {
            validateFields(mod.content.contentFields, rel)
          }
        } catch {
          // Import errors caught by the structure test above
        }
      }

      expect(violations, `Invalid content field types:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('content field paths are relative (no namespace prefixes)', async () => {
      const sectionFiles = await getFiles('content/sections/patterns/*/content.ts')
      const sectionDefinitionFiles = await getFiles('content/sections/patterns/*/definition.ts')
      const chromeFiles = await getFiles('content/chrome/patterns/*/content.ts')
      const allFiles = [...sectionFiles, ...sectionDefinitionFiles, ...chromeFiles]
      const violations: string[] = []

      function validatePaths(fields: unknown[], context: string): void {
        if (!Array.isArray(fields)) return
        for (const field of fields) {
          const f = field as Record<string, unknown>
          const path = f.path as string
          if (!path) continue

          // Paths should be relative — reject if first segment is PascalCase (namespace prefix)
          const firstSegment = path.split('.')[0]
          if (/^[A-Z][a-zA-Z]+$/.test(firstSegment)) {
            violations.push(`${context}: field path "${path}" starts with PascalCase "${firstSegment}" — should be relative`)
          }

          // Reject overly deep paths (>3 segments suggests a namespace prefix)
          if (path.split('.').length > 3) {
            violations.push(`${context}: field path "${path}" has >3 segments — may contain a namespace prefix`)
          }

          if (Array.isArray(f.itemFields)) {
            validatePaths(f.itemFields, context)
          }
        }
      }

      for (const file of allFiles) {
        const rel = relativePath(file)
        try {
          const mod = await import(file)
          if (mod.content?.contentFields) {
            validatePaths(mod.content.contentFields, rel)
          }
        } catch {
          // Import errors caught by the structure test above
        }
      }

      expect(violations, `Non-relative content field paths:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })
})
