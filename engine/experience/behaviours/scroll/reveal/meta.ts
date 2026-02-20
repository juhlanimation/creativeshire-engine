/**
 * Metadata for scroll/reveal behaviour.
 * Fades element in based on a propagated scroll progress variable.
 */

import { defineBehaviourMeta } from '../../registry'
import type { ScrollRevealSettings } from './index'

export const meta = defineBehaviourMeta<ScrollRevealSettings>({
  id: 'scroll/reveal',
  name: 'Scroll Reveal',
  description: 'Fades element in based on a propagated scroll progress variable',
  icon: 'eye',
  tags: ['scroll', 'reveal', 'opacity', 'chrome'],
  category: 'scroll',
  settings: {
    sourceVar: {
      type: 'text',
      label: 'Source CSS Variable',
      default: '--cover-progress',
      description: 'CSS variable on document root to read progress from (0-100)',
      validation: { maxLength: 64 },
    },
    sourceMax: {
      type: 'number',
      label: 'Source Max Value',
      default: 100,
      description: 'Maximum value of the source variable (for normalization)',
      min: 1,
      max: 1000,
    },
  },
})
