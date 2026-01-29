/**
 * fade-reveal behaviour - Simple opacity fade reveal.
 *
 * Generic reveal behaviour for any container.
 * Uses `revealed` state boolean - consumer owns the state machine.
 *
 * CSS Variables Output:
 * - --fade-opacity: opacity value (0-1)
 * - --fade-duration: transition duration
 * - --fade-easing: CSS easing function
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'

const fadeReveal: Behaviour = {
  id: 'fade-reveal',
  name: 'Fade Reveal',

  compute: (state, options) => {
    const revealed = (state.revealed as boolean) ?? false
    const duration = (options?.duration as number) ?? 300
    const easing = (options?.easing as string) ?? 'ease-out'

    // Reduced motion: instant state change
    const actualDuration = state.prefersReducedMotion ? 0 : duration

    return {
      '--fade-opacity': revealed ? 1 : 0,
      '--fade-duration': `${actualDuration}ms`,
      '--fade-easing': easing,
    }
  },

  optionConfig: {
    duration: {
      type: 'range',
      label: 'Duration (ms)',
      default: 300,
      min: 50,
      max: 1000,
      step: 50,
    },
  },
}

registerBehaviour(fadeReveal)
export default fadeReveal
