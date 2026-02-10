/**
 * Sequence-timed pattern metadata.
 */

import type { SettingsConfig } from '../../../schema/settings'
import { defineIntroPatternMeta } from '../../registry'

export interface SequenceTimedSettings {
  /** Step configurations for the sequence */
  steps: unknown[]
  /** Reveal animation duration after sequence completes (ms) */
  revealDuration: number
}

export const meta = defineIntroPatternMeta<SequenceTimedSettings>({
  id: 'sequence-timed',
  name: 'Sequence Timed',
  description: 'Multi-step timed sequence with precise per-step control',
  icon: 'list-ordered',
  tags: ['sequence', 'steps', 'timed', 'multi-step'],
  category: 'sequence',
  settings: {
    steps: {
      type: 'custom',
      label: 'Steps',
      description: 'Sequence steps with timing and actions',
      default: [],
    },
    revealDuration: {
      type: 'number',
      label: 'Reveal Duration',
      description: 'Duration of content reveal after sequence completes (ms)',
      default: 800,
      min: 200,
      max: 2000,
    },
  } satisfies SettingsConfig<SequenceTimedSettings>,
})
