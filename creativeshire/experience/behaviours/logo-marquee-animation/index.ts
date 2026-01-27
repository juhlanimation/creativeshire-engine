/**
 * logo-marquee-animation behaviour - continuous horizontal scroll for logos.
 * Note: CSS animation handles the actual scroll, this provides variable hooks.
 */

import type { Behaviour } from '../types'
import { registerBehaviour } from '../registry'

const logoMarqueeAnimation: Behaviour = {
  id: 'logo-marquee-animation',
  name: 'Logo Marquee Animation',
  requires: ['prefersReducedMotion'],

  compute: (state, options) => {
    // Respect reduced motion preference - pause animation
    if (state.prefersReducedMotion) {
      return {
        '--marquee-play-state': 'paused',
        '--marquee-duration': '30s'
      }
    }

    const speed = (options?.speed as number) ?? 30

    return {
      '--marquee-play-state': 'running',
      '--marquee-duration': `${speed}s`
    }
  },

  cssTemplate: `
    animation-play-state: var(--marquee-play-state, running);
    animation-duration: var(--marquee-duration, 30s);
  `,

  optionConfig: {
    speed: {
      type: 'range',
      label: 'Animation Speed (seconds)',
      default: 30,
      min: 10,
      max: 60,
      step: 5
    }
  }
}

// Auto-register on module load
registerBehaviour(logoMarqueeAnimation)

export default logoMarqueeAnimation
