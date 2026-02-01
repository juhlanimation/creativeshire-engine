/**
 * wipe-left transition.
 * Reveals content left-to-right using clip-path.
 *
 * Content starts hidden on right side, reveals toward left.
 * Used for modals where thumbnail is on the left side.
 */

import type { Transition } from './types'
import { registerTransition } from './registry'

const wipeLeft: Transition = {
  id: 'wipe-left',
  name: 'Wipe Left',

  defaults: {
    duration: 0.8,
    ease: 'power3.inOut',
  },

  getInitialState: () => ({
    clipPath: 'inset(0 100% 0 0)',
    visibility: 'visible',
  }),

  getFinalState: () => ({
    clipPath: 'inset(0% 0% 0% 0%)',
  }),
}

// Auto-register on module load
registerTransition(wipeLeft)

export default wipeLeft
