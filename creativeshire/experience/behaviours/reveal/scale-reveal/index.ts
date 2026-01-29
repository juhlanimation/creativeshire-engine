/**
 * scale-reveal behaviour - Scale + fade reveal with optional overshoot.
 *
 * Generic reveal behaviour for any container.
 * Uses `revealed` state boolean - consumer owns the state machine.
 *
 * CSS Variables Output:
 * - --scale-transform: scale transform value
 * - --scale-opacity: opacity value (0-1)
 * - --scale-duration: transition duration
 * - --scale-easing: CSS easing function
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'

const scaleReveal: Behaviour = {
  id: 'scale-reveal',
  name: 'Scale Reveal',

  compute: (state, options) => {
    const revealed = (state.revealed as boolean) ?? false
    const duration = (options?.duration as number) ?? 400
    const easing = (options?.easing as string) ?? 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Overshoot
    const hiddenScale = (options?.hiddenScale as number) ?? 0.9

    // Reduced motion: instant state change
    const actualDuration = state.prefersReducedMotion ? 0 : duration

    return {
      '--scale-transform': revealed ? 'scale(1)' : `scale(${hiddenScale})`,
      '--scale-opacity': revealed ? 1 : 0,
      '--scale-duration': `${actualDuration}ms`,
      '--scale-easing': easing,
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
    hiddenScale: {
      type: 'range',
      label: 'Hidden Scale',
      default: 0.9,
      min: 0.5,
      max: 1,
      step: 0.05,
    },
  },
}

registerBehaviour(scaleReveal)
export default scaleReveal
