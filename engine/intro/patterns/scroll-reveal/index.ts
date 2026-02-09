/**
 * Scroll-reveal intro pattern.
 * No scroll lock, reveals content on first scroll.
 */

import type { IntroPattern } from '../../types'
import { registerIntroPattern } from '../../registry'
import { meta } from './meta'

export const scrollRevealPattern: IntroPattern = {
  ...meta,

  triggers: [
    {
      type: 'scroll',
      options: {},
    },
    {
      type: 'visibility',
      options: {},
    },
  ],

  revealDuration: 600,
  hideChrome: false, // Chrome visible for scroll-reveal
}

// Auto-register on module load
registerIntroPattern(scrollRevealPattern)
