/**
 * modal-mask-wipe behaviour - Reveals modal via clip-path wipe from edge.
 *
 * Computes clip-path inset values based on modal open state and direction.
 * Works with modal-mask effect CSS for the actual transition.
 *
 * CSS Variables Output:
 * - --modal-clip: clip-path inset value
 * - --modal-content-opacity: content opacity (0-1)
 * - --modal-duration: transition duration
 * - --modal-content-delay: delay for content fade
 * - --modal-easing: CSS easing function
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'

type Direction = 'left' | 'right' | 'top' | 'bottom'

interface MaskWipeOptions {
  direction?: Direction
  duration?: number // milliseconds
  easing?: string
}

/**
 * Clip-path inset values by direction.
 * Format: inset(top right bottom left)
 */
const CLIP_VALUES: Record<Direction, { closed: string; open: string }> = {
  left: { closed: 'inset(0 100% 0 0)', open: 'inset(0 0 0 0)' },
  right: { closed: 'inset(0 0 0 100%)', open: 'inset(0 0 0 0)' },
  top: { closed: 'inset(100% 0 0 0)', open: 'inset(0 0 0 0)' },
  bottom: { closed: 'inset(0 0 100% 0)', open: 'inset(0 0 0 0)' },
}

const modalMaskWipe: Behaviour = {
  id: 'modal-mask-wipe',
  name: 'Modal Mask Wipe',

  compute: (state, options) => {
    const {
      direction = 'left',
      duration = 800,
      easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
    } = (options as MaskWipeOptions) || {}

    const { prefersReducedMotion } = state
    const modalOpen = (state.modalOpen as boolean) ?? false
    const modalPhase = (state.modalPhase as string) ?? 'closed'

    // Reduced motion: instant state change, no animation
    if (prefersReducedMotion) {
      const clips = CLIP_VALUES[direction]
      return {
        '--modal-clip': modalOpen ? clips.open : clips.closed,
        '--modal-content-opacity': modalOpen ? 1 : 0,
        '--modal-backdrop-opacity': modalOpen ? 1 : 0,
        '--modal-duration': '0ms',
        '--modal-content-delay': '0ms',
        '--modal-easing': 'linear',
      }
    }

    // Determine target state based on phase
    const isVisible = modalPhase === 'opening' || modalPhase === 'open'
    const clips = CLIP_VALUES[direction]

    return {
      // Container clip-path
      '--modal-clip': isVisible ? clips.open : clips.closed,
      // Content opacity
      '--modal-content-opacity': isVisible ? 1 : 0,
      // Backdrop opacity
      '--modal-backdrop-opacity': isVisible ? 1 : 0,
      // Timing
      '--modal-duration': `${duration}ms`,
      '--modal-content-delay': `${Math.round(duration * 0.3)}ms`, // Content starts at 30%
      '--modal-easing': easing,
    }
  },

  optionConfig: {
    direction: {
      type: 'select',
      label: 'Direction',
      default: 'left',
      choices: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
        { value: 'top', label: 'Top' },
        { value: 'bottom', label: 'Bottom' },
      ],
    },
    duration: {
      type: 'range',
      label: 'Duration (ms)',
      default: 800,
      min: 100,
      max: 2000,
      step: 50,
    },
  },
}

registerBehaviour(modalMaskWipe)
export default modalMaskWipe
