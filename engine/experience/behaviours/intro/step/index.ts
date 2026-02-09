/**
 * intro/step behaviour - maps intro step state to CSS variables.
 *
 * Reads currentStep and stepProgress from intro state and outputs
 * CSS variables that content elements use to control their visibility.
 *
 * CSS Variables Output:
 * - --intro-step: Current step index (0, 1, 2, ...)
 * - --intro-step-progress: Progress within current step (0-1)
 * - --intro-overlay-opacity: Overlay opacity (computed from step/progress)
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'
import { meta } from './meta'

export interface IntroStepSettings {
  /** Step index at which the overlay starts fading (default: 2) */
  overlayFadeStep: number
}

const introStep: Behaviour<IntroStepSettings> = {
  ...meta,
  requires: ['currentStep', 'stepProgress', 'prefersReducedMotion'],

  compute: (state, options) => {
    const { overlayFadeStep = 2 } = (options as Partial<IntroStepSettings>) || {}

    const currentStep = (state.currentStep as number) ?? 0
    const stepProgress = (state.stepProgress as number) ?? 0

    // Respect reduced motion
    if (state.prefersReducedMotion) {
      const phase = (state.phase as string) ?? 'locked'
      const isReady = phase === 'ready'
      return {
        '--intro-step': currentStep,
        '--intro-step-progress': stepProgress,
        '--intro-overlay-opacity': isReady ? 0 : 1,
      }
    }

    // Compute overlay opacity: 1 until overlayFadeStep, then fades with progress
    let overlayOpacity = 1
    if (currentStep > overlayFadeStep) {
      overlayOpacity = 0
    } else if (currentStep === overlayFadeStep) {
      overlayOpacity = 1 - stepProgress
    }

    return {
      '--intro-step': currentStep,
      '--intro-step-progress': stepProgress,
      '--intro-overlay-opacity': overlayOpacity,
    }
  },
}

// Auto-register on module load
registerBehaviour(introStep)

export default introStep
