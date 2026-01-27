/**
 * project-card-hover behaviour - hover effects on project card thumbnails.
 * Note: CSS-only hover effects are preferred, but this provides variable hooks.
 */

import type { Behaviour } from '../types'
import { registerBehaviour } from '../registry'

const projectCardHover: Behaviour = {
  id: 'project-card-hover',
  name: 'Project Card Hover',
  requires: ['prefersReducedMotion'],

  compute: (state, options) => {
    // Hover state is tracked via JS (for touch devices) or CSS :hover
    const isHovered = (state.isHovered as boolean) ?? false
    const scale = (options?.scale as number) ?? 1.03

    // Respect reduced motion preference
    if (state.prefersReducedMotion) {
      return {
        '--card-scale': 1,
        '--overlay-opacity': 0.1
      }
    }

    return {
      '--card-scale': isHovered ? scale : 1,
      '--overlay-opacity': isHovered ? 0.3 : 0.1
    }
  },

  cssTemplate: `
    transform: scale(var(--card-scale, 1));
    will-change: transform;
  `,

  optionConfig: {
    scale: {
      type: 'range',
      label: 'Hover Scale',
      default: 1.03,
      min: 1,
      max: 1.1,
      step: 0.01
    }
  }
}

// Auto-register on module load
registerBehaviour(projectCardHover)

export default projectCardHover
