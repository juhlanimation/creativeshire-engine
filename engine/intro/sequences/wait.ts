/**
 * Wait — simple timed gate with no overlay.
 * Locks scroll for a duration, then reveals instantly.
 */

import type { IntroConfig, IntroMeta } from '../types'
import { registerIntroSequence } from '../registry'

export const meta: IntroMeta = {
  id: 'wait',
  name: 'Wait',
  description: 'Simple timed delay before content reveals',
  icon: '⏳',
  category: 'gate',
  settings: {
    duration: { type: 'number', label: 'Duration', default: 2000, min: 0, step: 100, description: 'Wait time before reveal (ms)' },
    revealDuration: { type: 'number', label: 'Reveal Duration', default: 50, min: 0, description: 'Reveal animation duration (ms)' },
  },
}

export const config: IntroConfig = {
  pattern: 'timed',
  settings: {
    duration: 2000,
    revealDuration: 50,
  },
}

registerIntroSequence(meta, config)
