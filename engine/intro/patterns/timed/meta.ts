/**
 * Timed pattern metadata.
 */

import type { SettingsConfig } from '../../../schema/settings'
import { defineIntroPatternMeta } from '../../registry'

export interface TimedSettings {
  /** Duration to wait before reveal (ms) */
  duration: number
  /** Reveal animation duration (ms) */
  revealDuration: number
}

export const meta = defineIntroPatternMeta<TimedSettings>({
  id: 'timed',
  name: 'Timed',
  description: 'Locks scroll for a fixed duration, then reveals content',
  icon: 'clock',
  tags: ['timer', 'gate', 'delay', 'wait'],
  category: 'gate',
  settings: {
    duration: {
      type: 'number',
      label: 'Duration',
      description: 'Time to wait before revealing content (ms)',
      default: 2000,
      validation: { min: 500, max: 10000 },
    },
    revealDuration: {
      type: 'number',
      label: 'Reveal Duration',
      description: 'Duration of content reveal animation (ms)',
      default: 800,
      validation: { min: 200, max: 2000 },
    },
  } satisfies SettingsConfig<TimedSettings>,
})
