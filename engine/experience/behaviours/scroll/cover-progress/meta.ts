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
  },
})
