/**
 * Section Story Renderer
 *
 * Renders a single section through SiteRenderer — the same path
 * production uses. Eliminates visual divergence between section
 * stories and full-site preset stories (cqw units, theme variables,
 * providers all resolve identically).
 *
 * The default theme mirrors a typical production preset:
 * - outerBackground from the active palette (no grey flashes)
 * - sectionTransition timing (smooth fades between sections)
 * - smoothScroll enabled (matches production feel)
 *
 * This means a section designed in Storybook looks identical
 * to that same section inside a preset — no surprises.
 */

import React, { useContext, useLayoutEffect, useMemo } from 'react'
import { SiteRenderer } from '../../engine/renderer/SiteRenderer'
import { StoryGlobalsContext } from './story-globals'
import { getTheme, ensureThemesRegistered } from '../../engine/themes'
import type { SiteSchema, PageSchema, SectionSchema, ThemeSchema, ChromeSchema } from '../../engine/schema'

// Ensure themes are registered before any lookups
ensureThemesRegistered()

/** Overlays available in all section stories. Both are invisible until triggered. */
const SECTION_STORY_OVERLAYS: ChromeSchema['overlays'] = {
  modal: { component: 'ModalRoot' },
  cursorLabel: { component: 'CursorLabel', props: { label: 'ENTER', targetSelector: '.text-widget a' } },
}

interface SectionStoryRendererProps {
  section: SectionSchema
}

/**
 * Renders a section through SiteRenderer with a production-realistic site shell.
 * Reads colorTheme/colorMode from Storybook globals (via StoryGlobalsDecorator).
 *
 * The theme is enriched with site-level properties that presets normally provide
 * (outerBackground, sectionTransition, smoothScroll) so sections render
 * identically in isolation vs assembled in a preset.
 */
export function SectionStoryRenderer({ section }: SectionStoryRendererProps) {
  const { colorTheme: globalColorTheme, colorMode: globalColorMode } = useContext(StoryGlobalsContext)

  const colorTheme = globalColorTheme ?? 'contrast'

  // Resolve palette for body bg sync + outerBackground default
  const themeDef = getTheme(colorTheme)
  const defaultMode = themeDef?.defaultMode ?? 'dark'
  const effectiveMode = globalColorMode ?? defaultMode
  const palette = themeDef?.[effectiveMode === 'light' ? 'light' : 'dark']

  // Sync body bg so Storybook iframe matches the theme
  useLayoutEffect(() => {
    if (palette?.background) document.body.style.backgroundColor = palette.background
    return () => { document.body.style.backgroundColor = '' }
  }, [palette?.background])

  // Build a production-realistic theme from the active colorTheme.
  const theme = useMemo((): ThemeSchema => ({
    colorTheme,
    colorMode: effectiveMode as 'dark' | 'light',
    container: {
      outerBackground: palette?.background,
    },
    sectionTransition: {
      fadeDuration: '0.15s',
      fadeEasing: 'ease-out',
    },
    smoothScroll: {
      enabled: true,
    },
  }), [colorTheme, effectiveMode, palette?.background])

  const site: SiteSchema = {
    id: 'storybook',
    theme,
    chrome: { regions: {}, overlays: SECTION_STORY_OVERLAYS },
    pages: [],
  }

  const page: PageSchema = {
    id: 'preview',
    slug: '/',
    sections: [section],
  }

  return <SiteRenderer site={site} page={page} />
}
