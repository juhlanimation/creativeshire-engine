/**
 * modal-fade behaviour - Simple opacity fade for modal.
 *
 * Computes opacity values based on modal open state.
 * Works with modal-fade effect CSS for the actual transition.
 *
 * CSS Variables Output:
 * - --modal-opacity: container opacity (0-1)
 * - --modal-backdrop-opacity: backdrop opacity (0-1)
 * - --modal-duration: transition duration
 * - --modal-easing: CSS easing function
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'

interface FadeOptions {
  duration?: number // milliseconds
  easing?: string
}

const modalFade: Behaviour = {
  id: 'modal-fade',
  name: 'Modal Fade',

  compute: (state, options) => {
    const {
      duration = 300,
      easing = 'ease-out',
    } = (options as FadeOptions) || {}

    const { prefersReducedMotion } = state
    const modalOpen = (state.modalOpen as boolean) ?? false
    const modalPhase = (state.modalPhase as string) ?? 'closed'

    // Reduced motion: instant state change
    if (prefersReducedMotion) {
      return {
        '--modal-opacity': modalOpen ? 1 : 0,
        '--modal-backdrop-opacity': modalOpen ? 1 : 0,
        '--modal-duration': '0ms',
        '--modal-easing': 'linear',
      }
    }

    // Determine target state based on phase
    const isVisible = modalPhase === 'opening' || modalPhase === 'open'

    return {
      '--modal-opacity': isVisible ? 1 : 0,
      '--modal-backdrop-opacity': isVisible ? 1 : 0,
      '--modal-duration': `${duration}ms`,
      '--modal-easing': easing,
    }
  },

  optionConfig: {
    duration: {
      type: 'range',
      label: 'Duration (ms)',
      default: 300,
      min: 100,
      max: 1000,
      step: 50,
    },
  },
}

registerBehaviour(modalFade)
export default modalFade
