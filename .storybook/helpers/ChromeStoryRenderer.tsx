/**
 * Chrome Story Renderer
 *
 * Renders a chrome region through SiteRenderer — the same path
 * production uses. Mirrors SectionStoryRenderer but places the
 * factory output as a chrome region (header or footer) instead
 * of a page section.
 *
 * This ensures chrome pattern stories get the same theming,
 * container queries, and positioning as assembled presets.
 */

import React, { useContext, useLayoutEffect, useMemo } from 'react'
import { SiteRenderer } from '../../engine/renderer/SiteRenderer'
import { StoryGlobalsContext } from './story-globals'
import { getTheme, ensureThemesRegistered } from '../../engine/themes'
import type { SiteSchema, PageSchema, ThemeSchema, RegionSchema, ChromeSchema } from '../../engine/schema'

// Ensure themes are registered before any lookups
ensureThemesRegistered()

/** Overlays available in all chrome stories (invisible until triggered). */
const CHROME_STORY_OVERLAYS: ChromeSchema['overlays'] = {
  modal: { component: 'ModalRoot' },
  cursorLabel: { component: 'CursorLabel', props: { label: 'ENTER', targetSelector: '.text-widget a' } },
}

interface ChromeStoryRendererProps {
  /** The region schema to render */
  region: RegionSchema
  /** Which slot to place the region in */
  slot: 'header' | 'footer'
}

/**
 * Renders a chrome region through SiteRenderer with a production-realistic site shell.
 * Reads colorTheme/colorMode from Storybook globals (via StoryGlobalsDecorator).
 */
export function ChromeStoryRenderer({ region, slot }: ChromeStoryRendererProps) {
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
    chrome: {
      regions: { [slot]: region },
      overlays: CHROME_STORY_OVERLAYS,
    },
    pages: [],
  }

  // Empty page — chrome renders outside page content
  const page: PageSchema = {
    id: 'preview',
    slug: '/',
    sections: [],
  }

  return <SiteRenderer site={site} page={page} />
}
