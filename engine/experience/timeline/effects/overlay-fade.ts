/**
 * overlay-fade effect primitive.
 * Page transition overlay that fades to/from black.
 *
 * CSS-only — wraps existing page transition CSS classes.
 * Used by PageTransitionWrapper for exit/entry animations.
 */

import type { EffectPrimitive } from './types'
import { registerEffect } from './registry'

const overlayFade: EffectPrimitive = {
  id: 'overlay-fade',
  name: 'Overlay Fade',

  defaults: {
    duration: 0.4,
    ease: 'power2.inOut',
  },

  css: {
    forwardClass: 'page-transition--exiting',
    reverseClass: 'page-transition--entering',
  },
}

// Auto-register on module load
registerEffect(overlayFade)

export default overlayFade
