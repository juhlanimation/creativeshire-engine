'use client'

/**
 * ThemeProvider - Injects theme CSS variables at document root.
 * Handles scrollbar, colors, and other global visual tokens.
 */

import { useEffect } from 'react'
import type { ThemeSchema } from '../schema'
import { useContainer } from '../interface/ContainerContext'
import { useSiteContainer } from './SiteContainerContext'

interface ThemeProviderProps {
  theme?: ThemeSchema
  children: React.ReactNode
}

const SYSTEM_FONTS = new Set([
  'system-ui', 'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy',
  '-apple-system', 'blinkmacsystemfont', 'segoe ui', 'arial', 'helvetica',
  'times new roman', 'courier new', 'inter', 'plus jakarta sans',
])

/**
 * Load a Google Font by injecting a <link> stylesheet into <head>.
 * Skips system fonts and fonts already loaded.
 * Returns the link element ID for cleanup tracking.
 */
function loadGoogleFont(fontFamily: string): string | null {
  const primary = fontFamily.split(',')[0].trim().replace(/['"]/g, '')
  if (SYSTEM_FONTS.has(primary.toLowerCase())) return null

  const id = `google-font-${primary.replace(/\s+/g, '-').toLowerCase()}`
  if (document.getElementById(id)) return id

  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(primary)}:wght@300;400;500;600;700&display=swap`
  document.head.appendChild(link)
  return id
}

/**
 * Default theme values.
 */
const DEFAULTS = {
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
 * Injects theme CSS variables on appropriate elements.
 *
 * Variable placement:
 * - Scrollbar: document.documentElement (fullpage) or container (contained)
 *   because CSS targets html::-webkit-scrollbar which can't inherit from children
 * - Typography/transitions: siteContainer or container element
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps): React.ReactNode {
  const { mode, containerRef } = useContainer()
  const { siteContainer } = useSiteContainer()

  useEffect(() => {
    // Container for scoped variables (typography, transitions)
    const container = mode === 'contained' && containerRef?.current
      ? containerRef.current
      : siteContainer

    // Scrollbar root: In contained mode, use container. In fullpage mode,
    // use document.documentElement because CSS targets html::-webkit-scrollbar
    // which can't inherit variables from child elements.
    const scrollbarRoot = mode === 'contained' && containerRef?.current
      ? containerRef.current
      : document.documentElement

    // Scrollbar variables (on scrollbarRoot for the scrolling element)
    const scrollbar = theme?.scrollbar
    scrollbarRoot.style.setProperty(
      '--scrollbar-width',
      `${scrollbar?.width ?? DEFAULTS.scrollbar.width}px`
    )
    scrollbarRoot.style.setProperty(
      '--scrollbar-thumb',
      scrollbar?.thumb ?? DEFAULTS.scrollbar.thumb
    )
    scrollbarRoot.style.setProperty(
      '--scrollbar-track',
      scrollbar?.track ?? DEFAULTS.scrollbar.track
    )
    scrollbarRoot.style.setProperty(
      '--scrollbar-thumb-dark',
      scrollbar?.thumbDark ?? DEFAULTS.scrollbar.thumbDark
    )
    scrollbarRoot.style.setProperty(
      '--scrollbar-track-dark',
      scrollbar?.trackDark ?? DEFAULTS.scrollbar.trackDark
    )

    // Typography variables (on container where font vars are defined)
    const typography = theme?.typography
    const fontLinkIds: string[] = []
    if (container) {
      const titleValue = typography?.title ?? DEFAULTS.typography.title
      const paragraphValue = typography?.paragraph ?? DEFAULTS.typography.paragraph

      container.style.setProperty('--font-title', titleValue)
      container.style.setProperty('--font-paragraph', paragraphValue)

      // Load Google Fonts for non-system font families
      const titleLinkId = loadGoogleFont(titleValue)
      if (titleLinkId) fontLinkIds.push(titleLinkId)
      const paragraphLinkId = loadGoogleFont(paragraphValue)
      if (paragraphLinkId) fontLinkIds.push(paragraphLinkId)

      if (typography?.ui) {
        container.style.setProperty('--font-ui', typography.ui)
        const uiLinkId = loadGoogleFont(typography.ui)
        if (uiLinkId) fontLinkIds.push(uiLinkId)
      }
    }

    // Section transition variables (on container)
    const sectionTransition = theme?.sectionTransition
    if (container && sectionTransition?.fadeDuration) {
      container.style.setProperty('--section-fade-duration', sectionTransition.fadeDuration)
    }
    if (container && sectionTransition?.fadeEasing) {
      container.style.setProperty('--section-fade-easing', sectionTransition.fadeEasing)
    }

    // Cleanup on unmount
    return () => {
      scrollbarRoot.style.removeProperty('--scrollbar-width')
      scrollbarRoot.style.removeProperty('--scrollbar-thumb')
      scrollbarRoot.style.removeProperty('--scrollbar-track')
      scrollbarRoot.style.removeProperty('--scrollbar-thumb-dark')
      scrollbarRoot.style.removeProperty('--scrollbar-track-dark')
      if (container) {
        container.style.removeProperty('--font-title')
        container.style.removeProperty('--font-paragraph')
        container.style.removeProperty('--font-ui')
        container.style.removeProperty('--section-fade-duration')
        container.style.removeProperty('--section-fade-easing')
      }
      // Remove injected Google Font links
      for (const id of fontLinkIds) {
        document.getElementById(id)?.remove()
      }
    }
  }, [theme, mode, containerRef, siteContainer])

  return <>{children}</>
}
