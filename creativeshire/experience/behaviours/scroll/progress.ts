/**
 * scroll/progress behaviour - fades out element based on scroll progress.
 *
 * Generic behaviour for any scroll-progress-based opacity transitions.
 * Originally used for scroll indicators.
 */

import type { Behaviour } from '../types'
import { registerBehaviour } from '../registry'

const scrollProgress: Behaviour = {
  id: 'scroll/progress',
  name: 'Scroll Progress',
  requires: ['scrollProgress', 'prefersReducedMotion'],

  compute: (state, options) => {
    // Respect reduced motion preference
    if (state.prefersReducedMotion) {
      return {
        '--indicator-opacity': 1
      }
    }

    const progress = (state.scrollProgress as number) ?? 0
    const fadeEnd = (options?.fadeEnd as number) ?? 0.1 // Fade out by 10% scroll

    // Fade from 1 to 0 as scroll goes from 0 to fadeEnd
    const opacity = progress < fadeEnd ? 1 - (progress / fadeEnd) : 0

    return {
      '--indicator-opacity': opacity
    }
  },

  cssTemplate: `
    opacity: var(--indicator-opacity, 1);
    will-change: opacity;
  `,

  optionConfig: {
    fadeEnd: {
      type: 'range',
      label: 'Fade End Point',
      default: 0.1,
      min: 0.05,
      max: 0.3,
      step: 0.01
    }
  }
}

// Auto-register on module load
registerBehaviour(scrollProgress)

export default scrollProgress
