'use client'

/**
 * ThemeProvider - Injects theme CSS variables at document root.
 * Handles scrollbar, colors, and other global visual tokens.
 */

import { useEffect } from 'react'
import type { ThemeSchema } from '../schema'

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
    title: 'var(--font-inter), system-ui, -apple-system, sans-serif',
    paragraph: 'var(--font-plus-jakarta), system-ui, -apple-system, sans-serif',
  },
}

/**
 * Injects theme as CSS variables on document root.
 * Typography vars are set on body where Next.js font vars are available.
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps): React.ReactNode {
  useEffect(() => {
    const root = document.documentElement
    const body = document.body

    // Scrollbar variables (on root for global scroll)
    const scrollbar = theme?.scrollbar
    root.style.setProperty(
      '--scrollbar-width',
      `${scrollbar?.width ?? DEFAULTS.scrollbar.width}px`
    )
    root.style.setProperty(
      '--scrollbar-thumb',
      scrollbar?.thumb ?? DEFAULTS.scrollbar.thumb
    )
    root.style.setProperty(
      '--scrollbar-track',
      scrollbar?.track ?? DEFAULTS.scrollbar.track
    )
    root.style.setProperty(
      '--scrollbar-thumb-dark',
      scrollbar?.thumbDark ?? DEFAULTS.scrollbar.thumbDark
    )
    root.style.setProperty(
      '--scrollbar-track-dark',
      scrollbar?.trackDark ?? DEFAULTS.scrollbar.trackDark
    )

    // Typography variables (on body where Next.js font vars are defined)
    const typography = theme?.typography
    body.style.setProperty(
      '--font-title',
      typography?.title ?? DEFAULTS.typography.title
    )
    body.style.setProperty(
      '--font-paragraph',
      typography?.paragraph ?? DEFAULTS.typography.paragraph
    )
    if (typography?.ui) {
      body.style.setProperty('--font-ui', typography.ui)
    }

    // Section transition variables
    const sectionTransition = theme?.sectionTransition
    if (sectionTransition?.fadeDuration) {
      root.style.setProperty('--section-fade-duration', sectionTransition.fadeDuration)
    }
    if (sectionTransition?.fadeEasing) {
      root.style.setProperty('--section-fade-easing', sectionTransition.fadeEasing)
    }

    // Cleanup on unmount
    return () => {
      root.style.removeProperty('--scrollbar-width')
      root.style.removeProperty('--scrollbar-thumb')
      root.style.removeProperty('--scrollbar-track')
      root.style.removeProperty('--scrollbar-thumb-dark')
      root.style.removeProperty('--scrollbar-track-dark')
      body.style.removeProperty('--font-title')
      body.style.removeProperty('--font-paragraph')
      body.style.removeProperty('--font-ui')
      root.style.removeProperty('--section-fade-duration')
      root.style.removeProperty('--section-fade-easing')
    }
  }, [theme])

  return <>{children}</>
}
