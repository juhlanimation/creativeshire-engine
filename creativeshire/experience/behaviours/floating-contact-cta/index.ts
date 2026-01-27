/**
 * floating-contact-cta behaviour - hover/interaction effects for floating contact.
 */

import type { Behaviour } from '../types'
import { registerBehaviour } from '../registry'

const floatingContactCta: Behaviour = {
  id: 'floating-contact-cta',
  name: 'Floating Contact CTA',
  requires: ['prefersReducedMotion'],

  compute: (state, options) => {
    const isHovered = (state.isHovered as boolean) ?? false
    const isPressed = (state.isPressed as boolean) ?? false

    // Respect reduced motion preference
    if (state.prefersReducedMotion) {
      return {
        '--cta-scale': 1,
        '--cta-shadow': '0 2px 8px rgba(153, 51, 255, 0.2)'
      }
    }

    const hoverScale = (options?.hoverScale as number) ?? 1.02
    const pressScale = (options?.pressScale as number) ?? 0.98

    let scale = 1
    if (isPressed) {
      scale = pressScale
    } else if (isHovered) {
      scale = hoverScale
    }

    const shadow = isHovered
      ? '0 4px 12px rgba(153, 51, 255, 0.3)'
      : '0 2px 8px rgba(153, 51, 255, 0.2)'

    return {
      '--cta-scale': scale,
      '--cta-shadow': shadow
    }
  },

  cssTemplate: `
    transform: scale(var(--cta-scale, 1));
    box-shadow: var(--cta-shadow, 0 2px 8px rgba(153, 51, 255, 0.2));
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    will-change: transform, box-shadow;
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
registerBehaviour(floatingContactCta)

export default floatingContactCta
