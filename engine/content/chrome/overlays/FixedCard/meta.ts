/**
 * FixedCard overlay metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { FixedCardProps } from './types'

export const meta = defineMeta<FixedCardProps>({
  id: 'FixedCard',
  name: 'Fixed Card',
  description: 'Glassmorphic card overlay with clip-path fold animation between sections',
  category: 'overlay',
  icon: 'card',
  tags: ['chrome', 'overlay', 'card', 'glassmorphism', 'fold'],
  component: true,

  settings: {
    centerGap: {
      type: 'number',
      label: 'Center Gap',
      default: 90,
      description: 'Gap between viewport center and card edge in pixels',
      min: 0,
      max: 300,
    },
  },
})
