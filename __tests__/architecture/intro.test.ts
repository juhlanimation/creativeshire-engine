/**
 * Intro Module Architecture Tests
 *
 * Validates the intro module structure:
 * - Folder structure follows conventions
 * - Types are exported correctly
 * - Triggers follow hook naming convention
 * - Dev override functions are exported
 */

import { describe, it, expect } from 'vitest'
import { getFiles, readFile, relativePath, fileExists } from './helpers'
import path from 'path'

const ENGINE = path.join(process.cwd(), 'engine')

describe('Intro Sequence-Timed Pattern', () => {
  it('useSequence trigger file exists', async () => {
    const triggerPath = path.join(ENGINE, 'intro', 'triggers', 'useSequence.ts')
    expect(await fileExists(triggerPath), 'useSequence.ts should exist').toBe(true)
  })

  it('intro/step behaviour exists', async () => {
    const behaviourPath = path.join(ENGINE, 'experience', 'behaviours', 'intro', 'step', 'index.ts')
    expect(await fileExists(behaviourPath), 'intro/step/index.ts should exist').toBe(true)
  })

  it('intro/step behaviour has correct ID', async () => {
    const metaPath = path.join(ENGINE, 'experience', 'behaviours', 'intro', 'step', 'meta.ts')
    const content = await readFile(metaPath)
    expect(content).toContain("'intro/step'")
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

    it('intro/triggers/ folder exists', async () => {
      const triggersPath = path.join(ENGINE, 'intro', 'triggers')
      const exists = await fileExists(triggersPath)
      expect(exists, 'engine/intro/triggers/ folder should exist').toBe(true)
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
        'IntroMeta',
        'IntroActions',
        'SequenceStepConfig',
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

    it('index.ts exports dev override functions', async () => {
      const indexPath = path.join(ENGINE, 'intro', 'index.ts')
      const content = await readFile(indexPath)

      const requiredExports = [
        'getIntroOverride',
        'setIntroOverride',
        'DEV_INTRO_PARAM',
      ]

      const missing: string[] = []
      for (const exp of requiredExports) {
        if (!content.includes(exp)) {
          missing.push(exp)
        }
      }

      expect(missing, `Missing dev override exports in intro/index.ts:\n${missing.join('\n')}`).toHaveLength(0)
    })
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

    it('all expected intro behaviour folders exist with index.ts + meta.ts', async () => {
      const missing: string[] = []

      for (const behaviour of EXPECTED_BEHAVIOURS) {
        const indexPath = path.join(ENGINE, 'experience', 'behaviours', 'intro', behaviour, 'index.ts')
        const metaPath = path.join(ENGINE, 'experience', 'behaviours', 'intro', behaviour, 'meta.ts')
        if (!(await fileExists(indexPath))) {
          missing.push(`experience/behaviours/intro/${behaviour}/index.ts`)
        }
        if (!(await fileExists(metaPath))) {
          missing.push(`experience/behaviours/intro/${behaviour}/meta.ts`)
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
      const metaFiles = await getFiles('experience/behaviours/intro/*/meta.ts')
      const violations: string[] = []

      for (const file of metaFiles) {
        const rel = relativePath(file)
        const parts = rel.split('/')
        // Path: experience/behaviours/intro/{name}/meta.ts → name is parts[3]
        const behaviourName = parts[3]
        if (!behaviourName) continue

        const content = await readFile(file)
        const expectedId = `intro/${behaviourName}`

        if (!content.includes(`'${expectedId}'`) && !content.includes(`"${expectedId}"`)) {
          violations.push(`${rel}: expected behaviour ID "${expectedId}"`)
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
    })

    it('useResolvedIntro hook imports Experience type', async () => {
      const hookPath = path.join(ENGINE, 'renderer', 'hooks', 'useResolvedIntro.ts')
      const content = await readFile(hookPath)

      expect(content, 'useResolvedIntro should import Experience type').toContain("from '../../experience/experiences/types'")
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
