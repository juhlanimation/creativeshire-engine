'use client'

/**
 * usePrefersReducedMotion - tracks user's motion preference.
 *
 * Writes:
 * - prefersReducedMotion: boolean
 *
 * Listens to prefers-reduced-motion media query and updates store.
 * Supports dynamic changes (e.g., user toggles system preference).
 */

import { useEffect } from 'react'
import type { TriggerProps } from './types'

/**
 * Reduced motion trigger hook.
 * Updates store.prefersReducedMotion based on system preference.
 */
export function usePrefersReducedMotion({ store }: TriggerProps): void {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    // Update store with current value
    const updateStore = (matches: boolean) => {
      store.setState({ prefersReducedMotion: matches })
    }

    // Initial value
    updateStore(mediaQuery.matches)

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      updateStore(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [store])
}
