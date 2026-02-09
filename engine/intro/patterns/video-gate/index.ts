/**
 * Video-gate intro pattern.
 * Locks scroll until video reaches target time.
 */

import type { IntroPattern } from '../../types'
import { registerIntroPattern } from '../../registry'
import { meta } from './meta'

export const videoGatePattern: IntroPattern = {
  ...meta,

  triggers: [
    {
      type: 'video-time',
      options: {
        selector: '[data-intro-video]',
      },
    },
  ],

  revealDuration: 800,
  hideChrome: true,
}

// Auto-register on module load
registerIntroPattern(videoGatePattern)
