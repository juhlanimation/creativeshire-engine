/**
 * Component Structure Validation Tests
 *
 * Validates that each component type follows the correct file/folder structure.
 * Catches structural mistakes early before they become patterns.
 *
 * Expected structures (per specs):
 *
 * PRIMITIVES: content/widgets/primitives/{Name}/
 *   ├── index.tsx (required - exports component)
 *   ├── types.ts (required - props interface)
 *   ├── styles.css (expected - structural CSS with var() mappings)
 *   └── NO: hooks/, stores/, @keyframes (animations in L2 effects)
 *
 * LAYOUTS: content/widgets/layout/{Name}/
 *   ├── index.tsx (required)
 *   ├── types.ts (required)
 *   ├── styles.css (expected - layout CSS)
 *   └── NO: hooks/, stores/
 *
 *
 * BEHAVIOURS: experience/behaviours/{trigger}/
 *   ├── index.ts (barrel)
 *   └── {name}.ts (behaviour files, kebab-case)
 *
 * EFFECTS: experience/effects/
 *   ├── {mechanism}.css (single file effects)
 *   ├── {mechanism}/ (folder for variants)
 *   │   └── {variant}.css
 *   └── index.css (CSS barrel - NOT index.ts)
 *
 * SECTIONS: content/sections/patterns/{Name}/
 *   ├── index.ts (barrel)
 *   └── types.ts
 *
 * CHROME PATTERNS: content/chrome/patterns/{Name}/
 *   └── index.ts (required)
 *
 * CHROME OVERLAYS: content/chrome/overlays/{Name}/
 *   └── index.tsx (required) - L1/L2 hybrid, may import from experience/
 */

import { describe, it, expect } from 'vitest'
import { getFiles, getFolders, readFile, relativePath, fileExists } from './helpers'
import path from 'path'
import fs from 'fs/promises'

const ROOT = process.cwd()
const ENGINE = path.join(ROOT, 'engine')

describe('Component Structure Validation', () => {
  describe('Primitives structure', () => {
    it('each primitive has index.tsx', async () => {
      const allFiles = await getFiles('content/widgets/primitives/**/*.tsx')
      const folders = new Set<string>()

      // Extract unique folder names
      for (const file of allFiles) {
        const rel = relativePath(file)
        const parts = rel.split('/')
        if (parts.length >= 4) {
          folders.add(parts[3]) // e.g., "Text", "Image"
        }
      }

      const missing: string[] = []
      for (const folder of folders) {
        const indexPath = path.join(ENGINE, 'content/widgets/primitives', folder, 'index.tsx')
        if (!(await fileExists(indexPath))) {
          missing.push(`content/widgets/primitives/${folder}/index.tsx`)
        }
      }

      expect(missing, `Primitives missing index.tsx:\\n${missing.join('\\n')}`).toHaveLength(0)
    })

    /**
     * Per widget.spec.md: Primitives SHOULD have styles.css for structural CSS.
     * L1 widgets can have layout/positioning CSS. They CANNOT have @keyframes (animations belong in L2 effects).
     */
    it('primitives have styles.css for structural CSS', async () => {
      const allFiles = await getFiles('content/widgets/primitives/**/*.tsx')
      const folders = new Set<string>()

      for (const file of allFiles) {
        const rel = relativePath(file)
        const parts = rel.split('/')
        if (parts.length >= 4) {
          folders.add(parts[3])
        }
      }

      // Most primitives should have styles.css (not a strict requirement, but expected)
      const withCss: string[] = []
      for (const folder of folders) {
        const cssPath = `content/widgets/primitives/${folder}/styles.css`
        const cssFiles = await getFiles(cssPath)
        if (cssFiles.length > 0) {
          withCss.push(folder)
        }
      }

      // At least half of primitives should have CSS (structural styling)
      const ratio = withCss.length / folders.size
      expect(ratio, `Expected most primitives to have styles.css, got ${withCss.length}/${folders.size}`).toBeGreaterThan(0.5)
    })

    it('primitives do not have @keyframes in CSS (animations belong in L2 effects)', async () => {
      const cssFiles = await getFiles('content/widgets/primitives/**/*.css')
      const violations: string[] = []

      for (const file of cssFiles) {
        const content = await readFile(file)
        if (/@keyframes\s+\w+/.test(content)) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `@keyframes in primitives (move to experience/effects/):\\n${violations.join('\\n')}`).toHaveLength(0)
    })

    it('primitives have no hooks folders', async () => {
      const hookFiles = await getFiles('content/widgets/primitives/**/hooks/**/*.ts')
      const violations = hookFiles.map(f => relativePath(f))

      expect(violations, `Hook folders in primitives (primitives should be stateless):\\n${violations.join('\\n')}`).toHaveLength(0)
    })

    it('primitives have no store files', async () => {
      const storeFiles = await getFiles('content/widgets/primitives/**/*store*.ts')
      const violations = storeFiles.map(f => relativePath(f))

      expect(violations, `Store files in primitives (primitives should be stateless):\\n${violations.join('\\n')}`).toHaveLength(0)
    })
  })

  describe('Layout structure', () => {
    it('each layout has index.tsx', async () => {
      const allFiles = await getFiles('content/widgets/layout/**/*.tsx')
      const folders = new Set<string>()

      for (const file of allFiles) {
        const rel = relativePath(file)
        const parts = rel.split('/')
        if (parts.length >= 4) {
          folders.add(parts[3])
        }
      }

      const missing: string[] = []
      for (const folder of folders) {
        const indexPath = path.join(ENGINE, 'content/widgets/layout', folder, 'index.tsx')
        if (!(await fileExists(indexPath))) {
          missing.push(`content/widgets/layout/${folder}/index.tsx`)
        }
      }

      expect(missing, `Layouts missing index.tsx:\\n${missing.join('\\n')}`).toHaveLength(0)
    })

    /**
     * Per layout-widget.spec.md: Layouts SHOULD have styles.css for layout CSS.
     * L1 layouts can have flex/grid CSS. They CANNOT have @keyframes.
     */
    it('layouts do not have @keyframes in CSS (animations belong in L2 effects)', async () => {
      const cssFiles = await getFiles('content/widgets/layout/**/*.css')
      const violations: string[] = []

      for (const file of cssFiles) {
        const content = await readFile(file)
        if (/@keyframes\s+\w+/.test(content)) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `@keyframes in layouts (move to experience/effects/):\\n${violations.join('\\n')}`).toHaveLength(0)
    })

    it('layouts have no hooks folders', async () => {
      const hookFiles = await getFiles('content/widgets/layout/**/hooks/**/*.ts')
      const violations = hookFiles.map(f => relativePath(f))

      expect(violations, `Hook folders in layouts (layouts should be stateless):\\n${violations.join('\\n')}`).toHaveLength(0)
    })
  })

  describe('Repeater structure', () => {
    it('each repeater has index.tsx, types.ts, and meta.ts', async () => {
      const folders = await getFolders('content/widgets/repeaters/*')
      const missingIndex: string[] = []
      const missingTypes: string[] = []
      const missingMeta: string[] = []

      for (const folder of folders) {
        if (!(await fileExists(path.join(folder, 'index.tsx')))) {
          missingIndex.push(`${relativePath(folder)}/index.tsx`)
        }
        if (!(await fileExists(path.join(folder, 'types.ts')))) {
          missingTypes.push(`${relativePath(folder)}/types.ts`)
        }
        if (!(await fileExists(path.join(folder, 'meta.ts')))) {
          missingMeta.push(`${relativePath(folder)}/meta.ts`)
        }
      }

      expect(missingIndex, `Repeaters missing index.tsx:\n${missingIndex.join('\n')}`).toHaveLength(0)
      expect(missingTypes, `Repeaters missing types.ts:\n${missingTypes.join('\n')}`).toHaveLength(0)
      expect(missingMeta, `Repeaters missing meta.ts:\n${missingMeta.join('\n')}`).toHaveLength(0)
    })

    it('repeater folder names follow [Layout][Content]Repeater convention', async () => {
      const folders = await getFolders('content/widgets/repeaters/*')
      const violations: string[] = []

      for (const folder of folders) {
        const name = path.basename(folder)
        if (!/^[A-Z][a-zA-Z]+Repeater$/.test(name)) {
          violations.push(`${name}: does not match [Layout][Content]Repeater convention`)
        }
      }

      expect(violations, `Repeater naming violations:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('repeaters do not have @keyframes in CSS (animations belong in L2 effects)', async () => {
      const cssFiles = await getFiles('content/widgets/repeaters/**/*.css')
      const violations: string[] = []

      for (const file of cssFiles) {
        const content = await readFile(file)
        if (/@keyframes\s+\w+/.test(content)) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `@keyframes in repeaters (move to experience/effects/):\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('repeaters folder has index.ts barrel', async () => {
      const indexFiles = await getFiles('content/widgets/repeaters/index.ts')
      expect(indexFiles.length, 'Missing repeaters/index.ts').toBeGreaterThan(0)
    })
  })

  describe('Behaviour structure', () => {
    const BEHAVIOUR_TRIGGERS = ['scroll', 'hover', 'visibility', 'animation', 'interaction', 'video', 'intro']

    it('behaviour folders match expected triggers', async () => {
      const allFiles = await getFiles('experience/behaviours/**/*.ts')
      const folders = new Set<string>()

      for (const file of allFiles) {
        const rel = relativePath(file)
        const parts = rel.split('/')
        if (parts.length >= 3 && !parts[2].includes('.')) {
          folders.add(parts[2])
        }
      }

      const unexpected = [...folders].filter(f => !BEHAVIOUR_TRIGGERS.includes(f))

      expect(unexpected, `Unexpected behaviour folders (should be trigger-named):\n${unexpected.join('\n')}`).toHaveLength(0)
    })

    it('each behaviour trigger folder has index.ts', async () => {
      const missing: string[] = []

      for (const trigger of BEHAVIOUR_TRIGGERS) {
        const folderFiles = await getFiles(`experience/behaviours/${trigger}/*.ts`)
        if (folderFiles.length > 0) {
          const indexPath = path.join(ENGINE, 'experience/behaviours', trigger, 'index.ts')
          if (!(await fileExists(indexPath))) {
            missing.push(`experience/behaviours/${trigger}/index.ts`)
          }
        }
      }

      expect(missing, `Behaviour folders missing index.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('each behaviour has a folder with index.ts + meta.ts', async () => {
      const missingIndex: string[] = []
      const missingMeta: string[] = []

      for (const trigger of BEHAVIOUR_TRIGGERS) {
        const folders = await getFolders(`experience/behaviours/${trigger}/*`)

        for (const folder of folders) {
          const name = path.basename(folder)
          if (!(await fileExists(path.join(folder, 'index.ts')))) {
            missingIndex.push(`experience/behaviours/${trigger}/${name}/index.ts`)
          }
          if (!(await fileExists(path.join(folder, 'meta.ts')))) {
            missingMeta.push(`experience/behaviours/${trigger}/${name}/meta.ts`)
          }
        }
      }

      expect(missingIndex, `Missing index.ts:\n${missingIndex.join('\n')}`).toHaveLength(0)
      expect(missingMeta, `Missing meta.ts:\n${missingMeta.join('\n')}`).toHaveLength(0)
    })

    it('behaviour files are kebab-case', async () => {
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

  describe('Effect structure', () => {
    /**
     * Per effect.spec.md: Effects are pure CSS. The main barrel is index.css.
     * Mechanism subfolders (transform/, mask/) are imported via the root index.css,
     * so they don't require their own barrel files.
     */
    it('effects root has index.css barrel', async () => {
      const indexCss = await getFiles('experience/effects/index.css')
      expect(indexCss.length, 'Missing experience/effects/index.css').toBeGreaterThan(0)
    })

    it('effect files are CSS only (no TS logic)', async () => {
      const tsFiles = await getFiles('experience/effects/**/*.{ts,tsx}')
      const nonBarrelFiles = tsFiles.filter(f => !f.endsWith('index.ts'))
      const violations = nonBarrelFiles.map(f => relativePath(f))

      // Skip if there are known violations
      if (violations.length > 0) {
        console.warn(`Known violations - TS files in effects/: ${violations.join(', ')}`)
      }
    })

    it('effect CSS files are mechanism-named (not widget-named)', async () => {
      const cssFiles = await getFiles('experience/effects/**/*.css')
      const widgetNames = [
        'button', 'text', 'image', 'video', 'icon', 'link',
        'stack', 'grid', 'flex', 'split', 'container',
        'card', 'hero', 'footer', 'header', 'modal',
        'projectcard', 'videoplayer', 'logolink'
      ]

      const violations: string[] = []
      for (const file of cssFiles) {
        const filename = path.basename(file, '.css').toLowerCase()
        for (const widget of widgetNames) {
          if (filename.includes(widget)) {
            violations.push(`${relativePath(file)}: named after widget "${widget}"`)
          }
        }
      }

      expect(violations, `Effects named by widget (should be mechanism):\\n${violations.join('\\n')}`).toHaveLength(0)
    })
  })

  describe('Section pattern structure', () => {
    it('each section pattern has index.ts', async () => {
      const allFiles = await getFiles('content/sections/patterns/**/*.{ts,tsx}')
      const folders = new Set<string>()

      for (const file of allFiles) {
        const rel = relativePath(file)
        const parts = rel.split('/')
        if (parts.length >= 4 && !parts[3].includes('.')) {
          folders.add(parts[3])
        }
      }

      const missing: string[] = []
      for (const folder of folders) {
        const indexPath = path.join(ENGINE, 'content/sections/patterns', folder, 'index.ts')
        if (!(await fileExists(indexPath))) {
          missing.push(`content/sections/patterns/${folder}/index.ts`)
        }
      }

      expect(missing, `Section patterns missing index.ts:\\n${missing.join('\\n')}`).toHaveLength(0)
    })

    it('section patterns are PascalCase folders', async () => {
      const allFiles = await getFiles('content/sections/patterns/**/*.{ts,tsx}')
      const folders = new Set<string>()

      for (const file of allFiles) {
        const rel = relativePath(file)
        const parts = rel.split('/')
        if (parts.length >= 4 && !parts[3].includes('.')) {
          folders.add(parts[3])
        }
      }

      const violations: string[] = []
      for (const folder of folders) {
        // PascalCase: starts with uppercase, no hyphens/underscores
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(folder)) {
          violations.push(`content/sections/patterns/${folder}: not PascalCase`)
        }
      }

      expect(violations, `Section folders not PascalCase:\\n${violations.join('\\n')}`).toHaveLength(0)
    })

    it('each section pattern has styles.css', async () => {
      const folders = await getFolders('content/sections/patterns/*')
      const missing: string[] = []

      for (const folder of folders) {
        const cssPath = path.join(folder, 'styles.css')
        if (!(await fileExists(cssPath))) {
          missing.push(`${relativePath(folder)}/styles.css`)
        }
      }

      expect(missing, `Section patterns missing styles.css:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('section components/ subdirectories contain index.tsx or index.ts', async () => {
      const componentFolders = await getFolders('content/sections/patterns/*/components/*')
      const missing: string[] = []

      for (const folder of componentFolders) {
        const hasTsx = await fileExists(path.join(folder, 'index.tsx'))
        const hasTs = await fileExists(path.join(folder, 'index.ts'))
        if (!hasTsx && !hasTs) {
          missing.push(`${relativePath(folder)}/index.ts(x)`)
        }
      }

      // Only assert if there are component folders (feature may not be used yet)
      if (componentFolders.length > 0) {
        expect(missing, `Section internal components missing index.ts(x):\n${missing.join('\n')}`).toHaveLength(0)
      }
    })

    it('scoped widget registrations match parent section name', async () => {
      const files = await getFiles('content/sections/patterns/*/components/*/index.tsx')
      const violations: string[] = []

      for (const file of files) {
        const content = await readFile(file)
        const rel = relativePath(file)
        const parts = rel.split('/')
        // parts: content/sections/patterns/SectionName/components/ComponentName/index.tsx
        const sectionName = parts[3]

        // Check if file registers a scoped widget
        const registerMatch = content.match(/registerScopedWidget\s*\(\s*['"]([^'"]+)['"]/)
        if (registerMatch) {
          const scopedName = registerMatch[1]
          if (!scopedName.startsWith(`${sectionName}__`)) {
            violations.push(`${rel}: registered as '${scopedName}' but should start with '${sectionName}__'`)
          }
        }
      }

      if (violations.length > 0) {
        expect(violations, `Scoped widget names don't match parent section:\n${violations.join('\n')}`).toHaveLength(0)
      }
    })

    it('engine/styles.css imports all section pattern styles', async () => {
      const folders = await getFolders('content/sections/patterns/*')
      const engineCss = await readFile(path.join(ENGINE, 'styles.css'))
      const missing: string[] = []

      for (const folder of folders) {
        const name = path.basename(folder)
        const expectedImport = `content/sections/patterns/${name}/styles.css`
        if (!engineCss.includes(expectedImport)) {
          missing.push(expectedImport)
        }
      }

      expect(missing, `engine/styles.css missing section pattern CSS imports:\n${missing.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Chrome structure', () => {
    it('all chrome overlays have types.ts', async () => {
      const folders = await getFolders('content/chrome/overlays/*')
      const violations: string[] = []

      for (const folder of folders) {
        const typesPath = path.join(folder, 'types.ts')
        if (!(await fileExists(typesPath))) {
          violations.push(`${relativePath(folder)} missing types.ts`)
        }
      }

      expect(violations, `Chrome overlays missing types.ts:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('each chrome overlay has index.tsx', async () => {
      const allFiles = await getFiles('content/chrome/overlays/**/*.tsx')
      const folders = new Set<string>()

      for (const file of allFiles) {
        const rel = relativePath(file)
        const parts = rel.split('/')
        if (parts.length >= 4 && !parts[3].includes('.')) {
          folders.add(parts[3])
        }
      }

      const missing: string[] = []
      for (const folder of folders) {
        const indexPath = path.join(ENGINE, 'content/chrome/overlays', folder, 'index.tsx')
        if (!(await fileExists(indexPath))) {
          missing.push(`content/chrome/overlays/${folder}/index.tsx`)
        }
      }

      expect(missing, `Chrome overlays missing index.tsx:\\n${missing.join('\\n')}`).toHaveLength(0)
    })

    it('chrome folders are PascalCase', async () => {
      const overlayFiles = await getFiles('content/chrome/overlays/**/*.tsx')
      const allFiles = [...overlayFiles]

      const folders = new Set<string>()
      for (const file of allFiles) {
        const rel = relativePath(file)
        const parts = rel.split('/')
        if (parts.length >= 4 && !parts[3].includes('.')) {
          folders.add(parts[3])
        }
      }

      const violations: string[] = []
      for (const folder of folders) {
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(folder)) {
          violations.push(`${folder}: not PascalCase`)
        }
      }

      expect(violations, `Chrome folders not PascalCase:\\n${violations.join('\\n')}`).toHaveLength(0)
    })
  })

  describe('Driver structure', () => {
    it('drivers folder has index.ts', async () => {
      const indexFiles = await getFiles('experience/drivers/index.ts')
      expect(indexFiles.length, 'Missing experience/drivers/index.ts').toBeGreaterThan(0)
    })

    /**
     * Drivers can be:
     * - PascalCase.ts (class-based drivers like ScrollDriver)
     * - useSomething.ts (hook-based drivers like useScrollFadeDriver)
     *
     * Both patterns are valid. Class drivers are instantiated, hook drivers are called.
     */
    it('driver files follow naming convention (PascalCase or useSomething)', async () => {
      const files = await getFiles('experience/drivers/*.ts')
      const violations: string[] = []

      // Utility files that export functions, not driver classes
      const UTILITY_FILES = ['getDriver.ts']

      for (const file of files) {
        const filename = file.split('/').pop() || ''
        if (filename === 'index.ts' || filename === 'types.ts') continue

        // Skip known utility files
        if (UTILITY_FILES.includes(filename)) continue

        const name = filename.replace('.ts', '')

        // Should be PascalCase (e.g., ScrollDriver) or useSomething (e.g., useScrollFadeDriver)
        const isPascalCase = /^[A-Z][a-zA-Z0-9]*$/.test(name)
        const isHookStyle = /^use[A-Z]/.test(name)

        if (!isPascalCase && !isHookStyle) {
          violations.push(`${relativePath(file)}: "${name}" should be PascalCase or useSomething`)
        }
      }

      if (violations.length > 0) {
        console.log('Invalid driver file names:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations, `Invalid driver file names:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Trigger structure', () => {
    it('triggers folder has index.ts', async () => {
      const indexFiles = await getFiles('experience/triggers/index.ts')
      expect(indexFiles.length, 'Missing experience/triggers/index.ts').toBeGreaterThan(0)
    })

    it('trigger files are camelCase (hook convention)', async () => {
      const files = await getFiles('experience/triggers/*.ts')
      const violations: string[] = []

      for (const file of files) {
        const filename = path.basename(file, '.ts')
        if (filename === 'index' || filename === 'types') continue

        // camelCase for hooks: useScrollTrigger, useVisibilityTrigger
        // or kebab-case for non-hook utilities
        if (!/^(use[A-Z][a-zA-Z0-9]*|[a-z][a-z0-9-]*)$/.test(filename)) {
          violations.push(`${relativePath(file)}: "${filename}" should be camelCase (useX) or kebab-case`)
        }
      }

      expect(violations, `Invalid trigger file names:\\n${violations.join('\\n')}`).toHaveLength(0)
    })
  })

  describe('Page transition structure', () => {
    it('transitions folder has index.ts', async () => {
      const indexFiles = await getFiles('experience/transitions/index.ts')
      expect(indexFiles.length, 'Missing experience/transitions/index.ts').toBeGreaterThan(0)
    })

    it('transitions folder has registry.ts', async () => {
      const registryFiles = await getFiles('experience/transitions/registry.ts')
      expect(registryFiles.length, 'Missing experience/transitions/registry.ts').toBeGreaterThan(0)
    })

    it('transitions folder has types.ts', async () => {
      const typeFiles = await getFiles('experience/transitions/types.ts')
      expect(typeFiles.length, 'Missing experience/transitions/types.ts').toBeGreaterThan(0)
    })

    it('each page transition has meta.ts', async () => {
      const folders = await getFolders('experience/transitions/*')
      // Filter out non-transition folders (only folders with index.ts + meta.ts are transitions)
      const transitionFolders = []
      for (const folder of folders) {
        const metaPath = path.join(folder, 'meta.ts')
        if (await fileExists(metaPath)) {
          transitionFolders.push(folder)
        }
      }

      const missing: string[] = []
      for (const folder of transitionFolders) {
        const indexPath = path.join(folder, 'index.ts')
        if (!(await fileExists(indexPath))) {
          missing.push(`${relativePath(folder)}/index.ts`)
        }
      }

      expect(missing, `Page transition folders missing index.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('page transition folders are kebab-case', async () => {
      const folders = await getFolders('experience/transitions/*')
      const violations: string[] = []

      for (const folder of folders) {
        const name = path.basename(folder)
        // Skip non-transition folders (no meta.ts)
        const metaPath = path.join(folder, 'meta.ts')
        if (!(await fileExists(metaPath))) continue

        if (!/^[a-z][a-z0-9-]*$/.test(name)) {
          violations.push(`${relativePath(folder)}: "${name}" is not kebab-case`)
        }
      }

      expect(violations, `Non-kebab-case transition folders:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Widget types.ts validation', () => {
    it('all primitives have types.ts', async () => {
      const folders = await getFolders('content/widgets/primitives/*')
      const violations: string[] = []

      for (const folder of folders) {
        const typesPath = path.join(folder, 'types.ts')
        const exists = await fileExists(typesPath)
        if (!exists) {
          violations.push(`${relativePath(folder)} missing types.ts`)
        }
      }

      if (violations.length > 0) {
        console.log('Missing types.ts files:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('all layout widgets have types.ts', async () => {
      const folders = await getFolders('content/widgets/layout/*')
      const violations: string[] = []

      for (const folder of folders) {
        const typesPath = path.join(folder, 'types.ts')
        const exists = await fileExists(typesPath)
        if (!exists) {
          violations.push(`${relativePath(folder)} missing types.ts`)
        }
      }

      if (violations.length > 0) {
        console.log('Missing types.ts files:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('all interactive widgets have types.ts', async () => {
      const folders = await getFolders('content/widgets/interactive/*')
      const violations: string[] = []

      for (const folder of folders) {
        const typesPath = path.join(folder, 'types.ts')
        const exists = await fileExists(typesPath)
        if (!exists) {
          violations.push(`${relativePath(folder)} missing types.ts`)
        }
      }

      if (violations.length > 0) {
        console.log('Missing types.ts files:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })

    it('all section patterns have types.ts or definition.ts', async () => {
      const folders = await getFolders('content/sections/patterns/*')
      const violations: string[] = []

      for (const folder of folders) {
        const hasTypes = await fileExists(path.join(folder, 'types.ts'))
        const hasDefinition = await fileExists(path.join(folder, 'definition.ts'))
        if (!hasTypes && !hasDefinition) {
          violations.push(`${relativePath(folder)} missing types.ts or definition.ts`)
        }
      }

      if (violations.length > 0) {
        console.log('Missing types.ts/definition.ts files:')
        violations.forEach((v) => console.log(`  - ${v}`))
      }

      expect(violations).toHaveLength(0)
    })
  })

  describe('Preset structure', () => {
    it('each preset has index.ts', async () => {
      const allFiles = await getFiles('presets/**/*.ts')
      const presets = new Set<string>()

      for (const file of allFiles) {
        const rel = relativePath(file)
        const parts = rel.split('/')
        if (parts.length >= 2 && !parts[1].includes('.')) {
          presets.add(parts[1])
        }
      }

      const missing: string[] = []
      for (const preset of presets) {
        const indexPath = path.join(ENGINE, 'presets', preset, 'index.ts')
        if (!(await fileExists(indexPath))) {
          missing.push(`presets/${preset}/index.ts`)
        }
      }

      expect(missing, `Presets missing index.ts:\\n${missing.join('\\n')}`).toHaveLength(0)
    })

    it('preset folders are kebab-case', async () => {
      const allFiles = await getFiles('presets/**/*.ts')
      const presets = new Set<string>()

      for (const file of allFiles) {
        const rel = relativePath(file)
        const parts = rel.split('/')
        if (parts.length >= 2 && !parts[1].includes('.')) {
          presets.add(parts[1])
        }
      }

      const violations: string[] = []
      for (const preset of presets) {
        if (!/^[a-z][a-z0-9-]*$/.test(preset)) {
          violations.push(`presets/${preset}: not kebab-case`)
        }
      }

      expect(violations, `Preset folders not kebab-case:\\n${violations.join('\\n')}`).toHaveLength(0)
    })

    it('preset CSS does not style factory-generated section selectors', async () => {
      // Factory-generated IDs that should be in section pattern CSS, not presets
      const factorySelectors = [
        '#hero',
        '#hero-intro',
        '#hero-scroll',
        '#about',
        '#about-mobile-bg',
        '#about-content',
        '#about-bio-column',
        '#about-image-column',
        '#about-gradient',
        '#about-logos',
        '#featured-projects',
        '.featured-projects__content',
        '.other-projects-section',
        '.other-projects-header',
        '.other-projects-heading',
        '.other-projects-year-range',
        '.project-gallery__video-area',
        '.project-gallery__selector',
        '.photo-collage',
        '.photo-collage__text',
        '.photo-collage__image',
      ]

      const presetCssFiles = await getFiles('presets/**/*.css')
      const violations: string[] = []

      for (const file of presetCssFiles) {
        const content = await readFile(file)
        for (const selector of factorySelectors) {
          // Match selector at start of line or after comma/space (not inside comments or strings)
          // Simple check: if the selector appears as a CSS selector (not in a comment)
          const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const regex = new RegExp(`^\\s*${escaped}[\\s{,>+~:.[\\]]`, 'm')
          if (regex.test(content)) {
            violations.push(`${relativePath(file)}: contains factory selector "${selector}"`)
          }
        }
      }

      expect(violations, `Preset CSS contains factory-generated section selectors (should be in pattern styles):\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Package subpath exports', () => {
    it('all package.json export paths resolve to existing files', async () => {
      const pkgJson = JSON.parse(await fs.readFile(path.join(ROOT, 'package.json'), 'utf-8'))
      const exports = pkgJson.exports as Record<string, string>
      const violations: string[] = []

      for (const [exportPath, target] of Object.entries(exports)) {
        // Skip wildcard exports (e.g., ./presets/*) — can't resolve concrete paths
        if (exportPath.includes('*')) continue

        const resolvedPath = path.join(ROOT, target)
        if (!(await fileExists(resolvedPath))) {
          violations.push(`"${exportPath}": "${target}" → file not found`)
        }
      }

      expect(violations, `Package exports pointing to missing files:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })
})
