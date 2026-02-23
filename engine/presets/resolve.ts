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
  let chrome: ChromeSchema = transformPresetChrome(preset.chrome)
  if (content) {
    chrome = resolveChromeBindings(chrome, content)
  }

  // Experience: use override, or map preset experience (strip extra fields)
  const experience: ExperienceConfig | undefined =
    experienceOverride !== undefined
      ? experienceOverride
      : preset.experience
        ? { id: preset.experience.id, sectionBehaviours: preset.experience.sectionBehaviours }
        : undefined

  // Intro: resolve from preset's experience.intro reference
  let intro: IntroConfig | undefined
  if (introOverride !== undefined) {
    intro = introOverride ?? undefined
  } else if (includeIntro && preset.experience?.intro) {
    const presetIntro = preset.experience.intro
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

  return {
    id: presetId,
    theme: themeOverride ?? preset.theme,
    chrome,
    pages: Object.values(preset.pages).map(p => ({ id: p.id, slug: p.slug })),
    ...(experience && { experience }),
    ...(intro && { intro }),
    ...(includeTransition && preset.transition && { transition: preset.transition }),
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
  const page = preset.pages[pageKeyOrSlug]
    ?? Object.values(preset.pages).find(p => p.slug === pageKeyOrSlug)

  if (!page) return undefined
  return content ? resolvePageBindings(page, content) : page
}
