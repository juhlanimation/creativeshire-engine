'use client'

/**
 * useScrollFadeDriver - GSAP ScrollTrigger driver for scroll-fade behaviours.
 *
 * Architecture:
 * - Driver applies CSS variables at 60fps, bypassing React
 * - ScrollTrigger watches scroll position
 * - Calls behaviour.compute() to get CSS variables
 * - Sets CSS variables directly via element.style.setProperty()
 *
 * Supports both scroll/fade (fade in) and scroll/fade-out (fade out) behaviours
 * with appropriate ScrollTrigger configurations for each direction.
 */

import { useEffect, useRef, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { resolveBehaviour } from '../behaviours/resolve'
import { MIN_PAINT_OPACITY } from '../behaviours/types'
import type { BehaviourState } from '../../schema/experience'

// Register plugin (client-only)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/** Supported scroll-fade behaviour types */
type ScrollFadeBehaviourId = 'scroll/fade' | 'scroll/fade-out'

export interface UseScrollFadeDriverOptions {
  /** ScrollTrigger start position (defaults based on behaviour type) */
  start?: string
  /** ScrollTrigger end position (defaults based on behaviour type) */
  end?: string
  /** Smoothing delay in seconds (default: 0.5 for butter-smooth) */
  scrub?: number
}

/**
 * Get default ScrollTrigger positions based on behaviour type.
 * - scroll/fade: triggers as section enters viewport from bottom
 * - scroll/fade-out: triggers as section exits viewport at top
 */
function getDefaultPositions(behaviourId: ScrollFadeBehaviourId): { start: string; end: string } {
  if (behaviourId === 'scroll/fade-out') {
    // Fade out as section scrolls up and exits viewport
    return { start: 'top top', end: 'bottom top' }
  }
  // Fade in as section enters viewport from bottom
  return { start: 'top 70%', end: 'top 30%' }
}

/**
 * Driver hook that applies scroll-fade CSS variables at 60fps using GSAP ScrollTrigger.
 * Bypasses React for performance-critical scroll animations.
 *
 * @param ref - Ref to the element to animate
 * @param behaviourId - The scroll-fade behaviour type ('scroll/fade' or 'scroll/fade-out')
 * @param options - ScrollTrigger configuration overrides
 */
export function useScrollFadeDriver(
  ref: RefObject<HTMLElement | null>,
  behaviourId: ScrollFadeBehaviourId = 'scroll/fade',
  options: UseScrollFadeDriverOptions = {}
): void {
  const defaults = getDefaultPositions(behaviourId)
  const { start = defaults.start, end = defaults.end, scrub = 0.5 } = options
  const maxProgressRef = useRef(0) // For mobile: only increase (prevents flicker on scroll-up)

  useEffect(() => {
    if (!ref.current) return

    const el = ref.current
    const behaviour = resolveBehaviour(behaviourId)
    if (!behaviour) return

    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    /**
     * Set CSS variables on element using behaviour.compute().
     * Driver calls compute(), sets vars directly on DOM.
     */
    const setVars = (progress: number) => {
      const state: BehaviourState = {
        scrollProgress: 0,
        scrollVelocity: 0,
        sectionProgress: progress,
        sectionVisibility: progress,
        sectionIndex: 0,
        totalSections: 1,
        isActive: true,
        isHovered: false,
        isPressed: false,
        prefersReducedMotion,
      }
      const vars = behaviour.compute(state, {})
      Object.entries(vars).forEach(([key, val]) => {
        let value = String(val)
        if (behaviour.prerasterize && key.includes('opacity')) {
          const num = Number(val)
          if (num < MIN_PAINT_OPACITY) value = String(MIN_PAINT_OPACITY)
        }
        el.style.setProperty(key, value)
      })
    }

    // Small delay for ScrollSmoother to initialize
    const timer = setTimeout(() => {
      if (isTouchDevice) {
        // Mobile: opacity only increases (prevents flicker on scroll-up)
        setVars(0)
        ScrollTrigger.create({
          trigger: el,
          start,
          end,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress > maxProgressRef.current) {
              maxProgressRef.current = self.progress
              setVars(self.progress)
            }
          },
        })
      } else {
        // Desktop: bidirectional scrub with smoothing
        setVars(0)
        ScrollTrigger.create({
          trigger: el,
          start,
          end,
          scrub,
          invalidateOnRefresh: true,
          onUpdate: (self) => setVars(self.progress),
        })
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      // Kill only ScrollTriggers attached to this element
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === el)
        .forEach((t) => t.kill())
    }
  }, [ref, behaviourId, start, end, scrub])
}

export default useScrollFadeDriver
