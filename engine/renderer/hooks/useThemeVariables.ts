'use client'

/**
 * useThemeVariables - Manages theme side effects that can't be done via inline styles.
 *
 * Most theme CSS variables are set as inline styles on [data-site-renderer] in
 * SiteRenderer.tsx — present in the SSR HTML, zero FOUC.
 *
 * This hook handles three things that require DOM side effects:
 * 1. Scrollbar CSS custom properties on the scroll target — ::-webkit-scrollbar on html
 *    (fullpage) or [data-engine-container] (contained) can't inherit vars from children.
 * 2. Standard scrollbar properties (scrollbar-width, scrollbar-color) — only set for
 *    non-webkit browsers (Firefox). Chrome 121+ ignores ::-webkit-scrollbar when these
 *    are present, so we skip them in webkit to preserve border-radius/width control.
 * 3. Font <link> injection — dynamically loads web font stylesheets for non-system fonts
 */

import { useEffect, useLayoutEffect } from 'react'
import type { ThemeSchema, FontProvider } from '../../schema'
import type { ScrollbarType } from '../../themes/types'
import { useContainer } from '../../interface/ContainerContext'
import { getTheme } from '../../themes/registry'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const SYSTEM_FONTS = new Set([
  'system-ui', 'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy',
  '-apple-system', 'blinkmacsystemfont', 'segoe ui', 'arial', 'helvetica',
  'times new roman', 'courier new', 'inter', 'plus jakarta sans',
])

/** Builds the stylesheet URL for each font provider. */
const PROVIDER_URL: Record<FontProvider, (family: string) => string> = {
  google: (f) =>
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f)}:wght@300;400;500;600;700&display=swap`,
  bunny: (f) =>
    `https://fonts.bunny.net/css2?family=${encodeURIComponent(f)}:300,400,500,600,700&display=swap`,
  fontshare: (f) =>
    `https://api.fontshare.com/v2/css?f[]=${f.toLowerCase().replace(/\s+/g, '-')}@300,400,500,600,700&display=swap`,
}

/** Tracks loaded fonts by normalized name so no font is loaded twice. */
const loadedFonts = new Map<string, string>()

/**
 * Load a web font by injecting a <link> stylesheet into <head>.
 * Deduplicates by font name across all providers — a font loaded
 * from any provider won't be loaded again from another.
 * Returns the link element ID for cleanup tracking.
 */
function loadFont(fontFamily: string, provider: FontProvider = 'google'): string | null {
  const primary = fontFamily.split(',')[0].trim().replace(/['"]/g, '')

  // CSS variable references (e.g. var(--font-inter)) are loaded by next/font — skip
  if (/^var\(/.test(primary)) return null

  const key = primary.toLowerCase()
  if (SYSTEM_FONTS.has(key)) return null

  // Already loaded (from any provider) — return existing ID
  const existing = loadedFonts.get(key)
  if (existing) return existing

  const id = `engine-font-${key.replace(/\s+/g, '-')}`
  const buildUrl = PROVIDER_URL[provider]

  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = buildUrl(primary)
  document.head.appendChild(link)

  loadedFonts.set(key, id)
  return id
}

/**
 * Remove a previously loaded font link and its tracking entry.
 */
function unloadFont(id: string): void {
  document.getElementById(id)?.remove()
  for (const [key, value] of loadedFonts) {
    if (value === id) { loadedFonts.delete(key); break }
  }
}

/**
 * Default theme values — shared with SiteRenderer for inline styles.
 */
export const THEME_DEFAULTS = {
  scrollbar: {
    type: 'thin' as ScrollbarType,
    width: 6,
    thumb: '#000000',
    track: '#ffffff',
    thumbDark: '#ffffff',
    trackDark: '#0a0a0a',
  },
  typography: {
    title: 'Inter, system-ui, -apple-system, sans-serif',
    paragraph: 'Plus Jakarta Sans, system-ui, -apple-system, sans-serif',
  },
}

/**
 * Manages theme side effects: scrollbar vars/properties + font loading.
 *
 * Inline styles on [data-site-renderer] handle the bulk of CSS variables
 * (set in SiteRenderer.tsx, present in SSR HTML). This hook handles what
 * inline styles can't: scroll-target-level vars (for ::-webkit-scrollbar),
 * standard scrollbar properties (Firefox only), and font <link> injection.
 */
export function useThemeVariables(theme: ThemeSchema | undefined): void {
  const { mode, containerRef } = useContainer()

  // Scrollbar variables + standard properties.
  // CSS custom properties go on the scroll target so ::-webkit-scrollbar can use them.
  // Standard properties (scrollbar-width/scrollbar-color) only set for non-webkit browsers
  // — Chrome 121+ ignores ::-webkit-scrollbar when standard properties are present.
  useIsomorphicLayoutEffect(() => {
    // Resolve the scroll target: <html> in fullpage, [data-engine-container] in contained
    const target = mode === 'contained'
      ? containerRef?.current
      : document.documentElement
    if (!target) return

    // Resolve theme definition for palette fallbacks and scrollbar type
    const themeDef = theme?.colorTheme ? getTheme(theme.colorTheme) : undefined
    let paletteThumb: string | undefined
    let paletteTrack: string | undefined
    if (themeDef) {
      const colorMode = theme?.colorMode ?? themeDef.defaultMode ?? 'dark'
      const palette = themeDef[colorMode]
      paletteThumb = palette.scrollbarThumb
      paletteTrack = palette.scrollbarTrack
    }

    // CSS custom properties — ::-webkit-scrollbar pseudo-elements read these
    const scrollbar = theme?.scrollbar
    const thumb = scrollbar?.thumb ?? paletteThumb ?? THEME_DEFAULTS.scrollbar.thumb
    const track = scrollbar?.track ?? paletteTrack ?? THEME_DEFAULTS.scrollbar.track
    target.style.setProperty('--scrollbar-width', `${scrollbar?.width ?? THEME_DEFAULTS.scrollbar.width}px`)
    target.style.setProperty('--scrollbar-thumb', thumb)
    target.style.setProperty('--scrollbar-track', track)
    target.style.setProperty('--scrollbar-thumb-dark', scrollbar?.thumbDark ?? THEME_DEFAULTS.scrollbar.thumbDark)
    target.style.setProperty('--scrollbar-track-dark', scrollbar?.trackDark ?? THEME_DEFAULTS.scrollbar.trackDark)

    // Scrollbar type: site override > theme definition > default
    const resolvedType = scrollbar?.type ?? themeDef?.scrollbar?.type ?? THEME_DEFAULTS.scrollbar.type
    target.style.setProperty('--scrollbar-thumb-radius', resolvedType === 'pill' ? '9999px' : '0')

    if (resolvedType === 'hidden') {
      // Hidden: scrollbar-width: none works in all browsers and hides webkit scrollbar too
      target.style.setProperty('--scrollbar-width', '0px')
      target.style.setProperty('scrollbar-width', 'none')
    } else if (!('WebkitLineClamp' in target.style)) {
      // Non-webkit (Firefox): use standard scrollbar properties
      // Webkit browsers use ::-webkit-scrollbar pseudo-elements for border-radius control
      target.style.setProperty('scrollbar-width', 'thin')
      target.style.setProperty('scrollbar-color', `${thumb} ${track}`)
    }

    return () => {
      target.style.removeProperty('--scrollbar-width')
      target.style.removeProperty('--scrollbar-thumb')
      target.style.removeProperty('--scrollbar-track')
      target.style.removeProperty('--scrollbar-thumb-dark')
      target.style.removeProperty('--scrollbar-track-dark')
      target.style.removeProperty('--scrollbar-thumb-radius')
      target.style.removeProperty('scrollbar-width')
      target.style.removeProperty('scrollbar-color')
    }
  }, [theme?.scrollbar, theme?.colorTheme, theme?.colorMode, mode, containerRef])

  // Font <link> injection — loads web font stylesheets for non-system fonts
  useEffect(() => {
    const typography = theme?.typography
    if (!typography) return

    const provider = typography.provider ?? 'google'
    const fontLinkIds: string[] = []

    if (typography.title) {
      const id = loadFont(typography.title, provider)
      if (id) fontLinkIds.push(id)
    }
    if (typography.heading) {
      const id = loadFont(typography.heading, provider)
      if (id) fontLinkIds.push(id)
    }
    if (typography.paragraph) {
      const id = loadFont(typography.paragraph, provider)
      if (id) fontLinkIds.push(id)
    }
    if (typography.ui) {
      const id = loadFont(typography.ui, provider)
      if (id) fontLinkIds.push(id)
    }

    return () => {
      for (const id of fontLinkIds) {
        unloadFont(id)
      }
    }
  }, [theme?.typography])
}
