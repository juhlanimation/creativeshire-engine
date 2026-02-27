'use client'

/**
 * useGsapReveal - GSAP-powered reveal animations.
 *
 * Uses the effect primitives registry for pluggable animations.
 * Supports any registered effect type (wipe-left, wipe-right, expand, fade, etc).
 *
 * Features:
 * - GSAP timeline for precise control
 * - Sequenced content fade (content fades in after main animation)
 * - timeline.reverse() for smooth close animations
 * - Registry-based: add new effects without modifying this file
 *
 * Container-aware:
 * In contained mode, uses container dimensions instead of window dimensions.
 */

import { useRef, useLayoutEffect, useEffect } from 'react'
import { gsap } from 'gsap'
import { resolveEffect } from '../primitives/registry'
import type { EffectContext, EffectOptions } from '../primitives/types'
import { useContainer } from '../../../interface/ContainerContext'

// Import primitives barrel to ensure auto-registration
import '../primitives'

// Default durations (used when effect doesn't specify)
const DEFAULT_DURATIONS = {
  standard: 0.8,
  fade: 0.3,
}

/**
 * Reveal type - now accepts any registered effect ID.
 * @deprecated Use string directly for type safety with custom effects
 */
export type RevealType = string

export interface UseGsapRevealOptions {
  /** Duration in seconds (overrides effect default) */
  duration?: number
  /** GSAP easing (overrides effect default) */
  ease?: string
  /** For expand: source element bounds */
  sourceRect?: DOMRect | null
  /** Whether to sequence content fade after reveal (default: false) */
  sequenceContentFade?: boolean
  /** Content fade duration in seconds (default: 0.3) */
  contentFadeDuration?: number
}

interface UseGsapRevealProps {
  /** Effect type ID (e.g., 'wipe-left', 'expand', 'fade') */
  type: string
  /** Whether content is revealed (true) or hidden (false) */
  revealed: boolean
  /** Animation options (override effect defaults) */
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

  // Get container context for contained mode
  const { getViewportWidth, getViewportHeight } = useContainer()

  // Resolve effect from registry
  const effect = resolveEffect(type)

  // Merge user options with effect defaults
  const {
    duration = effect?.defaults.duration ?? DEFAULT_DURATIONS.standard,
    ease = effect?.defaults.ease ?? 'power3.inOut',
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

    // If effect not found or has no GSAP realization, log warning and skip
    if (!effect) {
      console.warn(`Effect "${type}" not found in registry`)
      return
    }

    if (!effect.gsap) {
      console.warn(`Effect "${type}" has no GSAP realization`)
      return
    }

    const gsapRealization = effect.gsap

    // Kill existing timeline to prevent conflicts
    timelineRef.current?.kill()

    // Build effect context
    // Use container-aware viewport dimensions for contained mode support.
    // In fullpage mode, getViewportWidth/Height returns window dimensions.
    // In contained mode, returns container dimensions.
    const context: EffectContext = {
      target: container,
      content: content ?? undefined,
      viewport: {
        width: getViewportWidth(),
        height: getViewportHeight(),
      },
      sourceRect,
    }

    // Build merged options
    const mergedOptions: EffectOptions = {
      duration,
      ease,
      sequenceContentFade,
      contentFadeDuration,
      sourceRect,
    }

    if (revealed) {
      // === OPENING ANIMATION ===

      // Get initial state from effect
      const initialState = gsapRealization.getInitialState(context, mergedOptions)

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
      if (gsapRealization.buildTimeline) {
        // Custom timelines manage their own initial state
        gsap.set(container, initialState)
        gsapRealization.buildTimeline(timelineRef.current, context, mergedOptions)
      } else {
        // Get final state and animate from initial to final
        // Using fromTo() instead of set() + to() to avoid race conditions
        // where to() might read the old value before set() is applied
        const finalState = gsapRealization.getFinalState(context, mergedOptions)
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
  // eslint-disable-next-line react-hooks/exhaustive-deps -- getViewportHeight/getViewportWidth are stable refs from useContainer
  }, [revealed, type, effect, duration, ease, sourceRect, sequenceContentFade, contentFadeDuration, onComplete, onReverseComplete])

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
