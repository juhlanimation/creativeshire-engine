/**
 * Preset Resolution Utilities
 *
 * Converts preset configurations into renderable schemas by resolving
 * binding expressions against sample content data.
 *
 * Single source of truth: all consumers (Next.js route, Storybook,
 * preview panel) call buildSiteSchemaFromPreset() / buildPageFromPreset()
 * to get an identical SiteSchema + PageSchema from any SitePreset.
 */

import { resolveBindings, processWidgets } from '../renderer/bindings'
import type { ChromeSchema } from '../schema/chrome'
import type { SiteSchema, PageSchema, SectionSchema, ExperienceConfig, ThemeSchema } from '../schema'
import type { IntroConfig } from '../intro/types'
import type { PresetChromeConfig, SitePreset } from './types'
import type { Experience } from '../experience/compositions/types'
import { isExperienceRef } from '../experience/compositions/types'
import { getExperience } from '../experience/compositions/registry'
import { resolvePresetIntro } from '../intro/registry'

/**
 * Transform preset chrome config to site chrome schema.
 * Converts 'hidden' regions to undefined.
 */
export function transformPresetChrome(presetChrome: PresetChromeConfig): ChromeSchema {
  const regions = presetChrome.regions
  return {
    regions: {
      header: regions.header === 'hidden' ? undefined : regions.header as ChromeSchema['regions']['header'],
      footer: regions.footer === 'hidden' ? undefined : regions.footer as ChromeSchema['regions']['footer'],
    },
    overlays: presetChrome.overlays as ChromeSchema['overlays'],
    sectionChrome: presetChrome.sectionChrome,
  }
}

/**
 * Resolve bindings in chrome regions and overlays using sample content.
 */
export function resolveChromeBindings(chrome: ChromeSchema, content: Record<string, unknown>): ChromeSchema {
  const resolvedRegions = { ...chrome.regions }

  // Resolve region widgets
  for (const key of Object.keys(resolvedRegions) as (keyof typeof resolvedRegions)[]) {
    const region = resolvedRegions[key]
    if (region && region.widgets) {
      resolvedRegions[key] = {
        ...region,
        widgets: processWidgets(region.widgets, content),
      }
    }
  }

  // Resolve overlay widgets
  let resolvedOverlays = chrome.overlays
  if (chrome.overlays) {
    resolvedOverlays = {} as ChromeSchema['overlays']
    for (const [key, overlay] of Object.entries(chrome.overlays)) {
      if (overlay.widget) {
        resolvedOverlays![key] = {
          ...overlay,
          widget: {
            ...overlay.widget,
            props: resolveBindings(overlay.widget.props, content),
          },
        }
      } else if (overlay.props) {
        resolvedOverlays![key] = {
          ...overlay,
          props: resolveBindings(overlay.props, content),
        }
      } else {
        resolvedOverlays![key] = overlay
      }
    }
  }

  // Resolve sectionChrome widgets
  let resolvedSectionChrome = chrome.sectionChrome
  if (chrome.sectionChrome) {
    resolvedSectionChrome = {}
    for (const [key, widgets] of Object.entries(chrome.sectionChrome)) {
      resolvedSectionChrome[key] = processWidgets(widgets, content)
    }
  }

  return {
    regions: resolvedRegions,
    overlays: resolvedOverlays,
    sectionChrome: resolvedSectionChrome,
  }
}

/**
 * Resolve bindings in intro overlay props using sample content.
 */
export function resolveIntroBindings(intro: IntroConfig | undefined, content: Record<string, unknown>): IntroConfig | undefined {
  if (!intro?.overlay?.props) return intro
  return {
    ...intro,
    overlay: { ...intro.overlay, props: resolveBindings(intro.overlay.props, content) },
  }
}

/**
 * Resolve bindings in a page schema using sample content.
 * Processes all sections and their widgets with binding expressions.
 */
export function resolvePageBindings(page: PageSchema, content: Record<string, unknown>): PageSchema {
  return {
    ...page,
    head: resolveBindings(page.head, content),
    sections: page.sections.map(section => ({
      ...section,
      style: resolveBindings(section.style, content),
      widgets: processWidgets(section.widgets, content),
    } as SectionSchema)),
  }
}

// =============================================================================
// Experience Resolution
// =============================================================================

/**
 * Resolve the preset's experience input to a full Experience object.
 * Handles both inline ExperienceComposition and ExperienceRef (base + overrides).
 */
function resolveExperience(preset: SitePreset): Experience | undefined {
  const input = preset.experience
  if (!input) return undefined

  if (isExperienceRef(input)) {
    // ExperienceRef: look up base from registry, deep-merge overrides
    const base = getExperience(input.base)
    if (!base) {
      console.warn(`Experience base "${input.base}" not found in registry.`)
      return undefined
    }
    if (!input.overrides) return base
    // Shallow merge top-level, spread nested objects where overrides exist
    return {
      ...base,
      ...input.overrides,
      // Preserve base fields that overrides don't touch
      id: input.overrides.id ?? base.id,
      name: input.overrides.name ?? base.name,
      description: input.overrides.description ?? base.description,
      // Merge behaviour maps (overrides win per key)
      sectionBehaviours: {
        ...base.sectionBehaviours,
        ...input.overrides.sectionBehaviours,
      },
      ...(base.chromeBehaviours || input.overrides.chromeBehaviours
        ? {
            chromeBehaviours: {
              ...base.chromeBehaviours,
              ...input.overrides.chromeBehaviours,
            },
          }
        : {}),
    }
  }

  // Inline ExperienceComposition — it IS the Experience
  return input
}

/**
 * Extract ExperienceConfig (schema-level) from a resolved Experience.
 */
function extractExperienceConfig(experience: Experience): ExperienceConfig {
  return {
    id: experience.id,
    sectionBehaviours: experience.sectionBehaviours,
    ...(experience.chromeBehaviours && { chromeBehaviours: experience.chromeBehaviours }),
    ...(experience.intro && { intro: experience.intro }),
    ...(experience.transition && { transition: experience.transition }),
  }
}

// =============================================================================
// Shared Preset → SiteSchema Conversion
// =============================================================================

/**
 * Options for building a SiteSchema from a preset.
 */
export interface BuildSiteSchemaOptions {
  /** Sample content for resolving binding expressions */
  content?: Record<string, unknown>
  /** Override the preset's theme (e.g. Storybook colorTheme picker) */
  themeOverride?: ThemeSchema
  /** Override the preset's experience entirely */
  experienceOverride?: ExperienceConfig
  /** Override the preset's intro entirely (null = omit) */
  introOverride?: IntroConfig | null
  /** Include page transition config from preset (default: true) */
  includeTransition?: boolean
  /** Include intro config from preset (default: true) */
  includeIntro?: boolean
}

/**
 * Build a SiteSchema from a SitePreset.
 * Single code path used by all consumers (Next.js route, Storybook, preview).
 */
export function buildSiteSchemaFromPreset(
  presetId: string,
  preset: SitePreset,
  options: BuildSiteSchemaOptions = {},
): SiteSchema {
  const {
    content,
    themeOverride,
    experienceOverride,
    introOverride,
    includeTransition = true,
    includeIntro = true,
  } = options

  // Chrome: transform preset regions → schema, then resolve bindings
  let chrome: ChromeSchema = transformPresetChrome(preset.content.chrome)
  if (content) {
    chrome = resolveChromeBindings(chrome, content)
  }

  // Experience: resolve ExperienceRef if needed, then extract ExperienceConfig
  let experience: ExperienceConfig | undefined
  if (experienceOverride !== undefined) {
    experience = experienceOverride
  } else {
    const resolved = resolveExperience(preset)
    if (resolved) {
      experience = extractExperienceConfig(resolved)
    }
  }

  // Intro: resolve from experience config's intro reference
  if (experience) {
    let intro: IntroConfig | undefined
    if (introOverride !== undefined) {
      intro = introOverride ?? undefined
    } else if (includeIntro && experience.intro) {
      const presetIntro = experience.intro
      if ('pattern' in presetIntro) {
        // Inline IntroConfig
        intro = presetIntro as IntroConfig
      } else if ('sequence' in presetIntro) {
        // PresetIntroConfig reference → resolve from registry
        intro = resolvePresetIntro(presetIntro) ?? undefined
      }
      if (intro && content) {
        intro = resolveIntroBindings(intro, content)
      }
    }

    // Strip intro from experience if not included, or replace with resolved version
    if (!includeIntro) {
      const { intro: _stripped, ...rest } = experience
      experience = rest
    } else if (intro) {
      experience = { ...experience, intro }
    }

    // Strip transition from experience if not included
    if (!includeTransition) {
      const { transition: _stripped, ...rest } = experience
      experience = rest
    }
  }

  return {
    id: presetId,
    theme: themeOverride ?? preset.theme.theme,
    chrome,
    pages: Object.values(preset.content.pages).map(p => ({ id: p.id, slug: p.slug })),
    ...(experience && { experience }),
  }
}

/**
 * Build a resolved PageSchema from a preset.
 * Looks up by page key or slug, resolves bindings if content provided.
 */
export function buildPageFromPreset(
  preset: SitePreset,
  pageKeyOrSlug: string,
  content?: Record<string, unknown>,
): PageSchema | undefined {
  // Try direct key lookup first, then slug match
  const page = preset.content.pages[pageKeyOrSlug]
    ?? Object.values(preset.content.pages).find(p => p.slug === pageKeyOrSlug)

  if (!page) return undefined
  return content ? resolvePageBindings(page, content) : page
}
