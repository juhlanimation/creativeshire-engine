/**
 * Storybook Coverage & Structure Tests
 *
 * Two concerns:
 * 1. Coverage — Every component folder has a *.stories.tsx file
 * 2. Structure — Story files follow the correct pattern for their component type
 *
 * Structure rules per component type:
 *   Primitive/Interactive widget  → uses widgetStoryConfig, imports ./meta, has title, has Default export
 *   Section pattern               → uses sectionStoryConfig, imports ./meta + factory from ./index
 *   Chrome pattern                → uses chromePatternStoryConfig, imports ./meta + factory from ./index
 *   Preset                        → uses presetStoryConfig, has title
 */

import { describe, it, expect } from 'vitest'
import {
  getFolders,
  getComponentName,
  hasStoryFile,
  getStoryFile,
  readFile,
  fileExists,
} from './helpers'
import path from 'path'

// ---------------------------------------------------------------------------
// Coverage helpers
// ---------------------------------------------------------------------------

async function collectMissingStories(pattern: string): Promise<string[]> {
  const folders = await getFolders(pattern)
  const missing: string[] = []

  for (const folder of folders) {
    const has = await hasStoryFile(folder)
    if (!has) {
      missing.push(getComponentName(folder))
    }
  }

  return missing
}

function reportAndAssert(violations: string[], label: string) {
  if (violations.length > 0) {
    console.log(`${label}:`)
    violations.forEach((v) => console.log(`  - ${v}`))
  }

  expect(violations, `${label}:\n${violations.join('\n')}`).toHaveLength(0)
}

// ---------------------------------------------------------------------------
// Structure validation helpers
// ---------------------------------------------------------------------------

interface StoryRule {
  /** Required helper function import from auto-story */
  requiredHelper: string
  /** Whether the story must import `meta` from ./meta */
  requiresMeta: boolean
  /** Whether the story must import a factory from ./index */
  requiresFactory: boolean
  /** Factory import pattern (regex) — e.g. /create\w+/ */
  factoryPattern?: RegExp
  /** Whether the folder must have a colocated preview.ts */
  requiresPreview: boolean
}

const WIDGET_RULE: StoryRule = {
  requiredHelper: 'widgetStoryConfig',
  requiresMeta: true,
  requiresFactory: false,
  requiresPreview: false,
}

const SECTION_RULE: StoryRule = {
  requiredHelper: 'sectionStoryConfig',
  requiresMeta: true,
  requiresFactory: true,
  factoryPattern: /create\w+Section/,
  requiresPreview: false,
}

const CHROME_PATTERN_RULE: StoryRule = {
  requiredHelper: 'chromePatternStoryConfig',
  requiresMeta: true,
  requiresFactory: true,
  factoryPattern: /create\w+(Region|Overlay)/,
  requiresPreview: false,
}

const PRESET_RULE: StoryRule = {
  requiredHelper: 'presetStoryConfig',
  requiresMeta: false,
  requiresFactory: false,
  requiresPreview: false,
}

async function validateStoryStructure(
  pattern: string,
  rule: StoryRule,
): Promise<string[]> {
  const folders = await getFolders(pattern)
  const violations: string[] = []

  for (const folder of folders) {
    const name = getComponentName(folder)
    const storyPath = await getStoryFile(folder)

    // Skip folders without stories — the coverage tests catch that
    if (!storyPath) continue

    const content = await readFile(storyPath)

    // 1. Must use the correct auto-story helper
    if (!content.includes(rule.requiredHelper)) {
      violations.push(`${name}: should use ${rule.requiredHelper}() from auto-story`)
    }

    // 2. Must have a default export (Storybook meta)
    if (!/export\s+default\b/.test(content)) {
      violations.push(`${name}: missing default export (Storybook meta)`)
    }

    // 3. Must have a title in the default export
    if (!content.includes('title:')) {
      violations.push(`${name}: missing title in story meta`)
    }

    // 4. Must have at least one named export (a story variant)
    const namedExports = content.match(/export\s+const\s+\w+/g) ?? []
    if (namedExports.length === 0) {
      violations.push(`${name}: no named story exports (need at least one, e.g. Default)`)
    }

    // 5. Must import meta from ./meta
    if (rule.requiresMeta && !content.includes("from './meta'")) {
      violations.push(`${name}: should import meta from './meta'`)
    }

    // 6. Must import factory from ./index
    if (rule.requiresFactory && !content.includes("from './index'")) {
      violations.push(`${name}: should import factory from './index'`)
    }

    // 7. Factory import matches expected pattern
    if (rule.factoryPattern && rule.requiresFactory) {
      if (!rule.factoryPattern.test(content)) {
        violations.push(`${name}: factory import should match ${rule.factoryPattern}`)
      }
    }

    // 8. Must have colocated preview.ts
    if (rule.requiresPreview) {
      const previewPath = path.join(folder, 'preview.ts')
      const hasPreview = await fileExists(previewPath)
      if (!hasPreview) {
        violations.push(`${name}: missing preview.ts (required for preview props)`)
      }
    }
  }

  return violations
}

// ===========================================================================
// Tests
// ===========================================================================

describe('Storybook Coverage', () => {
  describe('Widgets', () => {
    it('all primitives have stories', async () => {
      const missing = await collectMissingStories('content/widgets/primitives/*')
      reportAndAssert(missing, 'Missing stories for Primitives')
    })

    it('all layout widgets have stories', async () => {
      const missing = await collectMissingStories('content/widgets/layout/*')
      reportAndAssert(missing, 'Missing stories for Layout widgets')
    })

    it('all interactive widgets have stories', async () => {
      const missing = await collectMissingStories('content/widgets/interactive/*')
      reportAndAssert(missing, 'Missing stories for Interactive widgets')
    })

  })

  describe('Sections', () => {
    it('all section patterns have stories', async () => {
      const missing = await collectMissingStories('content/sections/patterns/*')
      reportAndAssert(missing, 'Missing stories for Section patterns')
    })
  })

  describe('Chrome', () => {
    it('all chrome patterns have stories', async () => {
      const missing = await collectMissingStories('content/chrome/patterns/*')
      reportAndAssert(missing, 'Missing stories for Chrome patterns')
    })

    it('all overlays have stories', async () => {
      const missing = await collectMissingStories('content/chrome/overlays/*')
      reportAndAssert(missing, 'Missing stories for Chrome overlays')
    })
  })

  describe('Presets', () => {
    it('all presets have stories', async () => {
      const missing = await collectMissingStories('presets/*')
      reportAndAssert(missing, 'Missing stories for Presets')
    })
  })
})

describe('Storybook Structure', () => {
  describe('Widgets', () => {
    it('primitive stories follow the widget pattern', async () => {
      const violations = await validateStoryStructure('content/widgets/primitives/*', WIDGET_RULE)
      reportAndAssert(violations, 'Primitive story structure violations')
    })

    it('layout stories follow the widget pattern', async () => {
      const violations = await validateStoryStructure('content/widgets/layout/*', WIDGET_RULE)
      reportAndAssert(violations, 'Layout story structure violations')
    })

    it('interactive stories follow the widget pattern', async () => {
      const violations = await validateStoryStructure('content/widgets/interactive/*', WIDGET_RULE)
      reportAndAssert(violations, 'Interactive story structure violations')
    })

  })

  describe('Sections', () => {
    it('section stories follow the section pattern', async () => {
      const violations = await validateStoryStructure('content/sections/patterns/*', SECTION_RULE)
      reportAndAssert(violations, 'Section story structure violations')
    })
  })

  describe('Chrome', () => {
    it('chrome pattern stories follow the chrome-pattern pattern', async () => {
      const violations = await validateStoryStructure('content/chrome/patterns/*', CHROME_PATTERN_RULE)
      reportAndAssert(violations, 'Chrome pattern story structure violations')
    })
  })

  describe('Presets', () => {
    it('preset stories follow the preset pattern', async () => {
      const violations = await validateStoryStructure('presets/*', PRESET_RULE)
      reportAndAssert(violations, 'Preset story structure violations')
    })
  })
})
