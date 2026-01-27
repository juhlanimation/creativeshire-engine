/**
 * hero-text-color-transition behaviour - text color changes with background.
 * Note: This works in conjunction with scroll-background-slideshow.
 */

import type { Behaviour } from '../types'
import { registerBehaviour } from '../registry'

// Color palette mapped to background images
const COLOR_PALETTE = [
  'rgb(153, 51, 255)',  // Purple - for light backgrounds
  'rgb(0, 255, 255)',   // Cyan - for orange backgrounds
  'rgb(255, 255, 255)', // White - for dark backgrounds
  'rgb(153, 51, 255)',  // Purple
  'rgb(255, 255, 255)'  // White
]

const heroTextColorTransition: Behaviour = {
  id: 'hero-text-color-transition',
  name: 'Hero Text Color Transition',
  requires: ['prefersReducedMotion'],

  compute: (state, _options) => {
    // Get current background index from slideshow behaviour
    const bgIndex = (state['--bg-index'] as number) ?? 0

    // Respect reduced motion preference - use default color
    if (state.prefersReducedMotion) {
      return {
        '--text-color': 'rgb(255, 255, 255)'
      }
    }

    // Get color from palette (or default to white)
    const color = COLOR_PALETTE[bgIndex] ?? 'rgb(255, 255, 255)'

    return {
      '--text-color': color
    }
  },

  cssTemplate: `
    color: var(--text-color, rgb(255, 255, 255));
    transition: color 0.3s ease;
    will-change: color;
  `
}

// Auto-register on module load
registerBehaviour(heroTextColorTransition)

export default heroTextColorTransition
