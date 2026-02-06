/**
 * Video-gate pattern metadata.
 */

import type { SettingsConfig } from '../../../schema/settings'
import { defineIntroPatternMeta } from '../../registry'

export interface VideoGateSettings {
  /** Target video time to trigger reveal (seconds) */
  targetTime: number
  /** Frames per second for precision */
  fps: number
  /** Reveal animation duration (ms) */
  revealDuration: number
}

export const meta = defineIntroPatternMeta<VideoGateSettings>({
  id: 'video-gate',
  name: 'Video Gate',
  description: 'Locks scroll until video reaches a specific time, then reveals content',
  icon: 'play-circle',
  tags: ['video', 'gate', 'lock', 'playback'],
  category: 'gate',
  settings: {
    targetTime: {
      type: 'number',
      label: 'Target Time',
      description: 'Video time in seconds when intro completes',
      default: 3,
      validation: { min: 0.5, max: 30 },
    },
    fps: {
      type: 'number',
      label: 'FPS',
      description: 'Video frames per second for timing precision',
      default: 30,
      validation: { min: 24, max: 60 },
    },
    revealDuration: {
      type: 'number',
      label: 'Reveal Duration',
      description: 'Duration of content reveal animation (ms)',
      default: 800,
      validation: { min: 200, max: 2000 },
    },
  } satisfies SettingsConfig<VideoGateSettings>,
})
