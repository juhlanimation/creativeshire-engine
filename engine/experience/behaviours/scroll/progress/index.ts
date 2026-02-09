/**
 * scroll/progress behaviour - fades out element based on scroll progress.
 *
 * Generic behaviour for any scroll-progress-based opacity transitions.
 * Originally used for scroll indicators.
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'
import { meta } from './meta'

export interface ScrollProgressSettings {
  fadeEnd: number
}

const scrollProgress: Behaviour<ScrollProgressSettings> = {
  ...meta,
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
}

// Auto-register on module load
registerBehaviour(scrollProgress)

export default scrollProgress
