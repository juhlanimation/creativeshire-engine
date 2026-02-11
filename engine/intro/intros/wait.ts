/**
 * Wait intro.
 *
 * Locks scroll for a fixed duration, then unlocks.
 * No overlay, no content fade — just a timed scroll gate.
 *
 * Uses the timed pattern with contentVisible: true.
 */

import { registerIntro } from '../registry'
import type { IntroMeta, IntroConfig } from '../types'

const meta: IntroMeta = {
  id: 'wait',
  name: 'Wait',
  description: 'Locks scroll for a fixed duration, then unlocks. No visual overlay.',
  icon: '⏳',
  category: 'gate',
  settings: {
    duration: {
      type: 'number',
      label: 'Wait Duration',
      default: 2000,
      description: 'Time to lock scroll (ms)',
    },
    revealDuration: {
      type: 'number',
      label: 'Reveal Duration',
      default: 50,
      description: 'Duration of unlock transition (ms). Use ~50 for instant.',
    },
  },
}

const config: IntroConfig = {
  pattern: 'timed',
  settings: {
    duration: 2000,
    revealDuration: 50,
    contentVisible: true,
  },
}

registerIntro(meta, config)

export { meta, config }
