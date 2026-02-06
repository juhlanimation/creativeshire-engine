/**
 * Sequence-timed intro pattern.
 * Multi-step timed sequence with precise per-step control.
 *
 * Each step updates CSS variables (--intro-step, --intro-step-progress)
 * that components read to control their own visibility/animation.
 */

import type { IntroPattern } from '../../types'
import { meta } from './meta'

export const sequenceTimedPattern: IntroPattern = {
  ...meta,

  triggers: [
    {
      type: 'sequence',
      options: {},
    },
  ],

  revealDuration: 800,
  hideChrome: true,
}
