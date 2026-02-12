/**
 * Metadata for scroll/cover-progress behaviour.
 * Tracks how much the next section covers (overlaps) the current section.
 */

import { defineBehaviourMeta } from '../../registry'
import type { CoverProgressSettings } from './index'

export const meta = defineBehaviourMeta<CoverProgressSettings>({
  id: 'scroll/cover-progress',
  name: 'Cover Progress',
  description: 'Tracks how much the next section covers this section as it scrolls over',
  icon: 'layers',
  tags: ['scroll', 'cover', 'progress', 'overlap'],
  category: 'scroll',
  settings: {
    propagateToRoot: {
      type: 'text',
      label: 'Root CSS Variable',
      default: '',
      validation: { maxLength: 64 },
    },
    propagateContentEdge: {
      type: 'text',
      label: 'Content Edge CSS Variable',
      default: '',
      validation: { maxLength: 64 },
    },
    targetSelector: {
      type: 'text',
      label: 'Target Element Selector',
      default: '',
      validation: { maxLength: 128 },
    },
    targetTop: {
      type: 'range',
      label: 'Target Top (fallback)',
      default: 0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    targetBottom: {
      type: 'range',
      label: 'Target Bottom (fallback)',
      default: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
  },
})
