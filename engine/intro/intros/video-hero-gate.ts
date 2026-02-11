/**
 * Video Hero Gate intro.
 *
 * Locks scroll and hides chrome until a hero video reaches a target playback time.
 * Content remains visible during the gate (the video IS the intro).
 * Reveal is near-instant (~50ms) to match direct-set behavior.
 *
 * Uses the video-gate pattern with contentVisible: true.
 */

import { registerIntro } from '../registry'
import type { IntroMeta, IntroConfig } from '../types'

const meta: IntroMeta = {
  id: 'video-hero-gate',
  name: 'Video Hero Gate',
  description: 'Locks scroll and hides chrome until hero video reaches a target time, then reveals instantly',
  icon: '🎬',
  category: 'gate',
  settings: {
    targetTime: {
      type: 'number',
      label: 'Target Time',
      default: 3,
      description: 'Video playback time (seconds) that triggers the reveal',
    },
    revealDuration: {
      type: 'number',
      label: 'Reveal Duration',
      default: 50,
      description: 'Duration of reveal transition (ms). Use ~50 for instant.',
    },
    contentVisible: {
      type: 'toggle',
      label: 'Content Visible During Intro',
      default: true,
      description: 'Keep site content visible during intro (video IS the intro)',
    },
  },
}

const config: IntroConfig = {
  pattern: 'video-gate',
  settings: {
    targetTime: 3,
    revealDuration: 50,
    contentVisible: true,
  },
}

registerIntro(meta, config)

export { meta, config }
