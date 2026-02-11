'use client'

/**
 * usePhaseController - orchestrates intro phase transitions.
 *
 * Manages the lifecycle: locked → revealing → ready
 * Coordinates reveal animation timing and chrome visibility.
 */

import { useEffect, useRef, useCallback } from 'react'
import type { StoreApi } from 'zustand'
import type { IntroStore } from '../IntroContext'
import type { IntroPattern } from '../types'

export interface UsePhaseControllerOptions {
  /** The intro pattern being used */
  pattern: IntroPattern
  /** Pattern settings (overrides pattern defaults) */
  settings?: Record<string, unknown>
}

/**
 * Hook that orchestrates intro phase transitions.
 * Returns trigger callback to call when pattern condition is met.
 */
export function usePhaseController(
  store: StoreApi<IntroStore>,
  options: UsePhaseControllerOptions
): { triggerReveal: () => void } {
  const { pattern, settings } = options
  const isRevealing = useRef(false)

  // Get reveal duration from settings or pattern default
  const revealDuration =
    (settings?.revealDuration as number) ?? pattern.revealDuration

  /**
   * Trigger the reveal phase.
   * Called when pattern's trigger condition is met.
   */
  const triggerReveal = useCallback(() => {
    if (isRevealing.current) return
    isRevealing.current = true

    const state = store.getState()

    // Already completed, skip
    if (state.phase === 'ready') return

    // Instant reveal: skip animation, go straight to ready.
    // Ensures scroll, chrome, and content all appear in one frame.
    if (revealDuration <= 100) {
      state.completeIntro()
      return
    }

    // Animated reveal: transition through revealing → ready
    state.setPhase('revealing')

    const startTime = performance.now()

    const animateReveal = () => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(elapsed / revealDuration, 1)

      store.getState().setRevealProgress(progress)

      if (progress < 1) {
        requestAnimationFrame(animateReveal)
      } else {
        // Reveal complete - transition to ready
        store.getState().completeIntro()
      }
    }

    requestAnimationFrame(animateReveal)
  }, [store, revealDuration])

  // Auto-complete if no triggers (scroll-reveal with visibility trigger)
  useEffect(() => {
    // If pattern has no blocking triggers, start reveal immediately
    const hasBlockingTrigger = pattern.triggers.some(
      (t) => t.type === 'video-time' || t.type === 'timer' || t.type === 'sequence'
    )

    if (!hasBlockingTrigger) {
      // Small delay to allow initial render
      const timeout = setTimeout(() => {
        triggerReveal()
      }, 100)

      return () => clearTimeout(timeout)
    }
  }, [pattern.triggers, triggerReveal])

  return { triggerReveal }
}
