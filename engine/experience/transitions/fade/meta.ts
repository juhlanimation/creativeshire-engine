/**
 * Fade page transition metadata.
 */

import { definePageTransitionMeta } from '../registry'

interface FadeSettings {
  exitDuration: number
  entryDuration: number
}

export const meta = definePageTransitionMeta<FadeSettings>({
  id: 'fade',
  name: 'Fade to Black',
  description: 'Smooth black overlay fade between pages.',
  icon: 'fade',
  tags: ['fade', 'opacity', 'smooth'],
  category: 'fade',
  settings: {
    exitDuration: {
      type: 'number',
      label: 'Exit Duration (ms)',
      description: 'Duration of the page exit fade animation',
      default: 400,
      validation: { min: 100, max: 2000 },
    },
    entryDuration: {
      type: 'number',
      label: 'Entry Duration (ms)',
      description: 'Duration of the page entry fade animation',
      default: 400,
      validation: { min: 100, max: 2000 },
    },
  },
})
