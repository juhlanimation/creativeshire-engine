/**
 * Scroll-reveal pattern metadata.
 */

import type { SettingsConfig } from '../../../schema/settings'
import { defineIntroPatternMeta } from '../../registry'

export interface ScrollRevealSettings {
  /** Reveal animation duration (ms) */
  revealDuration: number
  /** Delay before starting reveal on scroll (ms) */
  scrollDelay: number
}

export const meta = defineIntroPatternMeta<ScrollRevealSettings>({
  id: 'scroll-reveal',
  name: 'Scroll Reveal',
  description: 'Delays content reveal until first scroll or visibility trigger',
  icon: 'eye',
  tags: ['scroll', 'reveal', 'visibility', 'non-blocking'],
  category: 'reveal',
  settings: {
    revealDuration: {
      type: 'number',
      label: 'Reveal Duration',
      description: 'Duration of content reveal animation (ms)',
      default: 600,
      validation: { min: 200, max: 2000 },
    },
    scrollDelay: {
      type: 'number',
      label: 'Scroll Delay',
      description: 'Delay before starting reveal after scroll (ms)',
      default: 0,
      validation: { min: 0, max: 1000 },
    },
  } satisfies SettingsConfig<ScrollRevealSettings>,
})
