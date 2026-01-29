'use client'

/**
 * useScrollFadeBehaviour - GSAP ScrollTrigger driver for scroll-fade behaviours.
 *
 * Architecture: Uses "GSAP as Driver" pattern (experience.spec.md:377-395).
 * - ScrollTrigger watches scroll position
 * - Calls behaviour.compute() to get CSS variables
 * - Sets CSS variables directly via element.style.setProperty()
 * - Bypasses React entirely for 60fps animation
 *
 * Supports both scroll-fade (fade in) and scroll-fade-out (fade out) behaviours
 * with appropriate ScrollTrigger configurations for each direction.
 */

import { useEffect, useRef, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { resolveBehaviour } from '../resolve'
import type { BehaviourState } from '../../../schema/experience'

// Register plugin (client-only)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/** Supported scroll-fade behaviour types (supports both old and new IDs) */
type ScrollFadeBehaviourId =
  | 'scroll/fade'
  | 'scroll/fade-out'
  | 'scroll-fade'      // Legacy alias
  | 'scroll-fade-out'  // Legacy alias

interface UseScrollFadeBehaviourOptions {
  /** ScrollTrigger start position (defaults based on behaviour type) */
  start?: string
  /** ScrollTrigger end position (defaults based on behaviour type) */
  end?: string
  /** Smoothing delay in seconds (default: 0.5 for butter-smooth) */
  scrub?: number
}

/**
 * Get default ScrollTrigger positions based on behaviour type.
 * - scroll/fade (scroll-fade): triggers as section enters viewport from bottom
 * - scroll/fade-out (scroll-fade-out): triggers as section exits viewport at top
 */
function getDefaultPositions(behaviourId: ScrollFadeBehaviourId): { start: string; end: string } {
  if (behaviourId === 'scroll/fade-out' || behaviourId === 'scroll-fade-out') {
    // Fade out as section scrolls up and exits viewport
    return { start: 'top top', end: 'bottom top' }
  }
  // Fade in as section enters viewport from bottom
  return { start: 'top 70%', end: 'top 30%' }
}

/**
 * Hook that drives scroll-fade behaviours using GSAP ScrollTrigger.
 * Sets CSS variables directly on the element, bypassing React.
 *
 * @param ref - Ref to the element to animate
 * @param behaviourId - The scroll-fade behaviour type ('scroll/fade' or 'scroll/fade-out')
 * @param options - ScrollTrigger configuration overrides
 */
export function useScrollFadeBehaviour(
  ref: RefObject<HTMLElement | null>,
  behaviourId: ScrollFadeBehaviourId = 'scroll/fade',
  options: UseScrollFadeBehaviourOptions = {}
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
     * This is the "GSAP as Driver" pattern - driver calls compute(), sets vars directly.
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
        prefersReducedMotion,
      }
      const vars = behaviour.compute(state, {})
      Object.entries(vars).forEach(([key, val]) => {
        el.style.setProperty(key, String(val))
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

export default useScrollFadeBehaviour
