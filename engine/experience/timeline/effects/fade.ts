/**
 * fade effect primitive.
 * Simple opacity fade in/out.
 *
 * Unlike wipe effects, fade doesn't use clip-path.
 * Used for backdrops and simple overlays.
 *
 * Supports both GSAP and CSS realizations.
 */

import type { EffectPrimitive } from './types'
import { registerEffect } from './registry'

const fade: EffectPrimitive = {
  id: 'fade',
  name: 'Fade',

  defaults: {
    duration: 0.3,
    ease: 'power2.inOut',
  },

  gsap: {
    getInitialState: () => ({
      opacity: 0,
      visibility: 'visible',
    }),

    getFinalState: () => ({
      opacity: 1,
    }),
  },

  css: {
    forwardClass: 'fade-reveal--forward',
    reverseClass: 'fade-reveal--reverse',
    effect: 'fade-reveal',
  },
}

// Auto-register on module load
registerEffect(fade)

export default fade
