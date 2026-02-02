'use client'

/**
 * useGsapReveal - GSAP-powered reveal animations.
 *
 * Uses the transition registry for pluggable animations.
 * Supports any registered transition type (wipe-left, wipe-right, expand, fade, etc).
 *
 * Features:
 * - GSAP timeline for precise control
 * - Sequenced content fade (content fades in after main animation)
 * - timeline.reverse() for smooth close animations
 * - Registry-based: add new transitions without modifying this file
 */

import { useRef, useLayoutEffect, useEffect } from 'react'
import { gsap } from 'gsap'
import { resolveTransition } from './transitions/resolve'
import type { TransitionContext, TransitionOptions } from './transitions/types'

// Import transitions barrel to ensure auto-registration
import './transitions'

// Default durations (used when transition doesn't specify)
const DEFAULT_DURATIONS = {
  standard: 0.8,
  fade: 0.3,
}

/**
 * Reveal type - now accepts any registered transition ID.
 * @deprecated Use string directly for type safety with custom transitions
 */
export type RevealType = string

export interface UseGsapRevealOptions {
  /** Duration in seconds (overrides transition default) */
  duration?: number
  /** GSAP easing (overrides transition default) */
  ease?: string
  /** For expand: source element bounds */
  sourceRect?: DOMRect | null
  /** Whether to sequence content fade after reveal (default: false) */
  sequenceContentFade?: boolean
  /** Content fade duration in seconds (default: 0.3) */
  contentFadeDuration?: number
}

interface UseGsapRevealProps {
  /** Transition type ID (e.g., 'wipe-left', 'expand', 'fade') */
  type: string
  /** Whether content is revealed (true) or hidden (false) */
  revealed: boolean
  /** Animation options (override transition defaults) */
  options?: UseGsapRevealOptions
  /** Called when reveal animation completes */
  onComplete?: () => void
  /** Called when reverse (close) animation completes */
  onReverseComplete?: () => void
}

export function useGsapReveal({
  type,
  revealed,
  options = {},
  onComplete,
  onReverseComplete,
}: UseGsapRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const isInitializedRef = useRef(false)

  // Resolve transition from registry
  const transition = resolveTransition(type)

  // Merge user options with transition defaults
  const {
    duration = transition?.defaults.duration ?? DEFAULT_DURATIONS.standard,
    ease = transition?.defaults.ease ?? 'power3.inOut',
    sourceRect,
    sequenceContentFade = false,
    contentFadeDuration = DEFAULT_DURATIONS.fade,
  } = options

  // Handle reveal/hide animations
  // useLayoutEffect ensures this runs BEFORE browser paint to prevent flash
  useLayoutEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container) return

    // If transition not found, log warning and skip animation
    if (!transition) {
      console.warn(`Transition "${type}" not found in registry`)
      return
    }

    // Kill existing timeline to prevent conflicts
    timelineRef.current?.kill()

    // Build transition context
    // Use innerWidth/Height since modal fills the full viewport including scrollbar area
    // (position: fixed; inset: 0). getBoundingClientRect coords are relative to visible
    // viewport, but clip-path percentages are relative to the element's actual dimensions.
    const context: TransitionContext = {
      container,
      content: content ?? undefined,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      sourceRect,
    }

    // Build merged options
    const mergedOptions: TransitionOptions = {
      duration,
      ease,
      sequenceContentFade,
      contentFadeDuration,
      sourceRect,
    }

    if (revealed) {
      // === OPENING ANIMATION ===

      // Get initial state from transition
      const initialState = transition.getInitialState(context, mergedOptions)

      // Hide content for sequenced fade
      if (sequenceContentFade && content) {
        gsap.set(content, { opacity: 0 })
      }

      // Build the reveal timeline
      timelineRef.current = gsap.timeline({
        onComplete: () => {
          // After main animation completes, fade content in if sequencing
          if (sequenceContentFade && content) {
            gsap.to(content, {
              opacity: 1,
              duration: contentFadeDuration,
              ease: 'power2.inOut',
              onComplete,
            })
          } else {
            onComplete?.()
          }
        },
      })

      // Use custom buildTimeline if provided, otherwise interpolate states
      if (transition.buildTimeline) {
        // Custom timelines manage their own initial state
        gsap.set(container, initialState)
        transition.buildTimeline(timelineRef.current, context, mergedOptions)
      } else {
        // Get final state and animate from initial to final
        // Using fromTo() instead of set() + to() to avoid race conditions
        // where to() might read the old value before set() is applied
        const finalState = transition.getFinalState(context, mergedOptions)
        timelineRef.current.fromTo(container,
          initialState,
          {
            ...finalState,
            duration,
            ease,
          }
        )
      }

      isInitializedRef.current = true
    } else if (isInitializedRef.current) {
      // === CLOSING ANIMATION (reverse) ===

      if (sequenceContentFade && content) {
        // First fade content out, then reverse the main animation
        gsap.to(content, {
          opacity: 0,
          duration: contentFadeDuration,
          ease: 'power2.inOut',
          onComplete: () => {
            timelineRef.current?.reverse()
            timelineRef.current?.eventCallback('onReverseComplete', () => {
              onReverseComplete?.()
            })
          },
        })
      } else {
        // Just reverse the timeline
        timelineRef.current?.reverse()
        timelineRef.current?.eventCallback('onReverseComplete', () => {
          onReverseComplete?.()
        })
      }
    }
  }, [revealed, type, transition, duration, ease, sourceRect, sequenceContentFade, contentFadeDuration, onComplete, onReverseComplete])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timelineRef.current?.kill()
    }
  }, [])

  return {
    containerRef,
    contentRef,
    timelineRef,
  }
}

export default useGsapReveal
