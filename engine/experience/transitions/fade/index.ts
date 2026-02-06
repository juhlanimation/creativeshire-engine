/**
 * Fade page transition.
 * Smooth black overlay fade between pages.
 */

import type { PageTransition } from '../types'
import { registerPageTransition } from '../registry'
import { meta } from './meta'

export const fadePageTransition: PageTransition = {
  ...meta,
  defaults: {
    exitDuration: 400,
    entryDuration: 400,
    timeout: 2000,
  },
  respectReducedMotion: true,
  exitClass: 'page-transition--exiting',
  entryClass: 'page-transition--entering',
}

// Auto-register on module load
registerPageTransition(fadePageTransition)
