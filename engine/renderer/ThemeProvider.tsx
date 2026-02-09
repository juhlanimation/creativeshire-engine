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
    if (container) {
      container.style.setProperty(
        '--font-title',
        typography?.title ?? DEFAULTS.typography.title
      )
      container.style.setProperty(
        '--font-paragraph',
        typography?.paragraph ?? DEFAULTS.typography.paragraph
      )
      if (typography?.ui) {
        container.style.setProperty('--font-ui', typography.ui)
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
    }
  }, [theme, mode, containerRef, siteContainer])

  return <>{children}</>
}
