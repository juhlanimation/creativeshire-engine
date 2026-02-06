/**
 * Timed intro pattern.
 * Locks scroll for a fixed duration.
 */

import type { IntroPattern } from '../../types'
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
