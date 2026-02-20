/**
 * Converts a working-copy SitePreset into a SiteSchema for preview rendering.
 * Resolves binding expressions ({{ content.xxx }}) using sample content so
 * widgets display actual data instead of template placeholders.
 */

import type { SitePreset } from '../../../engine/presets/types'
import type { SiteSchema, ChromeSchema, PageSchema, SectionSchema } from '../../../engine/schema'
import { resolveBindings, processWidgets } from '../../../engine/renderer'

// Sample content for each preset (matches app/[[...slug]]/page.tsx)
import { prismSampleContent } from '../../../engine/presets/prism'
import { noirSampleContent } from '../../../engine/presets/noir'
import { loftSampleContent } from '../../../engine/presets/loft'

const PRESET_SAMPLE_CONTENT: Record<string, Record<string, unknown>> = {
  'prism': prismSampleContent,
  'noir': noirSampleContent,
  'loft': loftSampleContent,
}

/**
 * Convert PresetChromeConfig → ChromeSchema.
 * 'hidden' regions become undefined.
 */
function transformChrome(preset: SitePreset): ChromeSchema {
  const { regions, overlays } = preset.chrome
  return {
    regions: {
      header: regions.header === 'hidden' ? undefined : regions.header as ChromeSchema['regions']['header'],
      footer: regions.footer === 'hidden' ? undefined : regions.footer as ChromeSchema['regions']['footer'],
    },
    overlays: overlays as ChromeSchema['overlays'],
  }
}

/**
 * Resolve bindings in chrome regions and overlays using sample content.
 */
function resolveChromeBindings(chrome: ChromeSchema, content: Record<string, unknown>): ChromeSchema {
  const resolvedRegions = { ...chrome.regions }

  for (const key of Object.keys(resolvedRegions) as (keyof typeof resolvedRegions)[]) {
    const region = resolvedRegions[key]
    if (region && region.widgets) {
      resolvedRegions[key] = {
        ...region,
        widgets: processWidgets(region.widgets, content),
      }
    }
  }

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

  return {
    regions: resolvedRegions,
    overlays: resolvedOverlays,
  }
}

/**
 * Resolve bindings in a page schema using sample content.
 */
function resolvePageBindings(page: PageSchema, content: Record<string, unknown>): PageSchema {
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

/**
 * Build a SiteSchema from a SitePreset working copy.
 * Used by PreviewContainer to render a live preview.
 */
export function presetToSiteSchema(preset: SitePreset, presetId: string): SiteSchema {
  // Omit intro and transition for preview:
  // - intro gate hides content (opacity 0) waiting for a sequence that never plays
  // - page transition fires a fade-to-black entry animation on mount
  // Strip intro from experience too (useResolvedIntro falls back to experience.intro)
  const experience = preset.experience
    ? { id: preset.experience.id, sectionBehaviours: preset.experience.sectionBehaviours }
    : undefined

  const chrome = transformChrome(preset)
  const content = PRESET_SAMPLE_CONTENT[presetId]

  return {
    id: presetId,
    theme: preset.theme,
    experience,
    chrome: content ? resolveChromeBindings(chrome, content) : chrome,
    pages: Object.values(preset.pages).map((p) => ({ id: p.id, slug: p.slug })),
  }
}

/**
 * Get a page from a preset for preview rendering.
 * Resolves binding expressions if sample content is available.
 */
export function getPresetPage(preset: SitePreset, presetId: string, pageId?: string): PageSchema | undefined {
  const page = pageId && preset.pages[pageId]
    ? preset.pages[pageId]
    : Object.values(preset.pages)[0]

  if (!page) return undefined

  const content = PRESET_SAMPLE_CONTENT[presetId]
  return content ? resolvePageBindings(page, content) : page
}
