'use client'

/**
 * Shared smooth scroll context and hook.
 * Used by both GSAP and Lenis smooth scroll providers.
 */

import { createContext, useContext } from 'react'

/**
 * Context value for smooth scroll access.
 * Provider-agnostic — works with GSAP ScrollSmoother or Lenis.
 */
export interface SmoothScrollContextValue {
  /** Get the underlying scroll engine instance */
  getEngine: () => unknown | null
  /** Pause smooth scrolling */
  stop: () => void
  /** Resume smooth scrolling */
  start: () => void
  /** Scroll to target element or position */
  scrollTo: (target: string | HTMLElement, smooth?: boolean) => void
  /** Get current scroll position */
  getScroll: () => number
  /** Get the active smooth value (accounts for device type) */
  getSmoothValue: () => number
  /** Whether smooth scrolling is enabled */
  isEnabled: () => boolean
}

export const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null)

/**
 * Hook to access smooth scroll controls.
 */
export function useSmoothScroll(): SmoothScrollContextValue | null {
  return useContext(SmoothScrollContext)
}
