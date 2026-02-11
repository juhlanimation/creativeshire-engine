/**
 * Port-12 preset site-level defaults.
 * Video-gate intro locks scroll until showreel reaches frame 80 (3.2s at 25fps).
 * Matches port12.dk hero timing: text + navbar + scroll all appear together
 * when video.currentTime >= 3.2s.
 */

import type { PresetExperienceConfig } from '../types'
import type { IntroConfig } from '../../intro/types'

/** Cover scroll — hero stays fixed, content scrolls over it */
export const experienceConfig: PresetExperienceConfig | undefined = { id: 'cover-scroll' }

/** Video-gate intro — locks scroll until showreel reaches frame 80/25fps = 3.2s */
export const introConfig: IntroConfig | undefined = {
  pattern: 'video-gate',
  settings: {
    targetTime: 3.2,        // frame 80/25fps (from original lib/config.ts heroAnimation)
    revealDuration: 50,     // ~3 frames — effectively instant (matches gsap.set behavior)
    contentVisible: true,   // Content visible during gate (video IS the intro)
  },
}
