/**
 * wipe-right transition.
 * Reveals content right-to-left using clip-path.
 *
 * Content starts hidden on left side, reveals toward right.
 * Used for modals where thumbnail is on the right side.
 */

import type { Transition } from './types'
import { registerTransition } from './registry'

const wipeRight: Transition = {
  id: 'wipe-right',
  name: 'Wipe Right',

  defaults: {
    duration: 0.8,
    ease: 'power3.inOut',
  },

  getInitialState: () => ({
    clipPath: 'inset(0 0 0 100%)',
    visibility: 'visible',
  }),

  getFinalState: () => ({
    clipPath: 'inset(0% 0% 0% 0%)',
  }),
}

// Auto-register on module load
registerTransition(wipeRight)

export default wipeRight
