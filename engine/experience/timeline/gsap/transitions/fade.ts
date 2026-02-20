/**
 * fade transition.
 * Simple opacity fade in/out.
 *
 * Unlike wipe transitions, fade doesn't use clip-path.
 * Used for backdrops and simple overlays.
 */

import type { Transition } from './types'
import { registerTransition } from './registry'

const fade: Transition = {
  id: 'fade',
  name: 'Fade',

  defaults: {
    duration: 0.3,
    ease: 'power2.inOut',
  },

  getInitialState: () => ({
    opacity: 0,
    visibility: 'visible',
  }),

  getFinalState: () => ({
    opacity: 1,
  }),

  // CSS mode for simple cases
  css: {
    effect: 'fade-reveal',
    hiddenClass: 'is-hidden',
    visibleClass: 'is-visible',
  },
}

// Auto-register on module load
registerTransition(fade)

export default fade
