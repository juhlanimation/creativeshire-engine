/**
 * Meta ↔ Storybook Parity Tests
 *
 * Validates that the component metadata exposed to the CMS (via registries)
 * produces correct Storybook controls. Since both the CMS editor and Storybook
 * derive their field configs from `meta.settings`, this test ensures:
 *
 * 1. Every setting has valid structure (type, label, default)
 * 2. Default values match the declared setting type
 * 3. Select settings have well-formed choices
 * 4. Range settings have required min/max bounds
 * 5. settingsToArgTypes() doesn't silently drop any visible settings
 * 6. extractDefaults() produces correct default values
 *
 * If a test fails here, the CMS editor and Storybook controls are out of sync.
 */

import { describe, it, expect } from 'vitest'
import type { SettingConfig } from '../../engine/schema/settings'
import { extractDefaults } from '../../engine/schema/settings'
import { settingsToArgTypes } from '../../.storybook/helpers/controls-adapter'
import { widgetMetaRegistry } from '../../engine/content/widgets/meta-registry'
import { sectionRegistry } from '../../engine/content/sections/registry'
import { chromePatternRegistry } from '../../engine/content/chrome/pattern-registry'
import { getAllChromeMetas } from '../../engine/content/chrome/registry'
import type { ComponentMeta, SectionMeta, ChromePatternMeta } from '../../engine/schema/meta'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Expected JS type for each setting type's default value */
const DEFAULT_TYPE_MAP: Record<string, string | string[]> = {
  toggle: 'boolean',
  text: 'string',
  textarea: 'string',
  number: 'number',
  range: 'number',
  select: 'string',
  color: 'string',
  image: 'string',
  video: 'string',
  icon: 'string',
  spacing: ['number', 'string'],
  alignment: 'string',
  'element-ref': ['string', 'object'], // string | null
  custom: 'any', // no constraint
}

function isValidDefaultType(setting: SettingConfig): boolean {
  const expected = DEFAULT_TYPE_MAP[setting.type]
  if (!expected || expected === 'any') return true

  const actual = setting.default === null ? 'object' : typeof setting.default
  if (Array.isArray(expected)) {
    return expected.includes(actual)
  }
  return actual === expected
}

interface SettingsViolation {
  component: string
  field: string
  issue: string
}

/**
 * Validate all settings in a meta object.
 * Returns an array of violations (empty = all good).
 */
function validateSettings(
  componentId: string,
  settings: Record<string, SettingConfig> | undefined,
): SettingsViolation[] {
  const violations: SettingsViolation[] = []
  if (!settings) return violations

  for (const [key, setting] of Object.entries(settings)) {
    // 1. Required fields
    if (!setting.type) {
      violations.push({ component: componentId, field: key, issue: 'missing type' })
    }
    if (!setting.label) {
      violations.push({ component: componentId, field: key, issue: 'missing label' })
    }
    if (setting.default === undefined) {
      violations.push({ component: componentId, field: key, issue: 'missing default' })
    }

    // 2. Default value type matches declared type
    if (setting.type && setting.default !== undefined && !isValidDefaultType(setting)) {
      violations.push({
        component: componentId,
        field: key,
        issue: `default type mismatch: expected ${DEFAULT_TYPE_MAP[setting.type]}, got ${typeof setting.default}`,
      })
    }

    // 3. Select settings must have choices
    if (setting.type === 'select') {
      if (!setting.choices || !Array.isArray(setting.choices) || setting.choices.length === 0) {
        violations.push({ component: componentId, field: key, issue: 'select setting missing choices' })
      } else {
        for (const choice of setting.choices) {
          if (!choice.value && choice.value !== '') {
            violations.push({ component: componentId, field: key, issue: 'select choice missing value' })
          }
          if (!choice.label) {
            violations.push({ component: componentId, field: key, issue: 'select choice missing label' })
          }
        }
        // Default must be one of the choices
        const choiceValues = setting.choices.map((c) => c.value)
        if (!choiceValues.includes(setting.default)) {
          violations.push({
            component: componentId,
            field: key,
            issue: `select default "${setting.default}" not in choices [${choiceValues.join(', ')}]`,
          })
        }
      }
    }

    // 4. Range settings must have min and max
    if (setting.type === 'range') {
      if (setting.min === undefined) {
        violations.push({ component: componentId, field: key, issue: 'range setting missing min' })
      }
      if (setting.max === undefined) {
        violations.push({ component: componentId, field: key, issue: 'range setting missing max' })
      }
    }
  }

  return violations
}

/**
 * Validate that settingsToArgTypes doesn't silently drop visible settings.
 * Every setting that isn't hidden or structural should produce an argType.
 */
function validateArgTypeParity(
  componentId: string,
  settings: Record<string, SettingConfig> | undefined,
): SettingsViolation[] {
  const violations: SettingsViolation[] = []
  if (!settings) return violations

  const argTypes = settingsToArgTypes(settings)

  for (const [key, setting] of Object.entries(settings)) {
    const isVisible = !setting.hidden && setting.editorHint !== 'structural' && !setting.advanced
    const hasArgType = key in argTypes

    if (isVisible && !hasArgType) {
      violations.push({
        component: componentId,
        field: key,
        issue: `visible setting produces no Storybook argType (type: ${setting.type})`,
      })
    }
  }

  return violations
}

/**
 * Validate that extractDefaults produces correct values for each setting.
 */
function validateDefaults(
  componentId: string,
  settings: Record<string, SettingConfig> | undefined,
): SettingsViolation[] {
  const violations: SettingsViolation[] = []
  if (!settings) return violations

  const defaults = extractDefaults(settings)

  for (const [key, setting] of Object.entries(settings)) {
    if (setting.default === undefined) continue

    if (!(key in defaults)) {
      violations.push({
        component: componentId,
        field: key,
        issue: 'extractDefaults() missed this setting',
      })
    } else if (defaults[key] !== setting.default) {
      // Deep equality for arrays/objects
      const match = JSON.stringify(defaults[key]) === JSON.stringify(setting.default)
      if (!match) {
        violations.push({
          component: componentId,
          field: key,
          issue: `extractDefaults() returned ${JSON.stringify(defaults[key])}, expected ${JSON.stringify(setting.default)}`,
        })
      }
    }
  }

  return violations
}

function reportAndAssert(violations: SettingsViolation[], label: string) {
  if (violations.length > 0) {
    console.log(`\n${label}:`)
    for (const v of violations) {
      console.log(`  ${v.component}.${v.field}: ${v.issue}`)
    }
  }
  expect(
    violations,
    `${label}:\n${violations.map((v) => `  ${v.component}.${v.field}: ${v.issue}`).join('\n')}`,
  ).toHaveLength(0)
}

// ===========================================================================
// Tests
// ===========================================================================

describe('Meta → CMS/Storybook Parity', () => {

  // -------------------------------------------------------------------------
  // Widget Meta Registry
  // -------------------------------------------------------------------------

  describe('Widget settings', () => {
    const entries = Object.entries(widgetMetaRegistry) as [string, ComponentMeta][]

    it('all widget settings have valid structure (type, label, default)', () => {
      const violations: SettingsViolation[] = []
      for (const [id, meta] of entries) {
        violations.push(
          ...validateSettings(id, meta.settings as Record<string, SettingConfig> | undefined),
        )
      }
      reportAndAssert(violations, 'Widget settings structure violations')
    })

    it('all visible widget settings produce Storybook argTypes', () => {
      const violations: SettingsViolation[] = []
      for (const [id, meta] of entries) {
        violations.push(
          ...validateArgTypeParity(id, meta.settings as Record<string, SettingConfig> | undefined),
        )
      }
      reportAndAssert(violations, 'Widget argType parity violations')
    })

    it('extractDefaults matches widget setting defaults', () => {
      const violations: SettingsViolation[] = []
      for (const [id, meta] of entries) {
        violations.push(
          ...validateDefaults(id, meta.settings as Record<string, SettingConfig> | undefined),
        )
      }
      reportAndAssert(violations, 'Widget extractDefaults violations')
    })
  })

  // -------------------------------------------------------------------------
  // Section Pattern Registry
  // -------------------------------------------------------------------------

  describe('Section settings', () => {
    const entries = Object.entries(sectionRegistry) as [string, { meta: SectionMeta }][]

    it('all section settings have valid structure', () => {
      const violations: SettingsViolation[] = []
      for (const [id, entry] of entries) {
        violations.push(
          ...validateSettings(id, entry.meta.settings as Record<string, SettingConfig> | undefined),
        )
      }
      reportAndAssert(violations, 'Section settings structure violations')
    })

    it('all visible section settings produce Storybook argTypes', () => {
      const violations: SettingsViolation[] = []
      for (const [id, entry] of entries) {
        violations.push(
          ...validateArgTypeParity(id, entry.meta.settings as Record<string, SettingConfig> | undefined),
        )
      }
      reportAndAssert(violations, 'Section argType parity violations')
    })

    it('extractDefaults matches section setting defaults', () => {
      const violations: SettingsViolation[] = []
      for (const [id, entry] of entries) {
        violations.push(
          ...validateDefaults(id, entry.meta.settings as Record<string, SettingConfig> | undefined),
        )
      }
      reportAndAssert(violations, 'Section extractDefaults violations')
    })

    it('all sections have required SectionMeta fields', () => {
      const violations: string[] = []
      for (const [id, entry] of entries) {
        const meta = entry.meta
        if (meta.category !== 'section') {
          violations.push(`${id}: category should be 'section', got '${meta.category}'`)
        }
        if (!meta.sectionCategory) {
          violations.push(`${id}: missing sectionCategory`)
        }
        if (meta.unique === undefined) {
          violations.push(`${id}: missing unique flag`)
        }
      }
      if (violations.length > 0) {
        console.log('\nSection meta field violations:')
        violations.forEach((v) => console.log(`  ${v}`))
      }
      expect(violations, violations.join('\n')).toHaveLength(0)
    })
  })

  // -------------------------------------------------------------------------
  // Chrome Pattern Registry
  // -------------------------------------------------------------------------

  describe('Chrome pattern settings', () => {
    const entries = Object.entries(chromePatternRegistry) as [string, { meta: ChromePatternMeta }][]

    it('all chrome pattern settings have valid structure', () => {
      const violations: SettingsViolation[] = []
      for (const [id, entry] of entries) {
        violations.push(
          ...validateSettings(id, entry.meta.settings as Record<string, SettingConfig> | undefined),
        )
      }
      reportAndAssert(violations, 'Chrome pattern settings structure violations')
    })

    it('all visible chrome pattern settings produce Storybook argTypes', () => {
      const violations: SettingsViolation[] = []
      for (const [id, entry] of entries) {
        violations.push(
          ...validateArgTypeParity(id, entry.meta.settings as Record<string, SettingConfig> | undefined),
        )
      }
      reportAndAssert(violations, 'Chrome pattern argType parity violations')
    })

    it('extractDefaults matches chrome pattern setting defaults', () => {
      const violations: SettingsViolation[] = []
      for (const [id, entry] of entries) {
        violations.push(
          ...validateDefaults(id, entry.meta.settings as Record<string, SettingConfig> | undefined),
        )
      }
      reportAndAssert(violations, 'Chrome pattern extractDefaults violations')
    })

    it('all chrome patterns have required ChromePatternMeta fields', () => {
      const violations: string[] = []
      for (const [id, entry] of entries) {
        const meta = entry.meta
        if (meta.chromeSlot === undefined) {
          violations.push(`${id}: missing chromeSlot (should be 'header', 'footer', or null)`)
        }
      }
      if (violations.length > 0) {
        console.log('\nChrome pattern meta field violations:')
        violations.forEach((v) => console.log(`  ${v}`))
      }
      expect(violations, violations.join('\n')).toHaveLength(0)
    })
  })

  // -------------------------------------------------------------------------
  // Chrome Overlay Registry
  // -------------------------------------------------------------------------

  describe('Chrome overlay settings', () => {
    it('all overlay metas with settings have valid structure', () => {
      const metas = getAllChromeMetas()
      const violations: SettingsViolation[] = []
      for (const meta of metas) {
        if (!meta.settings) continue
        violations.push(
          ...validateSettings(meta.id, meta.settings as Record<string, SettingConfig>),
        )
      }
      reportAndAssert(violations, 'Chrome overlay settings structure violations')
    })

    it('all visible overlay settings produce Storybook argTypes', () => {
      const metas = getAllChromeMetas()
      const violations: SettingsViolation[] = []
      for (const meta of metas) {
        if (!meta.settings) continue
        violations.push(
          ...validateArgTypeParity(meta.id, meta.settings as Record<string, SettingConfig>),
        )
      }
      reportAndAssert(violations, 'Chrome overlay argType parity violations')
    })
  })

  // -------------------------------------------------------------------------
  // Preview vs Meta divergence detection
  // -------------------------------------------------------------------------

  describe('Section preview.ts vs meta defaults', () => {
    // Dynamically import all preview.ts files via Vite's import.meta.glob
    const previewModules = import.meta.glob<{ previewProps: Record<string, unknown> }>(
      '../../engine/content/sections/patterns/*/preview.ts',
      { eager: true }
    )

    // Build a map: sectionId → previewProps
    const previewMap = new Map<string, Record<string, unknown>>()
    for (const [path, mod] of Object.entries(previewModules)) {
      // Extract folder name from path (e.g., '../../engine/.../HeroTitle/preview.ts' → 'HeroTitle')
      const parts = path.split('/')
      const folderName = parts[parts.length - 2]
      if (mod.previewProps) {
        previewMap.set(folderName, mod.previewProps)
      }
    }

    /**
     * Content-slot types whose meta default is an empty placeholder.
     * Preview files are EXPECTED to populate these with sample content — not a divergence.
     * Only flag settings with non-trivial design-intent defaults (select, range, toggle, etc.).
     */
    const CONTENT_SLOT_TYPES = new Set(['text', 'textarea', 'video', 'image', 'custom', 'icon'])

    function isEmptyValue(v: unknown): boolean {
      if (v === '' || v === 0 || v === false || v === null || v === undefined) return true
      if (Array.isArray(v) && v.length === 0) return true
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        return Object.values(v).every(isEmptyValue)
      }
      return false
    }

    function isContentSlot(setting: SettingConfig): boolean {
      if (!CONTENT_SLOT_TYPES.has(setting.type)) return false
      // Empty default = content placeholder the preview is expected to fill
      return isEmptyValue(setting.default)
    }

    it('preview.ts must not override meta setting defaults with different values', () => {
      const violations: string[] = []

      for (const [id, entry] of Object.entries(sectionRegistry) as [string, { meta: SectionMeta }][]) {
        const preview = previewMap.get(id)
        if (!preview) continue

        const settings = (entry.meta.settings ?? {}) as Record<string, SettingConfig>

        for (const [key, previewValue] of Object.entries(preview)) {
          if (!(key in settings)) continue // Content/base prop — skip
          if (isContentSlot(settings[key])) continue // Sample content — skip

          const metaDefault = settings[key].default
          const same = JSON.stringify(previewValue) === JSON.stringify(metaDefault)

          if (!same) {
            violations.push(
              `${id}.${key}: preview.ts has ${JSON.stringify(previewValue)}, meta default is ${JSON.stringify(metaDefault)} — fix the meta default or remove from preview`
            )
          }
        }
      }

      if (violations.length > 0) {
        console.log('\nPreview vs meta divergences (ERRORS):')
        violations.forEach((v) => console.log(`  ${v}`))
      }
      expect(
        violations,
        `Preview overrides meta setting defaults with different values:\n${violations.join('\n')}`,
      ).toHaveLength(0)
    })

    it('preview.ts should not redundantly duplicate meta defaults (warnings only)', () => {
      const warnings: string[] = []

      for (const [id, entry] of Object.entries(sectionRegistry) as [string, { meta: SectionMeta }][]) {
        const preview = previewMap.get(id)
        if (!preview) continue

        const settings = (entry.meta.settings ?? {}) as Record<string, SettingConfig>

        for (const [key, previewValue] of Object.entries(preview)) {
          if (!(key in settings)) continue
          if (isContentSlot(settings[key])) continue

          const metaDefault = settings[key].default
          const same = JSON.stringify(previewValue) === JSON.stringify(metaDefault)

          if (same) {
            warnings.push(
              `${id}.${key}: preview.ts duplicates meta default (${JSON.stringify(metaDefault)}) — consider removing`
            )
          }
        }
      }

      if (warnings.length > 0) {
        console.log('\nRedundant preview keys (warnings — not failing):')
        warnings.forEach((w) => console.log(`  ${w}`))
      }
      // This is a soft check — warnings only, no failure
    })
  })

  // -------------------------------------------------------------------------
  // Cross-cutting: every registered component has meta with id/name/description
  // -------------------------------------------------------------------------

  describe('Registry completeness', () => {
    it('all widget metas have id, name, description', () => {
      const violations: string[] = []
      for (const [key, meta] of Object.entries(widgetMetaRegistry)) {
        if (!meta.id) violations.push(`${key}: missing id`)
        if (!meta.name) violations.push(`${key}: missing name`)
        if (!meta.description) violations.push(`${key}: missing description`)
      }
      expect(violations, violations.join('\n')).toHaveLength(0)
    })

    it('all section metas have id, name, description', () => {
      const violations: string[] = []
      for (const [key, entry] of Object.entries(sectionRegistry)) {
        if (!entry.meta.id) violations.push(`${key}: missing id`)
        if (!entry.meta.name) violations.push(`${key}: missing name`)
        if (!entry.meta.description) violations.push(`${key}: missing description`)
      }
      expect(violations, violations.join('\n')).toHaveLength(0)
    })

    it('all chrome pattern metas have id, name, description', () => {
      const violations: string[] = []
      for (const [key, entry] of Object.entries(chromePatternRegistry)) {
        if (!entry.meta.id) violations.push(`${key}: missing id`)
        if (!entry.meta.name) violations.push(`${key}: missing name`)
        if (!entry.meta.description) violations.push(`${key}: missing description`)
      }
      expect(violations, violations.join('\n')).toHaveLength(0)
    })

    it('all chrome overlay metas have id, name, description', () => {
      const metas = getAllChromeMetas()
      const violations: string[] = []
      for (const meta of metas) {
        if (!meta.id) violations.push(`unknown: missing id`)
        if (!meta.name) violations.push(`${meta.id ?? 'unknown'}: missing name`)
        if (!meta.description) violations.push(`${meta.id ?? 'unknown'}: missing description`)
      }
      expect(violations, violations.join('\n')).toHaveLength(0)
    })
  })
})
