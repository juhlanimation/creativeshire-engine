/**
 * Port-12 preset site-level defaults.
 * Video-gate intro locks scroll until hero video reaches text reveal time.
 */

import type { PresetExperienceConfig } from '../types'
import type { IntroConfig } from '../../intro/types'

/** No experience — simple smooth-scroll single-page site */
export const experienceConfig: PresetExperienceConfig | undefined = undefined

/** Video-gate intro — locks scroll + hides chrome until video reaches 3.2s */
export const introConfig: IntroConfig | undefined = {
  pattern: 'video-gate',
  settings: {
    targetTime: 3.2,        // frame 80/25fps (from original lib/config.ts)
    revealDuration: 50,     // ~3 frames — effectively instant
    contentVisible: true,   // Video visible during intro (it IS the intro)
  },
}
