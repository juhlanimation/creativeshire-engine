/**
 * scroll/color-shift behaviour - text color changes based on scroll state.
 *
 * Generic behaviour for color transitions driven by scroll position.
 * Works in conjunction with scroll/image-cycle for coordinated effects.
 */

import type { Behaviour } from '../types'
import { registerBehaviour } from '../registry'

// Default color palette mapped to scroll states
const DEFAULT_COLOR_PALETTE = [
  'rgb(153, 51, 255)',  // Purple - for light backgrounds
  'rgb(0, 255, 255)',   // Cyan - for orange backgrounds
  'rgb(255, 255, 255)', // White - for dark backgrounds
  'rgb(153, 51, 255)',  // Purple
  'rgb(255, 255, 255)'  // White
]

const scrollColorShift: Behaviour = {
  id: 'scroll/color-shift',
  name: 'Scroll Color Shift',
  requires: ['--bg-index', 'prefersReducedMotion'],

  compute: (state, options) => {
    // Get current index from state (set by scroll/image-cycle or similar)
    const currentIndex = (state['--bg-index'] as number) ?? 0

    // Allow custom color palette via options
    const colorPalette = (options?.colorPalette as string[]) ?? DEFAULT_COLOR_PALETTE

    // Respect reduced motion preference - use default color
    if (state.prefersReducedMotion) {
      return {
        '--text-color': 'rgb(255, 255, 255)'
      }
    }

    // Get color from palette (or default to white)
    const color = colorPalette[currentIndex] ?? 'rgb(255, 255, 255)'

    return {
      '--text-color': color
    }
  },

  cssTemplate: `
    color: var(--text-color, rgb(255, 255, 255));
    transition: color 0.3s ease;
    will-change: color;
  `,

  // Note: colorPalette is passed via options programmatically
  // UI configuration not supported for array types
}

// Auto-register on module load
registerBehaviour(scrollColorShift)

export default scrollColorShift
