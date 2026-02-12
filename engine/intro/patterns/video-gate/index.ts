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
      // Selector resolved from settings.source (element-ref picker).
      // Fallback to [data-intro-video] when source is not configured.
    },
  ],

  revealDuration: 800,
  hideChrome: true,
}

// Auto-register on module load
registerIntroPattern(videoGatePattern)
