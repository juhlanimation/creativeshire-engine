/**
 * scroll/cover-progress behaviour.
 * Calculates how much the next sibling section overlaps a target element (0→100).
 *
 * Uses the registered element's getBoundingClientRect().bottom as the "content edge"
 * — the top of the scrolling content that covers the pinned section. This reflects
 * GSAP ScrollSmoother's transform for smooth, visually accurate position.
 *
 * Target zone is measured from an actual DOM element (targetSelector) or from
 * viewport fractions (targetTop/targetBottom) as fallback.
 *
 * Sets --cover-progress on the section element.
 * Optionally propagates to document root via propagateToRoot option
 * for cross-region consumption (e.g., logo reveal in chrome header).
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'
import { meta } from './meta'

export interface CoverProgressSettings {
  /** CSS variable name to set on document root (e.g., '--hero-cover-progress'). Empty = no propagation. */
  propagateToRoot: string
  /** CSS variable name for content edge position in px (e.g., '--hero-content-edge'). Empty = no propagation. */
  propagateContentEdge: string
  /** CSS selector for the target element to measure coverage against (e.g., '.hero-video__title'). */
  targetSelector: string
  /** Viewport fraction (0-1) for top of target zone. Fallback when no targetSelector. Default: 0 */
  targetTop: number
  /** Viewport fraction (0-1) for bottom of target zone. Fallback when no targetSelector. Default: 1 */
  targetBottom: number
}

const scrollCoverProgress: Behaviour<CoverProgressSettings> = {
  ...meta,
  requires: ['scrollProgress'],

  compute: (_state, options, element) => {
    if (!element || typeof window === 'undefined') return { '--cover-progress': 0 }

    // Content edge: bottom of this section's spacer in viewport coordinates.
    // Uses getBoundingClientRect() which reflects ScrollSmoother transforms,
    // giving the smoothed visual position (not raw window.scrollY).
    const contentEdge = element.getBoundingClientRect().bottom

    // Determine target zone — either from a real DOM element or viewport fractions.
    let targetTop: number
    let targetBottom: number
    let targetHeight: number

    const targetSelector = options?.targetSelector as string
    if (targetSelector) {
      // Query the actual target element (e.g., hero title) for precise measurement.
      // The target is typically inside a pinned section (fixed position), so its
      // getBoundingClientRect() returns stable viewport coordinates.
      const targetEl = document.querySelector(targetSelector)
      if (!targetEl) return { '--cover-progress': 0 }
      const targetRect = targetEl.getBoundingClientRect()
      targetTop = targetRect.top
      targetBottom = targetRect.bottom
      targetHeight = targetRect.height
    } else {
      // Fallback: viewport fractions
      const vh = window.innerHeight
      targetTop = ((options?.targetTop as number) ?? 0) * vh
      targetBottom = ((options?.targetBottom as number) ?? 1) * vh
      targetHeight = targetBottom - targetTop
    }

    // Progress: how much of the target zone has been covered by the content edge.
    // contentEdge starts below targetBottom (progress=0) and sweeps up past targetTop (progress=100).
    let progress: number
    if (targetHeight <= 0 || contentEdge >= targetBottom) {
      progress = 0 // Content hasn't reached target zone
    } else if (contentEdge <= targetTop) {
      progress = 100 // Content has passed through entire target zone
    } else {
      const coveredAmount = targetBottom - contentEdge
      progress = Math.min(100, Math.max(0, (coveredAmount / targetHeight) * 100))
    }

    // Propagate to document root for cross-region consumption
    const rootVar = options?.propagateToRoot as string
    if (rootVar) {
      document.documentElement.style.setProperty(rootVar, progress.toString())
    }

    // Propagate content edge position (px) for scroll-position-driven effects
    // (e.g., logo that scrolls from content edge up to its final fixed position)
    const edgeVar = options?.propagateContentEdge as string
    if (edgeVar) {
      document.documentElement.style.setProperty(edgeVar, contentEdge.toString())
    }

    return { '--cover-progress': progress }
  },

  cssTemplate: `
    will-change: contents;
  `,
}

// Auto-register on module load
registerBehaviour(scrollCoverProgress)

export default scrollCoverProgress
