/**
 * Timed intro pattern.
 * Locks scroll for a fixed duration.
 */

import type { IntroPattern } from '../../types'
import { registerIntroPattern } from '../../registry'
import { meta } from './meta'

export const timedPattern: IntroPattern = {
  ...meta,

  triggers: [
    {
      type: 'timer',
      options: {},
    },
  ],

  revealDuration: 800,
  hideChrome: true,
}

// Auto-register on module load
registerIntroPattern(timedPattern)
