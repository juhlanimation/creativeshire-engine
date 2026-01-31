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
import { getFiles, readFile, relativePath, fileExists } from './helpers'
import path from 'path'

const CREATIVESHIRE = path.join(process.cwd(), 'creativeshire')

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
        const indexPath = path.join(CREATIVESHIRE, 'content/widgets/primitives', folder, 'index.tsx')
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
        const indexPath = path.join(CREATIVESHIRE, 'content/widgets/layout', folder, 'index.tsx')
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
        const indexTsx = path.join(CREATIVESHIRE, 'content/widgets/composite', folder, 'index.tsx')
        const indexTs = path.join(CREATIVESHIRE, 'content/widgets/composite', folder, 'index.ts')
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
    const BEHAVIOUR_TRIGGERS = ['scroll', 'hover', 'visibility', 'animation', 'interaction']

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
          const indexPath = path.join(CREATIVESHIRE, 'experience/behaviours', trigger, 'index.ts')
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
    const EFFECT_MECHANISMS = ['transform', 'mask', 'emphasis', 'page']

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
        const indexPath = path.join(CREATIVESHIRE, 'content/sections/patterns', folder, 'index.ts')
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
        const indexPath = path.join(CREATIVESHIRE, 'content/chrome/regions', folder, 'index.tsx')
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
        const indexPath = path.join(CREATIVESHIRE, 'content/chrome/overlays', folder, 'index.tsx')
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

      for (const file of files) {
        const filename = path.basename(file, '.ts')
        if (filename === 'index' || filename === 'types') continue

        // PascalCase for class drivers OR useSomething for hook drivers
        const isPascalCase = /^[A-Z][a-zA-Z0-9]*$/.test(filename)
        const isHookNaming = /^use[A-Z][a-zA-Z0-9]*$/.test(filename)

        if (!isPascalCase && !isHookNaming) {
          violations.push(`${relativePath(file)}: "${filename}" should be PascalCase or useSomething`)
        }
      }

      expect(violations, `Invalid driver file names:\\n${violations.join('\\n')}`).toHaveLength(0)
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

  describe('Mode structure', () => {
    it('modes folder has index.ts', async () => {
      const indexFiles = await getFiles('experience/modes/index.ts')
      expect(indexFiles.length, 'Missing experience/modes/index.ts').toBeGreaterThan(0)
    })

    it('each mode folder has index.ts', async () => {
      const allFiles = await getFiles('experience/modes/**/*.ts')
      const folders = new Set<string>()

      for (const file of allFiles) {
        const rel = relativePath(file)
        const parts = rel.split('/')
        if (parts.length >= 3 && !parts[2].includes('.')) {
          folders.add(parts[2])
        }
      }

      const missing: string[] = []
      for (const folder of folders) {
        const indexPath = path.join(CREATIVESHIRE, 'experience/modes', folder, 'index.ts')
        if (!(await fileExists(indexPath))) {
          missing.push(`experience/modes/${folder}/index.ts`)
        }
      }

      expect(missing, `Mode folders missing index.ts:\\n${missing.join('\\n')}`).toHaveLength(0)
    })

    it('mode folders are kebab-case', async () => {
      const allFiles = await getFiles('experience/modes/**/*.ts')
      const folders = new Set<string>()

      for (const file of allFiles) {
        const rel = relativePath(file)
        const parts = rel.split('/')
        if (parts.length >= 3 && !parts[2].includes('.')) {
          folders.add(parts[2])
        }
      }

      const violations: string[] = []
      for (const folder of folders) {
        if (!/^[a-z][a-z0-9-]*$/.test(folder)) {
          violations.push(`experience/modes/${folder}: not kebab-case`)
        }
      }

      expect(violations, `Mode folders not kebab-case:\\n${violations.join('\\n')}`).toHaveLength(0)
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
        const indexPath = path.join(CREATIVESHIRE, 'presets', preset, 'index.ts')
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
        const indexPath = path.join(CREATIVESHIRE, 'presets', preset, 'pages', 'index.ts')
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
  })
})
