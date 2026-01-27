/**
 * scroll-background-slideshow behaviour - cycle background images on scroll.
 */

import type { Behaviour } from '../types'
import { registerBehaviour } from '../registry'

const scrollBackgroundSlideshow: Behaviour = {
  id: 'scroll-background-slideshow',
  name: 'Scroll Background Slideshow',
  requires: ['scrollProgress', 'prefersReducedMotion'],

  compute: (state, options) => {
    const progress = (state.scrollProgress as number) ?? 0
    const imageCount = (options?.imageCount as number) ?? 5

    // Respect reduced motion preference - show first image only
    if (state.prefersReducedMotion) {
      return {
        '--bg-index': 0,
        '--bg-opacity': 1
      }
    }

    // Map scroll progress to image index
    // Only cycle through images in first 20% of page scroll
    const heroProgress = Math.min(1, progress * 5)
    const imageIndex = Math.floor(heroProgress * imageCount) % imageCount

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
    }
  }
}

// Auto-register on module load
registerBehaviour(scrollBackgroundSlideshow)

export default scrollBackgroundSlideshow
