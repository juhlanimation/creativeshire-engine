/**
 * hover-reveal behaviour - expand/reveal animation for HoverReveal widget.
 * Computes CSS variables from hover/press state.
 */

import type { Behaviour } from '../types'
import { registerBehaviour } from '../registry'

const hoverReveal: Behaviour = {
  id: 'hover-reveal',
  name: 'Hover Reveal',
  requires: ['prefersReducedMotion'],

  compute: (state, options) => {
    const isHovered = (state.isHovered as boolean) ?? false
    const isPressed = (state.isPressed as boolean) ?? false

    // Respect reduced motion preference
    if (state.prefersReducedMotion) {
      return {
        '--hover-reveal-opacity': isHovered ? 1 : 0,
        '--hover-reveal-icon-opacity': isHovered ? 1 : 0,
        '--hover-reveal-scale': 1
      }
    }

    // Scale feedback
    const hoverScale = (options?.hoverScale as number) ?? 1.02
    const pressScale = (options?.pressScale as number) ?? 0.98

    let scale = 1
    if (isPressed) {
      scale = pressScale
    } else if (isHovered) {
      scale = hoverScale
    }

    return {
      '--hover-reveal-opacity': isHovered ? 1 : 0,
      '--hover-reveal-icon-opacity': isHovered ? 1 : 0,
      '--hover-reveal-scale': scale
    }
  },

  cssTemplate: `
    transform: scale(var(--hover-reveal-scale, 1));
    will-change: transform;
  `,

  optionConfig: {
    hoverScale: {
      type: 'range',
      label: 'Hover Scale',
      default: 1.02,
      min: 1,
      max: 1.1,
      step: 0.01
    },
    pressScale: {
      type: 'range',
      label: 'Press Scale',
      default: 0.98,
      min: 0.9,
      max: 1,
      step: 0.01
    }
  }
}

// Auto-register on module load
registerBehaviour(hoverReveal)

export default hoverReveal
