'use client'

/**
 * useThemeVariables - Manages theme side effects that can't be done via inline styles.
 *
 * Most theme CSS variables are set as inline styles on [data-site-renderer] in
 * SiteRenderer.tsx — present in the SSR HTML, zero FOUC.
 *
 * This hook handles two things that require DOM side effects:
 * 1. document.documentElement variables (scrollbar) — CSS rules on html
 *    can't inherit vars from child elements, so these must be set on <html> directly
 * 2. Font <link> injection — dynamically loads web font stylesheets for non-system fonts
 */

import { useEffect, useLayoutEffect } from 'react'
import type { ThemeSchema, FontProvider } from '../../schema'
import { useContainer } from '../../interface/ContainerContext'

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
 * Manages theme side effects: document.documentElement vars + font loading.
 *
 * Inline styles on [data-site-renderer] handle the bulk of CSS variables
 * (set in SiteRenderer.tsx, present in SSR HTML). This hook only handles
 * what inline styles can't: <html>-level vars and font <link> injection.
 */
export function useThemeVariables(theme: ThemeSchema | undefined): void {
  const { mode, containerRef } = useContainer()

  // document.documentElement variables — must be on <html> for CSS rules that target it
  // (scrollbar styles). useLayoutEffect ensures before-paint timing.
  useIsomorphicLayoutEffect(() => {
    // In contained mode, all vars are on the container element (via inline styles)
    if (mode === 'contained') return

    const root = document.documentElement

    // Scrollbar variables (html::-webkit-scrollbar can't inherit from children)
    const scrollbar = theme?.scrollbar
    root.style.setProperty('--scrollbar-width', `${scrollbar?.width ?? THEME_DEFAULTS.scrollbar.width}px`)
    root.style.setProperty('--scrollbar-thumb', scrollbar?.thumb ?? THEME_DEFAULTS.scrollbar.thumb)
    root.style.setProperty('--scrollbar-track', scrollbar?.track ?? THEME_DEFAULTS.scrollbar.track)
    root.style.setProperty('--scrollbar-thumb-dark', scrollbar?.thumbDark ?? THEME_DEFAULTS.scrollbar.thumbDark)
    root.style.setProperty('--scrollbar-track-dark', scrollbar?.trackDark ?? THEME_DEFAULTS.scrollbar.trackDark)

    return () => {
      root.style.removeProperty('--scrollbar-width')
      root.style.removeProperty('--scrollbar-thumb')
      root.style.removeProperty('--scrollbar-track')
      root.style.removeProperty('--scrollbar-thumb-dark')
      root.style.removeProperty('--scrollbar-track-dark')
    }
  }, [theme?.scrollbar, mode])

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
