/**
 * interaction/toggle behaviour - click/tap toggle state.
 *
 * Generic behaviour for toggle interactions (accordion, menu expand, etc.)
 * Sets --active variable for CSS to animate.
 *
 * CSS Variables Output:
 * - --active: Toggle state (0 or 1)
 * - --active-scale: Scale value for active state
 * - --active-opacity: Opacity for active content
 */

import type { Behaviour } from '../types'
import { registerBehaviour } from '../registry'

const interactionToggle: Behaviour = {
  id: 'interaction/toggle',
  name: 'Interaction Toggle',
  requires: ['isActive', 'prefersReducedMotion'],

  compute: (state, options) => {
    const isActive = state.isActive ? 1 : 0
    const scaleAmount = (options?.scale as number) ?? 1.02

    // Respect reduced motion preference - no scale animation
    if (state.prefersReducedMotion) {
      return {
        '--active': isActive,
        '--active-scale': 1,
        '--active-opacity': isActive
      }
    }

    return {
      '--active': isActive,
      '--active-scale': isActive ? scaleAmount : 1,
      '--active-opacity': isActive
    }
  },

  cssTemplate: `
    transform: scale(var(--active-scale, 1));
    will-change: transform;
  `,

  optionConfig: {
    scale: {
      type: 'range',
      label: 'Active Scale',
      default: 1.02,
      min: 1,
      max: 1.2,
      step: 0.01
    }
  }
}

// Auto-register on module load
registerBehaviour(interactionToggle)

export default interactionToggle
