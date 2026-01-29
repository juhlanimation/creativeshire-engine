/**
 * visibility/fade-in behaviour - fades and slides content as it enters viewport.
 *
 * Generic behaviour for IntersectionObserver-triggered fade animations.
 * Sets CSS variables for opacity and vertical offset.
 *
 * CSS Variables Output:
 * - --opacity: Element opacity (0-1)
 * - --y: Vertical offset in pixels
 */

import type { Behaviour } from '../types'
import { registerBehaviour } from '../registry'

const visibilityFadeIn: Behaviour = {
  id: 'visibility/fade-in',
  name: 'Visibility Fade In',
  requires: ['sectionVisibility', 'prefersReducedMotion'],

  compute: (state, options) => {
    // Respect reduced motion preference
    if (state.prefersReducedMotion) {
      return {
        '--opacity': 1,
        '--y': 0
      }
    }

    const visibility = (state.sectionVisibility as number) ?? 0
    const distance = (options?.distance as number) ?? 20
    const progress = Math.min(1, visibility * 1.5) // Slightly accelerated

    return {
      '--opacity': progress,
      '--y': (1 - progress) * distance
    }
  },

  cssTemplate: `
    opacity: var(--opacity, 1);
    transform: translateY(calc(var(--y, 0) * 1px));
    will-change: opacity, transform;
  `,

  optionConfig: {
    distance: {
      type: 'range',
      label: 'Slide Distance',
      default: 20,
      min: 0,
      max: 100,
      step: 5
    }
  }
}

// Auto-register on module load
registerBehaviour(visibilityFadeIn)

export default visibilityFadeIn
