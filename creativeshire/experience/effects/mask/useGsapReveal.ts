'use client'

/**
 * useGsapReveal - GSAP-powered reveal animations.
 *
 * Provides wipe and expand transitions matching bojuhl.com:
 * - wipe-left: clip from right, reveal left-to-right
 * - wipe-right: clip from left, reveal right-to-left
 * - expand: clip from sourceRect, expand to fullscreen
 * - fade: simple opacity transition
 *
 * Features:
 * - GSAP timeline for precise control
 * - Sequenced content fade (content fades in after wipe)
 * - timeline.reverse() for smooth close animations
 * - sourceRect support for expand-from-element
 */

import { useRef, useLayoutEffect, useEffect } from 'react'
import { gsap } from 'gsap'

// Animation constants (matching bojuhl.com)
const DURATIONS = {
  WIPE: 0.8,
  FADE: 0.3,
}

export type RevealType = 'wipe-left' | 'wipe-right' | 'expand' | 'fade'

export interface UseGsapRevealOptions {
  /** Duration in seconds (default: 0.8 for wipe, 0.3 for fade) */
  duration?: number
  /** GSAP easing (default: 'power3.inOut') */
  ease?: string
  /** For expand: source element bounds */
  sourceRect?: DOMRect | null
  /** Whether to sequence content fade after reveal (default: false) */
  sequenceContentFade?: boolean
  /** Content fade duration in seconds (default: 0.3) */
  contentFadeDuration?: number
}

interface UseGsapRevealProps {
  type: RevealType
  revealed: boolean
  options?: UseGsapRevealOptions
  onComplete?: () => void
  onReverseComplete?: () => void
}

/**
 * Computes the initial clip-path for a reveal type.
 *
 * For 'expand': Adjusts for scrollbar width difference. The sourceRect is
 * captured with scrollbar visible, but the modal fills the full viewport
 * after scroll lock hides the scrollbar.
 */
function getInitialClipPath(type: RevealType, sourceRect?: DOMRect | null): string {
  switch (type) {
    case 'wipe-left':
      // Hidden on right side, reveals left-to-right
      return 'inset(0 100% 0 0)'
    case 'wipe-right':
      // Hidden on left side, reveals right-to-left
      return 'inset(0 0 0 100%)'
    case 'expand':
      if (sourceRect) {
        // Use clientWidth/clientHeight for calculations since sourceRect
        // coordinates are relative to the content area, not the full viewport.
        // This ensures the clip-path scales correctly across the entire width.
        const vw = document.documentElement.clientWidth
        const vh = document.documentElement.clientHeight

        const top = (sourceRect.top / vh) * 100
        const bottom = ((vh - sourceRect.bottom) / vh) * 100
        const left = (sourceRect.left / vw) * 100
        const right = ((vw - sourceRect.right) / vw) * 100
        return `inset(${top}% ${right}% ${bottom}% ${left}%)`
      }
      // Fallback: expand from center
      return 'inset(50% 50% 50% 50%)'
    case 'fade':
      // Fade doesn't use clip-path
      return 'inset(0 0 0 0)'
    default:
      return 'inset(0 0 0 0)'
  }
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

  const {
    duration = type === 'fade' ? DURATIONS.FADE : DURATIONS.WIPE,
    ease = 'power3.inOut',
    sourceRect,
    sequenceContentFade = false,
    contentFadeDuration = DURATIONS.FADE,
  } = options

  // Handle reveal/hide animations
  // useLayoutEffect ensures this runs BEFORE browser paint to prevent flash
  useLayoutEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container) return

    // Kill existing timeline to prevent conflicts
    timelineRef.current?.kill()

    if (revealed) {
      // === OPENING ANIMATION ===

      // Set initial hidden state BEFORE paint
      const initialClip = getInitialClipPath(type, sourceRect)

      if (type === 'fade') {
        // For fade: start fully transparent
        gsap.set(container, { opacity: 0, visibility: 'visible' })
      } else {
        // For wipe/expand: start with clip-path hiding content
        gsap.set(container, { clipPath: initialClip, visibility: 'visible' })
      }

      // Hide content for sequenced fade
      if (sequenceContentFade && content) {
        gsap.set(content, { opacity: 0 })
      }

      // Build the reveal timeline
      timelineRef.current = gsap.timeline({
        onComplete: () => {
          // After wipe completes, fade content in if sequencing
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

      // Add the reveal animation
      if (type === 'fade') {
        timelineRef.current.to(container, {
          opacity: 1,
          duration,
          ease,
        })
      } else {
        timelineRef.current.to(container, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration,
          ease,
        })
      }

      isInitializedRef.current = true
    } else if (isInitializedRef.current) {
      // === CLOSING ANIMATION (reverse) ===

      if (sequenceContentFade && content) {
        // First fade content out, then reverse the wipe
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
        // Just reverse the wipe/fade timeline
        timelineRef.current?.reverse()
        timelineRef.current?.eventCallback('onReverseComplete', () => {
          onReverseComplete?.()
        })
      }
    }
  }, [revealed, type, duration, ease, sourceRect, sequenceContentFade, contentFadeDuration, onComplete, onReverseComplete])

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
