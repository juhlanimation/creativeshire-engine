/**
 * mask-reveal behaviour - Reveals content via clip-path wipe from edge.
 *
 * Generic reveal behaviour for any container (modals, drawers, tooltips, etc.).
 * Uses `revealed` state boolean - consumer owns the state machine.
 *
 * CSS Variables Output:
 * - --mask-clip: clip-path inset value
 * - --mask-duration: transition duration
 * - --mask-easing: CSS easing function
 * - --mask-content-opacity: opacity for nested content
 * - --mask-content-delay: delay for content fade-in
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'

type Direction = 'left' | 'right' | 'top' | 'bottom'

/**
 * Clip-path inset values by direction.
 * Format: inset(top right bottom left)
 */
const CLIPS: Record<Direction, { hidden: string; revealed: string }> = {
  left: { hidden: 'inset(0 100% 0 0)', revealed: 'inset(0 0 0 0)' },
  right: { hidden: 'inset(0 0 0 100%)', revealed: 'inset(0 0 0 0)' },
  top: { hidden: 'inset(0 0 100% 0)', revealed: 'inset(0 0 0 0)' },
  bottom: { hidden: 'inset(100% 0 0 0)', revealed: 'inset(0 0 0 0)' },
}

const maskReveal: Behaviour = {
  id: 'mask-reveal',
  name: 'Mask Reveal',

  compute: (state, options) => {
    const revealed = (state.revealed as boolean) ?? false
    const direction = (options?.direction as Direction) ?? 'left'
    const duration = (options?.duration as number) ?? 800
    const easing = (options?.easing as string) ?? 'cubic-bezier(0.4, 0, 0.2, 1)'
    const contentDelay = (options?.contentDelay as number) ?? 0.3 // % of duration

    // Reduced motion: instant state change
    const actualDuration = state.prefersReducedMotion ? 0 : duration

    const clip = revealed ? CLIPS[direction].revealed : CLIPS[direction].hidden

    return {
      // Container clip-path
      '--mask-clip': clip,
      '--mask-duration': `${actualDuration}ms`,
      '--mask-easing': easing,

      // Nested content fade (marked with data-reveal="content")
      '--mask-content-opacity': revealed ? 1 : 0,
      '--mask-content-delay': revealed ? `${Math.round(actualDuration * contentDelay)}ms` : '0ms',
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
    contentDelay: {
      type: 'range',
      label: 'Content Delay (%)',
      default: 0.3,
      min: 0,
      max: 1,
      step: 0.1,
    },
  },
}

registerBehaviour(maskReveal)
export default maskReveal
