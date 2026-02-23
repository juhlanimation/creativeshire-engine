/**
 * Preset Story Helpers
 *
 * Shared utilities for rendering full-site preset stories in Storybook.
 * Provides Experience and Intro Sequence dropdowns in the Controls panel.
 * Defaults to each preset's own configuration; select 'none' for bareMode.
 *
 * Theme toolbar: colorTheme (contrast/muted) is read from Storybook globals
 * via a decorator and applied to the preset. colorMode is ignored — each
 * section defines its own colorMode via per-section palette.
 *
 * Usage:
 *   import { presetStoryConfig, PresetPageStory } from '../../../.storybook/helpers/preset-story'
 *   export default presetStoryConfig('noir', 'Cinematic Portfolio - Noir', noirPreset)
 *   export const Home = {
 *     render: (args: PresetStoryArgs) => (
 *       <PresetPageStory preset={noirPreset} ... experience={args.experience} intro={args.intro} />
 *     ),
 *   }
 */

import React, { useContext, useLayoutEffect } from 'react'
import { SiteRenderer } from '../../engine/renderer/SiteRenderer'
import {
  buildSiteSchemaFromPreset,
  buildPageFromPreset,
  resolveIntroBindings,
} from '../../engine/presets/resolve'
import {
  resolvePresetIntro,
  getIntroSequence,
  getAllIntroSequenceMetas,
} from '../../engine/intro'
import {
  ensureExperiencesRegistered,
  getAllExperienceMetas,
  getAllExperiences,
  getBehaviour,
} from '../../engine/experience'
import type { BehaviourAssignment } from '../../engine/experience'
import { ensurePresetsRegistered, getAllPresets } from '../../engine/presets'
import type { SitePreset } from '../../engine/presets/types'
import type { PresetIntroConfig } from '../../engine/intro/types'
import type { IntroConfig, ExperienceConfig } from '../../engine/schema'
import { getTheme } from '../../engine/themes'
import type { SettingConfig } from '../../engine/schema/settings'
import { settingsToConditionalArgTypes } from './controls-adapter'
import { StoryGlobalsContext, StoryGlobalsDecorator } from './story-globals'

// Ensure all experiences, presets, and intro sequences are registered at module load
// (prevents tree-shaking from dropping auto-registration side effects)
ensureExperiencesRegistered()
ensurePresetsRegistered()
// Intro sequences register via the barrel import above (import '../../engine/intro' → import './sequences')

// Sentinel for "use the preset's inline intro config"
const PRESET_DEFAULT = '(preset default)'

// ── PresetStoryArgs (exposed to story render functions) ─────────────────

/** Args type for preset story render functions. */
export interface PresetStoryArgs {
  /** Experience ID or 'none' */
  experience: string
  /** Intro sequence ID, '(preset default)', or 'none' */
  intro: string
  /** Sections pinned at viewport top (cover-scroll) */
  pinnedSections?: string[]
  /** Gap between sections (layout preset name or 'none') */
  sectionGap?: string
  /** Multiplier for the section gap value */
  sectionGapScale?: number
  /** Dynamic intro/experience settings args */
  [key: string]: unknown
}

// ── Settings Extraction Helpers ───────────────────────────────────────

/**
 * Extract prefixed settings overrides from story args.
 * Scans for args matching `{prefix}::*`, strips the prefix,
 * and returns plain setting key → value pairs.
 */
function extractPrefixedSettings(args: PresetStoryArgs, prefix: string): Record<string, unknown> | undefined {
  const overrides: Record<string, unknown> = {}
  let hasOverrides = false

  for (const [key, value] of Object.entries(args)) {
    if (key.startsWith(prefix) && value !== undefined) {
      overrides[key.slice(prefix.length)] = value
      hasOverrides = true
    }
  }

  return hasOverrides ? overrides : undefined
}

/**
 * Extract intro settings overrides from story args.
 * Scans for args matching `intro::{selectedIntroId}::*`.
 */
export function extractIntroSettings(args: PresetStoryArgs): Record<string, unknown> | undefined {
  const introId = args.intro
  if (!introId || introId === 'none' || introId === PRESET_DEFAULT) return undefined
  return extractPrefixedSettings(args, `intro::${introId}::`)
}

/**
 * Extract experience behaviour settings overrides from story args.
 * Returns a map of behaviourId → { settingKey: value }.
 * Scans for args matching `experience::{selectedExperienceId}::{behaviourId}::*`.
 */
export function extractExperienceSettings(args: PresetStoryArgs): Record<string, Record<string, unknown>> | undefined {
  const expId = args.experience as string
  if (!expId || expId === 'none') return undefined

  const prefix = `experience::${expId}::`
  const byBehaviour: Record<string, Record<string, unknown>> = {}
  let hasOverrides = false

  for (const [key, value] of Object.entries(args)) {
    if (key.startsWith(prefix) && value !== undefined) {
      // key = experience::{expId}::{behaviourId}::{settingKey}
      const rest = key.slice(prefix.length) // {behaviourId}::{settingKey}
      const sepIdx = rest.lastIndexOf('::')
      if (sepIdx === -1) continue
      const behaviourId = rest.slice(0, sepIdx)
      const settingKey = rest.slice(sepIdx + 2)
      if (!byBehaviour[behaviourId]) byBehaviour[behaviourId] = {}
      byBehaviour[behaviourId][settingKey] = value
      hasOverrides = true
    }
  }

  return hasOverrides ? byBehaviour : undefined
}

// ── PresetPageStory ────────────────────────────────────────────────────

interface PresetPageStoryProps {
  /** Preset ID (e.g. 'noir') */
  presetId: string
  /** The preset configuration */
  preset: SitePreset
  /** Page key within the preset (e.g. 'home', 'about') */
  pageKey: string
  /** Optional sample content for resolving binding expressions */
  sampleContent?: Record<string, unknown>
  /** Experience ID or 'none'. Defaults to 'none'. */
  experience?: string
  /** Intro sequence ID, '(preset default)', or 'none'. Defaults to 'none'. */
  intro?: string
  /** Intro settings overrides extracted from Storybook args */
  introSettingsOverrides?: Record<string, unknown>
  /** Behaviour settings overrides keyed by behaviourId → { settingKey: value } */
  experienceSettingsOverrides?: Record<string, Record<string, unknown>>
  /** Section IDs pinned at viewport top (cover-scroll) */
  pinnedSections?: string[]
  /** Gap between sections (layout preset name or 'none') */
  sectionGap?: string
  /** Multiplier for the section gap value */
  sectionGapScale?: number
}

/**
 * Check if an intro config is a preset reference ({ sequence }) vs inline ({ pattern }).
 */
function isPresetIntroRef(intro: unknown): intro is PresetIntroConfig {
  return !!intro && typeof intro === 'object' && 'sequence' in intro
}

/**
 * Check if an intro config is an inline IntroConfig ({ pattern }).
 */
function isInlineIntro(intro: unknown): intro is IntroConfig {
  return !!intro && typeof intro === 'object' && 'pattern' in intro
}

/**
 * Renders a single page from a preset through SiteRenderer.
 * Experience and intro are controlled via Storybook args (dropdowns).
 *
 * Reads colorTheme from Storybook globals (via StoryGlobalsDecorator).
 * colorMode is NOT read — each section defines its own via per-section palette.
 */
export function PresetPageStory({
  presetId,
  preset,
  pageKey,
  sampleContent,
  experience: experienceArg = 'none',
  intro: introArg = 'none',
  introSettingsOverrides,
  experienceSettingsOverrides,
  pinnedSections,
  sectionGap,
  sectionGapScale,
}: PresetPageStoryProps) {
  // Read colorTheme from Storybook globals (provided by StoryGlobalsDecorator)
  const { colorTheme: globalColorTheme } = useContext(StoryGlobalsContext)
  const colorTheme = globalColorTheme ?? preset.theme?.colorTheme ?? 'contrast'

  // When user picks a different theme in Storybook, strip the preset's
  // typography overrides so the selected theme definition drives the fonts.
  const isThemeOverridden = globalColorTheme != null && globalColorTheme !== preset.theme?.colorTheme

  // Sync body bg with preset's outer background so Storybook iframe matches
  // during transitions. Cleanup resets to CSS default when navigating away.
  const themeDef = getTheme(colorTheme)
  const defaultMode = themeDef?.defaultMode ?? 'dark'
  const bgColor = preset.theme?.container?.outerBackground
    ?? themeDef?.[defaultMode]?.background
  useLayoutEffect(() => {
    if (bgColor) document.body.style.backgroundColor = bgColor
    return () => { document.body.style.backgroundColor = '' }
  }, [bgColor])

  // Build experience config from selected arg
  let experience: ExperienceConfig | undefined
  if (experienceArg !== 'none') {
    experience = { id: experienceArg }
    // Carry preset's sectionBehaviours only when the selected experience
    // matches the preset's own (other experiences define their own defaults)
    if (preset.experience && experienceArg === preset.experience.id) {
      experience.sectionBehaviours = preset.experience.sectionBehaviours
    }
  }

  // Merge behaviour settings overrides into experience sectionBehaviours
  if (experience?.sectionBehaviours && experienceSettingsOverrides) {
    const patched = { ...experience.sectionBehaviours }
    for (const [sectionId, assignments] of Object.entries(patched)) {
      patched[sectionId] = assignments.map((a: BehaviourAssignment) => {
        const overrides = experienceSettingsOverrides[a.behaviour]
        if (!overrides) return a
        return { ...a, options: { ...a.options, ...overrides } }
      })
    }
    experience = { ...experience, sectionBehaviours: patched }
  }

  // Build cover-scroll sectionBehaviours from pinnedSections checkboxes.
  // Prefer the preset's own behaviour assignments (correct variable names + target selectors).
  // Only auto-generate generic defaults for sections without preset config.
  if (experienceArg === 'cover-scroll' && pinnedSections) {
    const presetBehaviours = experience?.sectionBehaviours ?? {}
    const autoBehaviours: Record<string, BehaviourAssignment[]> = {}
    for (const sectionId of pinnedSections) {
      if (presetBehaviours[sectionId]) {
        autoBehaviours[sectionId] = presetBehaviours[sectionId]
      } else {
        autoBehaviours[sectionId] = [{
          behaviour: 'scroll/cover-progress',
          pinned: true,
          options: {
            propagateToRoot: `--${sectionId}-cover-progress`,
            propagateContentEdge: `--${sectionId}-content-edge`,
            targetSelector: `#${sectionId}`,
          },
        }]
      }
    }
    experience = { ...experience!, sectionBehaviours: autoBehaviours }
  }

  // Build intro config from selected arg
  let intro: IntroConfig | undefined
  if (introArg !== 'none') {
    if (introArg === PRESET_DEFAULT) {
      // Use preset's inline IntroConfig directly
      if (preset.experience?.intro && isInlineIntro(preset.experience.intro)) {
        intro = preset.experience.intro as IntroConfig
      } else if (preset.experience?.intro && isPresetIntroRef(preset.experience.intro)) {
        intro = resolvePresetIntro(preset.experience.intro) ?? undefined
      }
    } else {
      // Resolve from registry by sequence ID
      intro = getIntroSequence(introArg)
    }
    // Merge Storybook settings overrides into intro config
    if (intro && introSettingsOverrides) {
      intro = { ...intro, settings: { ...intro.settings, ...introSettingsOverrides } }
    }
    if (intro && sampleContent) {
      intro = resolveIntroBindings(intro, sampleContent)
    }
  }

  // Merge sectionGap + sectionGapScale overrides into theme.container
  const containerOverrides: Record<string, unknown> = {}
  if (sectionGap && sectionGap !== 'none') {
    containerOverrides.sectionGap = sectionGap
  } else if (sectionGap === 'none') {
    containerOverrides.sectionGap = undefined
  }
  if (sectionGapScale != null && sectionGapScale !== 1) {
    containerOverrides.sectionGapScale = sectionGapScale
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { typography: _presetTypography, ...presetThemeRest } = preset.theme ?? {}
  const themeOverride = {
    ...(isThemeOverridden ? presetThemeRest : preset.theme),
    colorTheme,
    ...(Object.keys(containerOverrides).length > 0 ? {
      container: { ...preset.theme?.container, ...containerOverrides },
    } : {}),
  }

  // Build SiteSchema via shared function (single code path for all consumers)
  const site = buildSiteSchemaFromPreset(presetId, preset, {
    content: sampleContent,
    themeOverride,
    experienceOverride: experience,
    introOverride: intro ?? null, // null = omit intro (Storybook controls it above)
    includeTransition: false, // Storybook doesn't use page transitions
  })

  const resolvedPage = buildPageFromPreset(preset, pageKey, sampleContent)
  if (!resolvedPage) return <div>Page &quot;{pageKey}&quot; not found in preset</div>

  // Key on experience + intro + settings forces full remount on change
  // (intros replay cleanly, experience structural changes take effect)
  const settingsKey = introSettingsOverrides ? JSON.stringify(introSettingsOverrides) : ''
  const pinnedKey = pinnedSections?.join(',') ?? ''
  return (
    <SiteRenderer
      key={`${experienceArg}-${introArg}-${sectionGap ?? ''}-${pinnedKey}-${settingsKey}`}
      site={site}
      page={resolvedPage}
      presetId={presetId}
    />
  )
}

// ── Story config helper ────────────────────────────────────────────────

/**
 * Generate Storybook meta config for a preset.
 * Includes StoryGlobalsDecorator and Experience/Intro dropdown controls.
 */
export function presetStoryConfig(presetId: string, name: string, preset?: SitePreset, figmaUrl?: string) {
  // Build experience options
  const experienceIds = getAllExperienceMetas().map(m => m.id)
  const experienceOptions = ['none', ...experienceIds]

  // Build intro options
  const introIds = getAllIntroSequenceMetas().map(m => m.id)
  const introOptions = ['none', ...introIds]

  // Detect if preset has an inline intro (not a registered sequence ref)
  const hasInlineIntro = preset?.experience?.intro && isInlineIntro(preset.experience.intro)
  if (hasInlineIntro) {
    introOptions.splice(1, 0, PRESET_DEFAULT) // after 'none'
  }

  // Build conditional argTypes and default values for each intro sequence's settings
  const introSettingArgTypes: Record<string, unknown> = {}
  const introSettingDefaults: Record<string, unknown> = {}
  for (const introMeta of getAllIntroSequenceMetas()) {
    if (introMeta.settings) {
      const settings = introMeta.settings as Record<string, SettingConfig>
      Object.assign(
        introSettingArgTypes,
        settingsToConditionalArgTypes('intro', introMeta.id, `intro::${introMeta.id}`, settings, 'Intro Settings'),
      )
      for (const [key, setting] of Object.entries(settings)) {
        introSettingDefaults[`intro::${introMeta.id}::${key}`] = setting.default
      }
    }
  }

  // Collect section IDs from preset pages (used for pinnedSections options + {section} template expansion)
  const sectionIds: string[] = []
  if (preset) {
    for (const page of Object.values(preset.pages)) {
      for (const section of page.sections) {
        if (section.id) sectionIds.push(section.id)
      }
    }
  }

  // Build conditional argTypes and defaults for each experience's behaviour settings.
  // Collects behaviours from ALL sources to handle:
  // - Lazy experiences (cinematic-portfolio, slideshow) whose definitions aren't in getAllExperiences()
  // - Preset-supplied behaviours (e.g. a preset may add scroll/cover-progress to cover-scroll)
  const experienceSettingArgTypes: Record<string, unknown> = {}
  const experienceSettingDefaults: Record<string, unknown> = {}

  // Collect behaviour IDs per experience from all sources
  const experienceBehaviours = new Map<string, Set<string>>()
  const addBehaviours = (expId: string, assignments: Record<string, BehaviourAssignment[]>) => {
    const ids = experienceBehaviours.get(expId) ?? new Set<string>()
    for (const sectionAssignments of Object.values(assignments)) {
      for (const a of sectionAssignments) {
        if (a.behaviour !== 'none') ids.add(a.behaviour)
      }
    }
    experienceBehaviours.set(expId, ids)
  }

  // Source 1: Eagerly loaded experience definitions
  for (const exp of getAllExperiences()) {
    if (exp.sectionBehaviours) addBehaviours(exp.id, exp.sectionBehaviours)
  }

  // Source 2: All registered presets (covers lazy experiences + preset-supplied behaviours)
  for (const { preset: p } of getAllPresets()) {
    if (p.experience?.sectionBehaviours) {
      addBehaviours(p.experience.id, p.experience.sectionBehaviours as Record<string, BehaviourAssignment[]>)
    }
  }

  // Generate argTypes for each experience's collected behaviours
  for (const [expId, behaviourIds] of experienceBehaviours) {
    for (const behaviourId of behaviourIds) {
      const behaviour = getBehaviour(behaviourId)
      if (!behaviour?.settings) continue
      const bSettings = behaviour.settings as Record<string, SettingConfig>
      const keyPrefix = `experience::${expId}::${behaviourId}`
      const category = `Behaviour: ${behaviour.name ?? behaviourId}`
      Object.assign(
        experienceSettingArgTypes,
        settingsToConditionalArgTypes('experience', expId, keyPrefix, bSettings, category),
      )
      for (const [key, setting] of Object.entries(bSettings)) {
        experienceSettingDefaults[`${keyPrefix}::${key}`] = setting.default
      }
    }
  }

  // Replace low-level cover-progress settings with high-level pinnedSections control.
  // Users want "which section to pin", not raw CSS variable / selector settings.
  const coverProgressPrefix = 'experience::cover-scroll::scroll/cover-progress::'
  for (const key of Object.keys(experienceSettingArgTypes)) {
    if (key.startsWith(coverProgressPrefix)) delete experienceSettingArgTypes[key]
  }
  for (const key of Object.keys(experienceSettingDefaults)) {
    if (key.startsWith(coverProgressPrefix)) delete experienceSettingDefaults[key]
  }

  // Derive default pinned sections from preset's own cover-scroll config
  const defaultPinnedSections: string[] = []
  if (preset?.experience?.id === 'cover-scroll' && preset.experience.sectionBehaviours) {
    for (const [sectionId, assignments] of Object.entries(preset.experience.sectionBehaviours)) {
      const arr = assignments as BehaviourAssignment[]
      if (arr.some(a => a.pinned)) defaultPinnedSections.push(sectionId)
    }
  }

  // Expand {section} templates in select options with actual section IDs from the preset
  if (sectionIds.length > 0) {
    for (const at of Object.values(experienceSettingArgTypes) as Array<{ options?: string[] }>) {
      if (!at.options?.some(o => o.includes('{section}'))) continue
      const expanded: string[] = []
      for (const opt of at.options) {
        if (opt.includes('{section}')) {
          for (const id of sectionIds) expanded.push(opt.replace(/\{section\}/g, id))
        } else {
          expanded.push(opt)
        }
      }
      at.options = expanded
    }
  }

  // Section gap choices (matches layout presets from theme)
  const sectionGapOptions = ['none', 'tight', 'normal', 'loose']

  // Derive defaults from preset config
  const defaultExperience = preset?.experience?.id ?? 'none'
  const defaultIntro = (() => {
    if (!preset?.experience?.intro) return 'none'
    if (isPresetIntroRef(preset.experience.intro)) return preset.experience.intro.sequence
    if (isInlineIntro(preset.experience.intro)) return PRESET_DEFAULT
    return 'none'
  })()

  return {
    title: name,
    args: {
      experience: defaultExperience,
      intro: defaultIntro,
      pinnedSections: defaultPinnedSections,
      sectionGap: preset?.theme?.container?.sectionGap ?? 'none',
      sectionGapScale: preset?.theme?.container?.sectionGapScale ?? 1,
      ...introSettingDefaults,
      ...experienceSettingDefaults,
    },
    argTypes: {
      experience: {
        control: { type: 'select' },
        options: experienceOptions,
        description: 'Experience mode. Selects the presentation/navigation model.',
        table: { category: 'L2 Experience' },
      },
      intro: {
        control: { type: 'select' },
        options: introOptions,
        description: 'Intro sequence played on mount. Some sequences require specific section content (e.g. video-hero-gate needs [data-intro-video]).',
        table: { category: 'L2 Experience' },
      },
      pinnedSections: {
        control: { type: 'inline-check' },
        options: sectionIds,
        description: 'Sections pinned at viewport top. Subsequent sections scroll over pinned ones.',
        if: { arg: 'experience', eq: 'cover-scroll' },
        table: { category: 'Cover Scroll' },
      },
      sectionGap: {
        control: { type: 'select' },
        options: sectionGapOptions,
        description: 'Gap between sections (layout preset). Visible between sections with different colorMode.',
        table: { category: 'Layout' },
      },
      sectionGapScale: {
        control: { type: 'number', min: 0.25, max: 10, step: 0.25 },
        description: 'Multiplier for the section gap value.',
        table: { category: 'Layout' },
      },
      ...introSettingArgTypes,
      ...experienceSettingArgTypes,
    },
    parameters: {
      layout: 'fullscreen',
      chromatic: { viewports: [1440] },
      ...(figmaUrl ? { design: { type: 'figma' as const, url: figmaUrl } } : {}),
    },
    decorators: [StoryGlobalsDecorator],
  }
}
