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

export interface UsePhaseControllerOptions {
  /** Reveal animation duration (ms) */
  revealDuration: number
  /** Whether the intro has a blocking gate (video-time, timer, sequence) */
  hasBlockingGate: boolean
}

/**
 * Hook that orchestrates intro phase transitions.
 * Returns trigger callback to call when pattern condition is met.
 */
export function usePhaseController(
  store: StoreApi<IntroStore>,
  options: UsePhaseControllerOptions
): { triggerReveal: () => void } {
  const { revealDuration, hasBlockingGate } = options
  const isRevealing = useRef(false)

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

  // Auto-complete if no blocking gate (e.g., scroll-reveal with visibility trigger)
  useEffect(() => {
    if (!hasBlockingGate) {
      // Small delay to allow initial render
      const timeout = setTimeout(() => {
        triggerReveal()
      }, 100)

      return () => clearTimeout(timeout)
    }
  }, [hasBlockingGate, triggerReveal])

  return { triggerReveal }
}
