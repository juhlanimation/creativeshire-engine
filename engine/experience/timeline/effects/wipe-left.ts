/**
 * wipe-left effect primitive.
 * Reveals content left-to-right using clip-path.
 *
 * Content starts hidden on right side, reveals toward left.
 * Used for modals where thumbnail is on the left side.
 */

import type { EffectPrimitive } from './types'
import { registerEffect } from './registry'

const wipeLeft: EffectPrimitive = {
  id: 'wipe-left',
  name: 'Wipe Left',

  defaults: {
    duration: 0.8,
    ease: 'power3.inOut',
  },

  gsap: {
    getInitialState: () => ({
      clipPath: 'inset(0 100% 0 0)',
      visibility: 'visible',
    }),

    getFinalState: () => ({
      clipPath: 'inset(0% 0% 0% 0%)',
    }),
  },
}

// Auto-register on module load
registerEffect(wipeLeft)

export default wipeLeft
