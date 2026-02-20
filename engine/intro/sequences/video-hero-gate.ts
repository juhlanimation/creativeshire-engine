/**
 * Video Hero Gate — locks scroll until hero video reaches target frame.
 * Content remains visible during gate (video IS the intro).
 */

import type { IntroConfig, IntroMeta } from '../types'
import { registerIntroSequence } from '../registry'

export const meta: IntroMeta = {
  id: 'video-hero-gate',
  name: 'Video Hero Gate',
  description: 'Locks scroll until hero video reaches a target timestamp',
  icon: '🎬',
  category: 'gate',
  settings: {
    source: { type: 'text', label: 'Video Selector', default: '#hero-video video', description: 'CSS selector for the hero video element' },
    targetTime: { type: 'number', label: 'Target Time', default: 3.2, min: 0, step: 0.1, description: 'Video time (seconds) to trigger reveal' },
    revealDuration: { type: 'number', label: 'Reveal Duration', default: 50, min: 0, description: 'Reveal animation duration (ms)' },
    contentVisible: { type: 'toggle', label: 'Content Visible', default: true, description: 'Show content during gate (video IS the intro)' },
  },
}

export const config: IntroConfig = {
  pattern: 'video-gate',
  settings: {
    source: '#hero-video video',
    targetTime: 3.2,
    revealDuration: 50,
    contentVisible: true,
  },
}

registerIntroSequence(meta, config)
