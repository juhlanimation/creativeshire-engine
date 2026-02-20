/**
 * Preset Resolution Utilities
 *
 * Converts preset configurations into renderable schemas by resolving
 * binding expressions against sample content data.
 *
 * Used by:
 * - app/[[...slug]]/page.tsx (Next.js route)
 * - Storybook preset stories
 */

import { resolveBindings, processWidgets } from '../renderer/bindings'
import type { ChromeSchema } from '../schema/chrome'
import type { PageSchema, SectionSchema } from '../schema'
import type { IntroConfig } from '../intro/types'
import type { PresetChromeConfig } from './types'

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
