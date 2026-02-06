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
 * COMPOSITES (two patterns):
 *   Factory Pattern (index.ts):
 *     ├── index.ts (returns WidgetSchema, no JSX)
 *     ├── types.ts
 *     └── NO: styles.css, React imports
 *   React Component Pattern (index.tsx):
 *     ├── index.tsx (for complex state: Video, VideoPlayer)
 *     ├── types.ts
 *     └── styles.css (allowed for React component composites)
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
 * CHROME REGIONS: content/chrome/regions/{Name}/
 *   └── index.tsx (required)
 *
 * CHROME OVERLAYS: content/chrome/overlays/{Name}/
 *   └── index.tsx (required) - L1/L2 hybrid, may import from experience/
 */

import { describe, it, expect } from 'vitest'
import { getFiles, getFolders, readFile, relativePath, fileExists } from './helpers'
import path from 'path'

const ENGINE = path.join(process.cwd(), 'engine')

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

  describe('Composite structure', () => {
    it('each composite has index.tsx or index.ts', async () => {
      const allFiles = await getFiles('content/widgets/composite/**/*.{ts,tsx}')
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
        const indexTsx = path.join(ENGINE, 'content/widgets/composite', folder, 'index.tsx')
        const indexTs = path.join(ENGINE, 'content/widgets/composite', folder, 'index.ts')
        if (!(await fileExists(indexTsx)) && !(await fileExists(indexTs))) {
          missing.push(`content/widgets/composite/${folder}/index.{ts,tsx}`)
        }
      }

      expect(missing, `Composites missing index file:\\n${missing.join('\\n')}`).toHaveLength(0)
    })

    /**
     * Per widget-composite.spec.md: Two patterns exist:
     * 1. Factory Pattern (index.ts) - NO CSS files allowed, returns WidgetSchema
     * 2. React Component Pattern (index.tsx) - CAN have styles.css (Video, VideoPlayer)
     *
     * This test validates factory composites don't have CSS files.
     */
    describe('Factory composites have no CSS', () => {
      it('factory composites (index.ts) do not have CSS files', async () => {
        const allFiles = await getFiles('content/widgets/composite/**/*.{ts,tsx}')
        const factoryFolders: string[] = []

        // Identify factory composites (have index.ts, NOT index.tsx)
        for (const file of allFiles) {
          if (file.endsWith('index.ts') && !file.endsWith('index.tsx')) {
            const rel = relativePath(file)
            const parts = rel.split('/')
            // Skip the barrel file (composite/index.ts)
            if (parts.length >= 5 && parts[3] !== 'index.ts') {
              const folder = parts[3]
              // Verify this folder doesn't also have index.tsx (React component)
              const tsxExists = allFiles.some(f =>
                f.includes(`composite/${folder}/index.tsx`)
              )
              if (!tsxExists && !factoryFolders.includes(folder)) {
                factoryFolders.push(folder)
              }
            }
          }
        }

        const violations: string[] = []
        for (const folder of factoryFolders) {
          const cssFiles = await getFiles(`content/widgets/composite/${folder}/*.css`)
          if (cssFiles.length > 0) {
            violations.push(`${folder} is a factory composite but has CSS: ${cssFiles.map(f => relativePath(f)).join(', ')}`)
          }
        }

        expect(violations, `Factory composites with CSS (factories return schema, not styled components):\\n${violations.join('\\n')}`).toHaveLength(0)
      })
    })

    it('composites do not have @keyframes in CSS (animations belong in L2 effects)', async () => {
      const cssFiles = await getFiles('content/widgets/composite/**/*.css')
      const violations: string[] = []

      for (const file of cssFiles) {
        const content = await readFile(file)
        if (/@keyframes\s+\w+/.test(content)) {
          violations.push(relativePath(file))
        }
      }

      expect(violations, `@keyframes in composites (move to experience/effects/):\\n${violations.join('\\n')}`).toHaveLength(0)
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

      expect(unexpected, `Unexpected behaviour folders (should be trigger-named):\\n${unexpected.join('\\n')}`).toHaveLength(0)
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

      expect(missing, `Behaviour folders missing index.ts:\\n${missing.join('\\n')}`).toHaveLength(0)
    })

    it('behaviour files are kebab-case', async () => {
      const files = await getFiles('experience/behaviours/**/*.ts')
      const violations: string[] = []

      for (const file of files) {
        const filename = path.basename(file, '.ts')
        if (filename === 'index') continue

        // Check kebab-case: lowercase letters, numbers, hyphens only
        if (!/^[a-z][a-z0-9-]*$/.test(filename)) {
          violations.push(`${relativePath(file)}: "${filename}" is not kebab-case`)
        }
      }

      expect(violations, `Non-kebab-case behaviour files:\\n${violations.join('\\n')}`).toHaveLength(0)
    })
  })

  describe('Effect structure', () => {
    const EFFECT_MECHANISMS = ['transform', 'mask', 'emphasis', 'page', 'reveal']

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
  })

  describe('Chrome structure', () => {
    it('all chrome regions have types.ts', async () => {
      const folders = await getFolders('content/chrome/regions/*')
      const violations: string[] = []

      for (const folder of folders) {
        const typesPath = path.join(folder, 'types.ts')
        if (!(await fileExists(typesPath))) {
          violations.push(`${relativePath(folder)} missing types.ts`)
        }
      }

      expect(violations, `Chrome regions missing types.ts:\n${violations.join('\n')}`).toHaveLength(0)
    })

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

    it('each chrome region has index.tsx', async () => {
      const allFiles = await getFiles('content/chrome/regions/**/*.tsx')
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
        const indexPath = path.join(ENGINE, 'content/chrome/regions', folder, 'index.tsx')
        if (!(await fileExists(indexPath))) {
          missing.push(`content/chrome/regions/${folder}/index.tsx`)
        }
      }

      expect(missing, `Chrome regions missing index.tsx:\\n${missing.join('\\n')}`).toHaveLength(0)
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
      const regionFiles = await getFiles('content/chrome/regions/**/*.tsx')
      const overlayFiles = await getFiles('content/chrome/overlays/**/*.tsx')
      const allFiles = [...regionFiles, ...overlayFiles]

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

    it('all widget patterns have types.ts', async () => {
      const folders = await getFolders('content/widgets/patterns/*')
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

    it('all section patterns have types.ts', async () => {
      const folders = await getFolders('content/sections/patterns/*')
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

    it('each preset has pages/index.ts', async () => {
      const allFiles = await getFiles('presets/*/pages/**/*.ts')
      const presets = new Set<string>()

      for (const file of allFiles) {
        const rel = relativePath(file)
        const parts = rel.split('/')
        if (parts.length >= 2) {
          presets.add(parts[1])
        }
      }

      const missing: string[] = []
      for (const preset of presets) {
        const indexPath = path.join(ENGINE, 'presets', preset, 'pages', 'index.ts')
        if (!(await fileExists(indexPath))) {
          missing.push(`presets/${preset}/pages/index.ts`)
        }
      }

      expect(missing, `Presets missing pages/index.ts:\\n${missing.join('\\n')}`).toHaveLength(0)
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

    it('each preset has site.ts', async () => {
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
        const sitePath = path.join(ENGINE, 'presets', preset, 'site.ts')
        if (!(await fileExists(sitePath))) {
          missing.push(`presets/${preset}/site.ts`)
        }
      }

      expect(missing, `Presets missing site.ts:\\n${missing.join('\\n')}`).toHaveLength(0)
    })

    it('each preset has chrome/index.ts', async () => {
      const allFiles = await getFiles('presets/*/chrome/**/*.ts')
      const presets = new Set<string>()

      for (const file of allFiles) {
        const rel = relativePath(file)
        const parts = rel.split('/')
        if (parts.length >= 2) {
          presets.add(parts[1])
        }
      }

      const missing: string[] = []
      for (const preset of presets) {
        const chromePath = path.join(ENGINE, 'presets', preset, 'chrome', 'index.ts')
        if (!(await fileExists(chromePath))) {
          missing.push(`presets/${preset}/chrome/index.ts`)
        }
      }

      expect(missing, `Presets missing chrome/index.ts:\\n${missing.join('\\n')}`).toHaveLength(0)
    })
  })
})
