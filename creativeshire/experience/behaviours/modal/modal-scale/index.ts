/**
 * modal-scale behaviour - Scale + fade for modal.
 *
 * Computes scale and opacity values based on modal open state.
 * Works with modal-scale effect CSS for the actual transition.
 *
 * CSS Variables Output:
 * - --modal-scale: transform scale value
 * - --modal-opacity: container opacity (0-1)
 * - --modal-backdrop-opacity: backdrop opacity (0-1)
 * - --modal-duration: transition duration
 * - --modal-easing: CSS easing function
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'

interface ScaleOptions {
  duration?: number // milliseconds
  easing?: string
  startScale?: number // scale value when closed (default: 0.9)
}

const modalScale: Behaviour = {
  id: 'modal-scale',
  name: 'Modal Scale',

  compute: (state, options) => {
    const {
      duration = 400,
      easing = 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Slight overshoot
      startScale = 0.9,
    } = (options as ScaleOptions) || {}

    const { prefersReducedMotion } = state
    const modalOpen = (state.modalOpen as boolean) ?? false
    const modalPhase = (state.modalPhase as string) ?? 'closed'

    // Reduced motion: instant state change
    if (prefersReducedMotion) {
      return {
        '--modal-scale': modalOpen ? 1 : startScale,
        '--modal-opacity': modalOpen ? 1 : 0,
        '--modal-backdrop-opacity': modalOpen ? 1 : 0,
        '--modal-duration': '0ms',
        '--modal-easing': 'linear',
      }
    }

    // Determine target state based on phase
    const isVisible = modalPhase === 'opening' || modalPhase === 'open'

    return {
      '--modal-scale': isVisible ? 1 : startScale,
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
      default: 400,
      min: 100,
      max: 1000,
      step: 50,
    },
    startScale: {
      type: 'range',
      label: 'Start Scale',
      default: 0.9,
      min: 0.5,
      max: 1,
      step: 0.05,
    },
  },
}

registerBehaviour(modalScale)
export default modalScale
