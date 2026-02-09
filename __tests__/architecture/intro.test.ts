/**
 * Intro Module Architecture Tests
 *
 * Validates the intro module structure and registration:
 * - Folder structure follows conventions
 * - Patterns are registered
 * - Types are exported correctly
 * - Triggers follow hook naming convention
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { getFiles, getFolders, readFile, relativePath, fileExists } from './helpers'
import path from 'path'

const ENGINE = path.join(process.cwd(), 'engine')

describe('Intro Sequence-Timed Pattern', () => {
  it('sequence-timed pattern folder exists with index.ts + meta.ts', async () => {
    const patternPath = path.join(ENGINE, 'intro', 'patterns', 'sequence-timed')
    expect(await fileExists(patternPath), 'sequence-timed folder should exist').toBe(true)
    expect(await fileExists(path.join(patternPath, 'index.ts')), 'index.ts should exist').toBe(true)
    expect(await fileExists(path.join(patternPath, 'meta.ts')), 'meta.ts should exist').toBe(true)
  })

  it('useSequence trigger file exists', async () => {
    const triggerPath = path.join(ENGINE, 'intro', 'triggers', 'useSequence.ts')
    expect(await fileExists(triggerPath), 'useSequence.ts should exist').toBe(true)
  })

  it('IntroOverlay component exists in chrome/overlays/', async () => {
    const overlayPath = path.join(ENGINE, 'content', 'chrome', 'overlays', 'IntroOverlay')
    expect(await fileExists(overlayPath), 'IntroOverlay folder should exist').toBe(true)
    expect(await fileExists(path.join(overlayPath, 'index.tsx')), 'index.tsx should exist').toBe(true)
    expect(await fileExists(path.join(overlayPath, 'types.ts')), 'types.ts should exist').toBe(true)
  })

  it('IntroOverlay is configured in preset intro config (not chrome overlays)', async () => {
    // Bojuhl preset
    const bojuhlSite = path.join(ENGINE, 'presets', 'bojuhl', 'site.ts')
    const bojuhlContent = await readFile(bojuhlSite)
    expect(bojuhlContent, 'bojuhl site.ts should have overlay in intro config').toContain("component: 'IntroOverlay'")

    // Bishoy-gendi preset
    const bgSite = path.join(ENGINE, 'presets', 'bishoy-gendi', 'site.ts')
    const bgContent = await readFile(bgSite)
    expect(bgContent, 'bishoy-gendi site.ts should have overlay in intro config').toContain("component: 'IntroOverlay'")
  })

  it('IntroOverlay is NOT in preset chrome overlays', async () => {
    // Bojuhl preset
    const bojuhlIndex = path.join(ENGINE, 'presets', 'bojuhl', 'index.ts')
    const bojuhlContent = await readFile(bojuhlIndex)
    expect(bojuhlContent, 'bojuhl should not have introOverlay in chrome').not.toContain('introOverlay')

    // Bishoy-gendi chrome config
    const bgChrome = path.join(ENGINE, 'presets', 'bishoy-gendi', 'chrome', 'index.ts')
    const bgContent = await readFile(bgChrome)
    expect(bgContent, 'bishoy-gendi should not have introOverlay in chrome').not.toContain('introOverlay')
  })

  it('TextMask widget exists in widgets/interactive/', async () => {
    const widgetPath = path.join(ENGINE, 'content', 'widgets', 'interactive', 'TextMask')
    expect(await fileExists(widgetPath), 'TextMask folder should exist').toBe(true)
    expect(await fileExists(path.join(widgetPath, 'index.tsx')), 'index.tsx should exist').toBe(true)
    expect(await fileExists(path.join(widgetPath, 'types.ts')), 'types.ts should exist').toBe(true)
    expect(await fileExists(path.join(widgetPath, 'meta.ts')), 'meta.ts should exist').toBe(true)
  })

  it('intro/step behaviour exists', async () => {
    const behaviourPath = path.join(ENGINE, 'experience', 'behaviours', 'intro', 'step.ts')
    expect(await fileExists(behaviourPath), 'intro/step.ts should exist').toBe(true)
  })

  it('intro/step behaviour has correct ID', async () => {
    const behaviourPath = path.join(ENGINE, 'experience', 'behaviours', 'intro', 'step.ts')
    const content = await readFile(behaviourPath)
    expect(content).toContain("'intro/step'")
  })

  it('sequence-timed pattern is registered', async () => {
    const { ensureIntroPatternsRegistered, getIntroPatternIds } = await import('../../engine/intro')
    ensureIntroPatternsRegistered()
    const patternIds = getIntroPatternIds()
    expect(patternIds).toContain('sequence-timed')
  })

  it('SequenceStepConfig type is exported from intro barrel', async () => {
    const indexPath = path.join(ENGINE, 'intro', 'index.ts')
    const content = await readFile(indexPath)
    expect(content).toContain('SequenceStepConfig')
  })

  it('useSequence is exported from triggers barrel', async () => {
    const indexPath = path.join(ENGINE, 'intro', 'triggers', 'index.ts')
    const content = await readFile(indexPath)
    expect(content).toContain('useSequence')
  })
})

describe('Intro Module Structure', () => {
  describe('Folder structure', () => {
    it('intro/ folder exists', async () => {
      const introPath = path.join(ENGINE, 'intro')
      const exists = await fileExists(introPath)
      expect(exists, 'engine/intro/ folder should exist').toBe(true)
    })

    it('intro/ has required files', async () => {
      const requiredFiles = [
        'index.ts',
        'types.ts',
        'registry.ts',
        'IntroProvider.tsx',
        'IntroContext.ts',
        'IntroTriggerInitializer.tsx',
      ]
      const missing: string[] = []

      for (const file of requiredFiles) {
        const filePath = path.join(ENGINE, 'intro', file)
        if (!(await fileExists(filePath))) {
          missing.push(`intro/${file}`)
        }
      }

      expect(missing, `Missing required files:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('intro/patterns/ folder exists', async () => {
      const patternsPath = path.join(ENGINE, 'intro', 'patterns')
      const exists = await fileExists(patternsPath)
      expect(exists, 'engine/intro/patterns/ folder should exist').toBe(true)
    })

    it('intro/triggers/ folder exists', async () => {
      const triggersPath = path.join(ENGINE, 'intro', 'triggers')
      const exists = await fileExists(triggersPath)
      expect(exists, 'engine/intro/triggers/ folder should exist').toBe(true)
    })
  })

  describe('Pattern structure', () => {
    const EXPECTED_PATTERNS = ['video-gate', 'timed', 'scroll-reveal', 'sequence-timed']

    it('all expected pattern folders exist', async () => {
      const missing: string[] = []

      for (const pattern of EXPECTED_PATTERNS) {
        const patternPath = path.join(ENGINE, 'intro', 'patterns', pattern)
        if (!(await fileExists(patternPath))) {
          missing.push(`intro/patterns/${pattern}`)
        }
      }

      expect(missing, `Missing pattern folders:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('each pattern folder has index.ts', async () => {
      const folders = await getFolders('intro/patterns/*')
      const missing: string[] = []

      for (const folder of folders) {
        const indexPath = path.join(folder, 'index.ts')
        if (!(await fileExists(indexPath))) {
          missing.push(`${relativePath(folder)}/index.ts`)
        }
      }

      expect(missing, `Pattern folders missing index.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('each pattern folder has meta.ts', async () => {
      const folders = await getFolders('intro/patterns/*')
      const missing: string[] = []

      for (const folder of folders) {
        const metaPath = path.join(folder, 'meta.ts')
        if (!(await fileExists(metaPath))) {
          missing.push(`${relativePath(folder)}/meta.ts`)
        }
      }

      expect(missing, `Pattern folders missing meta.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('pattern folders are kebab-case', async () => {
      const folders = await getFolders('intro/patterns/*')
      const violations: string[] = []

      for (const folder of folders) {
        const name = path.basename(folder)
        // kebab-case: lowercase letters, numbers, hyphens only
        if (!/^[a-z][a-z0-9-]*$/.test(name)) {
          violations.push(`${relativePath(folder)}: "${name}" is not kebab-case`)
        }
      }

      expect(violations, `Non-kebab-case pattern folders:\n${violations.join('\n')}`).toHaveLength(0)
    })

    it('patterns/index.ts exports all patterns', async () => {
      const indexPath = path.join(ENGINE, 'intro', 'patterns', 'index.ts')
      const content = await readFile(indexPath)

      const missingExports: string[] = []
      for (const pattern of EXPECTED_PATTERNS) {
        // Convert kebab-case to pattern name (video-gate -> videoGatePattern)
        const camelCase = pattern.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
        const exportName = `${camelCase}Pattern`

        if (!content.includes(exportName)) {
          missingExports.push(exportName)
        }
      }

      expect(missingExports, `Missing exports in patterns/index.ts:\n${missingExports.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Trigger structure', () => {
    const EXPECTED_TRIGGERS = ['useVideoTime', 'useTimer', 'useSequence', 'usePhaseController']

    it('triggers/index.ts has barrel exports', async () => {
      const indexPath = path.join(ENGINE, 'intro', 'triggers', 'index.ts')
      const exists = await fileExists(indexPath)
      expect(exists, 'triggers/index.ts should exist').toBe(true)
    })

    it('all expected trigger files exist', async () => {
      const missing: string[] = []

      for (const trigger of EXPECTED_TRIGGERS) {
        const triggerPath = path.join(ENGINE, 'intro', 'triggers', `${trigger}.ts`)
        if (!(await fileExists(triggerPath))) {
          missing.push(`intro/triggers/${trigger}.ts`)
        }
      }

      expect(missing, `Missing trigger files:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('trigger files follow hook naming convention (useX)', async () => {
      const files = await getFiles('intro/triggers/*.ts')
      const violations: string[] = []

      for (const file of files) {
        const filename = path.basename(file, '.ts')
        if (filename === 'index' || filename === 'types') continue

        // Hook convention: useSomething
        if (!/^use[A-Z]/.test(filename)) {
          violations.push(`${relativePath(file)}: "${filename}" should start with "use"`)
        }
      }

      expect(violations, `Non-hook trigger files:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Type exports', () => {
    it('index.ts exports all required types', async () => {
      const indexPath = path.join(ENGINE, 'intro', 'index.ts')
      const content = await readFile(indexPath)

      const requiredExports = [
        'IntroPhase',
        'IntroState',
        'IntroConfig',
        'IntroPatternMeta',
        'IntroPattern',
        'IntroTriggerConfig',
        'IntroActions',
      ]

      const missing: string[] = []
      for (const exp of requiredExports) {
        if (!content.includes(exp)) {
          missing.push(exp)
        }
      }

      expect(missing, `Missing type exports in intro/index.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('index.ts exports provider and context', async () => {
      const indexPath = path.join(ENGINE, 'intro', 'index.ts')
      const content = await readFile(indexPath)

      const requiredExports = [
        'IntroProvider',
        'IntroContext',
        'useIntro',
      ]

      const missing: string[] = []
      for (const exp of requiredExports) {
        if (!content.includes(exp)) {
          missing.push(exp)
        }
      }

      expect(missing, `Missing exports in intro/index.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('index.ts exports registry functions', async () => {
      const indexPath = path.join(ENGINE, 'intro', 'index.ts')
      const content = await readFile(indexPath)

      const requiredExports = [
        'registerIntroPattern',
        'getIntroPattern',
        'getIntroPatternIds',
        'getAllIntroPatterns',
        'defineIntroPatternMeta',
        'getAllIntroPatternMetas',
      ]

      const missing: string[] = []
      for (const exp of requiredExports) {
        if (!content.includes(exp)) {
          missing.push(exp)
        }
      }

      expect(missing, `Missing registry exports in intro/index.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('index.ts exports lazy loading functions', async () => {
      const indexPath = path.join(ENGINE, 'intro', 'index.ts')
      const content = await readFile(indexPath)

      const requiredExports = [
        'registerLazyIntroPattern',
        'getIntroPatternAsync',
        'preloadIntroPattern',
      ]

      const missing: string[] = []
      for (const exp of requiredExports) {
        if (!content.includes(exp)) {
          missing.push(exp)
        }
      }

      expect(missing, `Missing lazy loading exports in intro/index.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })
  })
})

describe('Intro Pattern Registration', () => {
  let patternIds: string[]

  beforeAll(async () => {
    // Import and ensure patterns are registered
    const { ensureIntroPatternsRegistered, getIntroPatternIds } = await import('../../engine/intro')
    ensureIntroPatternsRegistered()
    patternIds = getIntroPatternIds()
  })

  it('all expected patterns are registered', () => {
    const expected = ['video-gate', 'timed', 'scroll-reveal', 'sequence-timed']
    const missing = expected.filter(id => !patternIds.includes(id))

    expect(missing, `Unregistered patterns:\n${missing.join('\n')}`).toHaveLength(0)
  })

  it('registered patterns have required fields', async () => {
    const { getIntroPatternAsync, getIntroPatternIds } = await import('../../engine/intro')
    const ids = getIntroPatternIds()
    const violations: string[] = []

    for (const id of ids) {
      const pattern = await getIntroPatternAsync(id)
      if (!pattern) {
        violations.push(`Pattern "${id}" could not be loaded`)
        continue
      }
      if (!pattern.id) {
        violations.push(`Pattern missing id`)
      }
      if (!pattern.name) {
        violations.push(`Pattern "${pattern.id}" missing name`)
      }
      if (!pattern.description) {
        violations.push(`Pattern "${pattern.id}" missing description`)
      }
      if (!pattern.triggers || pattern.triggers.length === 0) {
        violations.push(`Pattern "${pattern.id}" missing triggers`)
      }
      if (typeof pattern.revealDuration !== 'number') {
        violations.push(`Pattern "${pattern.id}" missing revealDuration`)
      }
      if (typeof pattern.hideChrome !== 'boolean') {
        violations.push(`Pattern "${pattern.id}" missing hideChrome`)
      }
    }

    expect(violations, `Invalid patterns:\n${violations.join('\n')}`).toHaveLength(0)
  })

  it('patterns have settings defined', async () => {
    const { getIntroPatternAsync, getIntroPatternIds } = await import('../../engine/intro')
    const ids = getIntroPatternIds()
    const violations: string[] = []

    for (const id of ids) {
      const pattern = await getIntroPatternAsync(id)
      if (!pattern) {
        violations.push(`Pattern "${id}" could not be loaded`)
        continue
      }
      if (!pattern.settings) {
        violations.push(`Pattern "${pattern.id}" missing settings`)
      }
    }

    expect(violations, `Patterns missing settings:\n${violations.join('\n')}`).toHaveLength(0)
  })

  it('pattern IDs match folder names', async () => {
    const { getIntroPatternIds } = await import('../../engine/intro')
    const ids = getIntroPatternIds()
    const folders = await getFolders('intro/patterns/*')
    const folderNames = new Set(folders.map(f => path.basename(f)))

    const violations: string[] = []

    for (const id of ids) {
      if (!folderNames.has(id)) {
        violations.push(`Pattern "${id}" has no matching folder`)
      }
    }

    expect(violations, `Pattern ID/folder mismatches:\n${violations.join('\n')}`).toHaveLength(0)
  })
})

describe('Intro Pattern Meta Files', () => {
  it('all pattern meta.ts files use "export const meta"', async () => {
    const metaFiles = await getFiles('intro/patterns/*/meta.ts')
    const violations: string[] = []

    for (const file of metaFiles) {
      const content = await readFile(file)

      if (!content.includes('export const meta')) {
        violations.push(`${relativePath(file)}: must use "export const meta"`)
      }
    }

    expect(violations, `Meta files not using standard export:\n${violations.join('\n')}`).toHaveLength(0)
  })

  it('all pattern meta.ts files use defineIntroPatternMeta()', async () => {
    const metaFiles = await getFiles('intro/patterns/*/meta.ts')
    const violations: string[] = []

    for (const file of metaFiles) {
      const content = await readFile(file)

      if (!content.includes('defineIntroPatternMeta')) {
        violations.push(`${relativePath(file)}: must use defineIntroPatternMeta()`)
      }
    }

    expect(violations, `Meta files not using define helper:\n${violations.join('\n')}`).toHaveLength(0)
  })

  it('meta contains required fields: id, name, description, settings', async () => {
    const metaFiles = await getFiles('intro/patterns/*/meta.ts')
    const violations: string[] = []

    for (const file of metaFiles) {
      const content = await readFile(file)
      const rel = relativePath(file)

      if (!content.includes('id:')) violations.push(`${rel}: missing id`)
      if (!content.includes('name:')) violations.push(`${rel}: missing name`)
      if (!content.includes('description:')) violations.push(`${rel}: missing description`)
      if (!content.includes('settings:')) violations.push(`${rel}: missing settings`)
    }

    expect(violations, `Meta files missing required fields:\n${violations.join('\n')}`).toHaveLength(0)
  })

  it('settings configs have type, label, and default', async () => {
    const metaFiles = await getFiles('intro/patterns/*/meta.ts')
    const violations: string[] = []

    for (const file of metaFiles) {
      const content = await readFile(file)

      // Basic validation that settings have required structure
      // Look for setting definitions
      const settingMatches = content.match(/\w+:\s*\{[^}]*type:/g)

      if (settingMatches) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const _ of settingMatches) {
          // Check for label and default in the broader context
          if (!content.includes('label:')) {
            violations.push(`${relativePath(file)}: settings missing label`)
            break
          }
          if (!content.includes('default:')) {
            violations.push(`${relativePath(file)}: settings missing default`)
            break
          }
        }
      }
    }

    expect(violations, `Settings missing required fields:\n${violations.join('\n')}`).toHaveLength(0)
  })

  it('pattern settings match meta settings (no drift)', async () => {
    const metaModules = await Promise.all([
      import('../../engine/intro/patterns/video-gate/meta'),
      import('../../engine/intro/patterns/timed/meta'),
      import('../../engine/intro/patterns/scroll-reveal/meta'),
      import('../../engine/intro/patterns/sequence-timed/meta'),
    ])

    const { getIntroPatternAsync, ensureIntroPatternsRegistered } = await import('../../engine/intro')
    ensureIntroPatternsRegistered()
    const violations: string[] = []

    for (const metaMod of metaModules) {
      const meta = metaMod.meta
      const pattern = await getIntroPatternAsync(meta.id)

      if (!pattern) {
        violations.push(`Pattern "${meta.id}" not found in registry`)
        continue
      }

      if (pattern.settings !== meta.settings) {
        const patternKeys = pattern.settings ? Object.keys(pattern.settings).sort().join(',') : 'none'
        const metaKeys = meta.settings ? Object.keys(meta.settings).sort().join(',') : 'none'

        if (patternKeys !== metaKeys) {
          violations.push(
            `${meta.id}: settings mismatch - pattern has [${patternKeys}], meta has [${metaKeys}]`
          )
        }
      }
    }

    expect(violations, `Settings drift detected:\n${violations.join('\n')}`).toHaveLength(0)
  })

  it('getAllIntroPatternMetas() returns all registered patterns', async () => {
    const { getAllIntroPatternMetas, ensureIntroPatternsRegistered } = await import('../../engine/intro')
    ensureIntroPatternsRegistered()
    const metas = getAllIntroPatternMetas()

    const expectedIds = ['video-gate', 'timed', 'scroll-reveal', 'sequence-timed']
    const metaIds = metas.map(m => m.id)
    const missing = expectedIds.filter(id => !metaIds.includes(id))

    expect(missing, `Missing from getAllIntroPatternMetas():\n${missing.join('\n')}`).toHaveLength(0)

    // Each meta should have required fields
    const violations: string[] = []
    for (const meta of metas) {
      if (!meta.id) violations.push('Meta missing id')
      if (!meta.name) violations.push(`Meta "${meta.id}" missing name`)
      if (!meta.description) violations.push(`Meta "${meta.id}" missing description`)
      if (!meta.settings) violations.push(`Meta "${meta.id}" missing settings`)
    }

    expect(violations, `Invalid metas:\n${violations.join('\n')}`).toHaveLength(0)
  })

  it('all pattern metas have icon, tags, and category', async () => {
    const { getAllIntroPatternMetas, ensureIntroPatternsRegistered } = await import('../../engine/intro')
    ensureIntroPatternsRegistered()
    const metas = getAllIntroPatternMetas()
    const violations: string[] = []

    for (const meta of metas) {
      if (!meta.icon) violations.push(`Meta "${meta.id}" missing icon`)
      if (!meta.tags || meta.tags.length === 0) violations.push(`Meta "${meta.id}" missing tags`)
      if (!meta.category) violations.push(`Meta "${meta.id}" missing category`)
    }

    expect(violations, `Intro metas missing fields:\n${violations.join('\n')}`).toHaveLength(0)
  })
})

describe('Intro Module Imports', () => {
  it('intro module does not import from content/', async () => {
    const files = await getFiles('intro/**/*.{ts,tsx}')
    const violations: string[] = []

    for (const file of files) {
      const content = await readFile(file)

      // Check for imports from content folder
      if (content.match(/from\s+['"][^'"]*content\//)) {
        violations.push(relativePath(file))
      }
    }

    expect(violations, `Intro files importing from content/:\n${violations.join('\n')}`).toHaveLength(0)
  })

  it('intro module can import from schema/', async () => {
    // This is allowed - verify it works without failing
    const typesPath = path.join(ENGINE, 'intro', 'types.ts')
    const content = await readFile(typesPath)

    // Should import from schema for SettingsConfig
    expect(content).toContain('schema/')
  })
})

describe('Intro Cross-Validation', () => {
  describe('Intro behaviours exist in experience/behaviours/intro/', () => {
    const EXPECTED_BEHAVIOURS = [
      'content-reveal',
      'text-reveal',
      'chrome-reveal',
      'scroll-indicator',
      'step',
    ]

    it('intro behaviour folder exists', async () => {
      const behaviourPath = path.join(ENGINE, 'experience', 'behaviours', 'intro')
      const exists = await fileExists(behaviourPath)
      expect(exists, 'experience/behaviours/intro/ folder should exist').toBe(true)
    })

    it('all expected intro behaviour files exist', async () => {
      const missing: string[] = []

      for (const behaviour of EXPECTED_BEHAVIOURS) {
        const filePath = path.join(ENGINE, 'experience', 'behaviours', 'intro', `${behaviour}.ts`)
        if (!(await fileExists(filePath))) {
          missing.push(`experience/behaviours/intro/${behaviour}.ts`)
        }
      }

      expect(missing, `Missing intro behaviour files:\n${missing.join('\n')}`).toHaveLength(0)
    })

    it('intro behaviours have index.ts barrel export', async () => {
      const indexPath = path.join(ENGINE, 'experience', 'behaviours', 'intro', 'index.ts')
      const exists = await fileExists(indexPath)
      expect(exists, 'experience/behaviours/intro/index.ts should exist').toBe(true)
    })

    it('intro behaviour IDs are prefixed with intro/', async () => {
      const behaviourFiles = await getFiles('experience/behaviours/intro/*.ts')
      const violations: string[] = []

      for (const file of behaviourFiles) {
        const filename = path.basename(file, '.ts')
        if (filename === 'index' || filename === 'types') continue

        const content = await readFile(file)
        const expectedId = `intro/${filename}`

        if (!content.includes(`'${expectedId}'`) && !content.includes(`"${expectedId}"`)) {
          violations.push(`${relativePath(file)}: expected behaviour ID "${expectedId}"`)
        }
      }

      expect(violations, `Intro behaviours with wrong ID prefix:\n${violations.join('\n')}`).toHaveLength(0)
    })
  })

  describe('Schema integration', () => {
    it('site.ts exports IntroConfig reference', async () => {
      const sitePath = path.join(ENGINE, 'schema', 'site.ts')
      const content = await readFile(sitePath)

      expect(content, 'site.ts should import IntroConfig').toContain('IntroConfig')
      expect(content, 'site.ts should have intro field').toContain('intro?')
    })

    it('page.ts allows disabled intro override', async () => {
      const pagePath = path.join(ENGINE, 'schema', 'page.ts')
      const content = await readFile(pagePath)

      expect(content, 'page.ts should import IntroConfig').toContain('IntroConfig')
      expect(content, "page.ts should allow 'disabled' value").toContain("'disabled'")
    })
  })

  describe('Renderer integration', () => {
    it('SiteRenderer imports IntroProvider', async () => {
      const rendererPath = path.join(ENGINE, 'renderer', 'SiteRenderer.tsx')
      const content = await readFile(rendererPath)

      expect(content, 'SiteRenderer should import IntroProvider').toContain('IntroProvider')
      expect(content, 'SiteRenderer should import getIntroPattern').toContain('getIntroPattern')
      expect(content, 'SiteRenderer should import ensureIntroPatternsRegistered').toContain('ensureIntroPatternsRegistered')
    })

    it('SiteRenderer uses IntroProvider in render tree', async () => {
      const rendererPath = path.join(ENGINE, 'renderer', 'SiteRenderer.tsx')
      const content = await readFile(rendererPath)

      expect(content, 'SiteRenderer should render <IntroProvider>').toContain('<IntroProvider')
    })

    it('SiteRenderer passes overlay component to IntroProvider', async () => {
      const rendererPath = path.join(ENGINE, 'renderer', 'SiteRenderer.tsx')
      const content = await readFile(rendererPath)

      expect(content, 'SiteRenderer should pass overlayComponent').toContain('overlayComponent')
      expect(content, 'SiteRenderer should pass overlayProps').toContain('overlayProps')
    })

    it('IntroProvider accepts overlay props', async () => {
      const providerPath = path.join(ENGINE, 'intro', 'IntroProvider.tsx')
      const content = await readFile(providerPath)

      expect(content, 'IntroProvider should accept overlayComponent').toContain('overlayComponent')
      expect(content, 'IntroProvider should accept overlayProps').toContain('overlayProps')
    })
  })
})
