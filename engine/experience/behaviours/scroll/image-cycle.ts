/**
 * scroll/image-cycle behaviour - cycle through images based on scroll position.
 *
 * Generic behaviour for scroll-driven image/content cycling.
 */

import type { Behaviour } from '../types'
import { registerBehaviour } from '../registry'

const scrollImageCycle: Behaviour = {
  id: 'scroll/image-cycle',
  name: 'Scroll Image Cycle',
  requires: ['scrollProgress', 'prefersReducedMotion'],

  compute: (state, options) => {
    const progress = (state.scrollProgress as number) ?? 0
    const imageCount = (options?.imageCount as number) ?? 5
    const cycleRange = (options?.cycleRange as number) ?? 0.2 // Only cycle through first 20% of scroll

    // Respect reduced motion preference - show first image only
    if (state.prefersReducedMotion) {
      return {
        '--bg-index': 0,
        '--bg-opacity': 1
      }
    }

    // Map scroll progress to image index
    // Only cycle through images in specified range of page scroll
    const rangeProgress = Math.min(1, progress / cycleRange)
    const imageIndex = Math.floor(rangeProgress * imageCount) % imageCount

    return {
      '--bg-index': imageIndex,
      '--bg-opacity': 1
    }
  },

  cssTemplate: `
    --current-bg-index: var(--bg-index, 0);
    opacity: var(--bg-opacity, 1);
    will-change: contents;
  `,

  optionConfig: {
    imageCount: {
      type: 'range',
      label: 'Number of Images',
      default: 5,
      min: 2,
      max: 10,
      step: 1
    },
    cycleRange: {
      type: 'range',
      label: 'Cycle Range (0-1)',
      default: 0.2,
      min: 0.1,
      max: 1,
      step: 0.1
    }
  }
}

// Auto-register on module load
registerBehaviour(scrollImageCycle)

export default scrollImageCycle
