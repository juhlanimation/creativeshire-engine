/**
 * scroll/color-shift behaviour - text color changes based on scroll position.
 *
 * Generic behaviour for color transitions driven by scroll progress.
 * Uses same scroll-to-index calculation as scroll/image-cycle for coordination.
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
  requires: ['scrollProgress', 'prefersReducedMotion'],

  compute: (state, options) => {
    // Allow custom color palette via options
    const colorPalette = (options?.colorPalette as string[]) ?? DEFAULT_COLOR_PALETTE
    const cycleRange = (options?.cycleRange as number) ?? 0.2

    // Respect reduced motion preference - use first color (no animation)
    if (state.prefersReducedMotion) {
      return {
        '--text-color': colorPalette[0] ?? 'rgb(255, 255, 255)',
        '--color-index': 0
      }
    }

    // Calculate color index from scroll progress (same logic as image-cycle)
    const progress = (state.scrollProgress as number) ?? 0
    const rangeProgress = Math.min(1, progress / cycleRange)
    const colorIndex = Math.floor(rangeProgress * colorPalette.length) % colorPalette.length

    // Get color from palette (or default to white)
    const color = colorPalette[colorIndex] ?? 'rgb(255, 255, 255)'

    return {
      '--text-color': color,
      '--color-index': colorIndex
    }
  },

  cssTemplate: `
    color: var(--text-color, rgb(255, 255, 255));
    transition: color 0.3s ease;
    will-change: color;
  `,

  optionConfig: {
    cycleRange: {
      type: 'range',
      label: 'Cycle Range (0-1)',
      default: 0.2,
      min: 0.1,
      max: 1,
      step: 0.1
    }
  }
  // Note: colorPalette is passed via options programmatically
  // UI configuration not supported for array types
}

// Auto-register on module load
registerBehaviour(scrollColorShift)

export default scrollColorShift
