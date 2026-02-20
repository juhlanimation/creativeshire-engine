'use client'

/**
 * useSequence - multi-step timed sequence trigger for intro patterns.
 *
 * Orchestrates a series of timed steps using EffectTimeline's sequential mode.
 * Each step updates currentStep and stepProgress in the intro store,
 * allowing behaviours and components to react via CSS variables.
 */

import { useEffect, useRef } from 'react'
import type { StoreApi } from 'zustand'
import type { IntroStore } from '../IntroContext'
import type { SequenceStepConfig } from '../types'
import { EffectTimeline } from '../../experience/timeline/EffectTimeline'

export interface UseSequenceOptions {
  /** Step configurations defining the sequence */
  steps: SequenceStepConfig[]
  /** Whether the sequence trigger is active */
  enabled?: boolean
  /** Callback when entire sequence completes */
  onComplete?: () => void
}

/**
 * Animate stepProgress from 0 to 1 over a given duration using RAF.
 */
function animateProgress(
  store: StoreApi<IntroStore>,
  duration: number,
): Promise<void> {
  return new Promise((resolve) => {
    if (duration <= 0) {
      store.getState().setStepProgress(1)
      resolve()
      return
    }

    const startTime = performance.now()

    const tick = () => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      store.getState().setStepProgress(progress)

      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        resolve()
      }
    }

    requestAnimationFrame(tick)
  })
}

/**
 * Hook that orchestrates a multi-step timed intro sequence.
 * Uses EffectTimeline's sequential mode internally.
 */
export function useSequence(
  store: StoreApi<IntroStore>,
  options: UseSequenceOptions,
): void {
  const { steps, enabled = true, onComplete } = options
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || hasStarted.current) return
    if (steps.length === 0) return

    hasStarted.current = true

    const timeline = new EffectTimeline()

    // Sort steps by their `at` time to ensure correct ordering
    const sortedSteps = [...steps].sort((a, b) => a.at - b.at)

    let previousEnd = 0

    for (let i = 0; i < sortedSteps.length; i++) {
      const step = sortedSteps[i]
      const delay = Math.max(0, step.at - previousEnd)
      const stepIndex = i

      timeline.addSequentialTrack(step.id, delay, async () => {
        const state = store.getState()

        // Update step index and reset progress
        state.setCurrentStep(stepIndex)
        state.setStepProgress(0)

        // Apply step actions
        if (step.actions?.setChromeVisible !== undefined) {
          state.setChromeVisible(step.actions.setChromeVisible)
        }
        if (step.actions?.setScrollLocked !== undefined) {
          state.setScrollLocked(step.actions.setScrollLocked)
        }

        // Animate progress for this step
        await animateProgress(store, step.duration)
      })

      previousEnd = step.at + step.duration
    }

    // Run the sequence
    timeline.playSequential().then(() => {
      onComplete?.()
    })

    return () => {
      timeline.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])
}
