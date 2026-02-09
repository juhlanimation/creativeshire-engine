import { defineBehaviourMeta } from '../../registry'
import type { ScrollImageCycleSettings } from './index'

export const meta = defineBehaviourMeta<ScrollImageCycleSettings>({
  id: 'scroll/image-cycle',
  name: 'Scroll Image Cycle',
  description: 'Cycles through images based on scroll position',
  icon: 'images',
  tags: ['scroll', 'image', 'cycle', 'background'],
  category: 'scroll',
  settings: {
    imageCount: {
      type: 'range',
      label: 'Number of Images',
      default: 5,
      min: 2,
      max: 10,
      step: 1,
    },
    cycleRange: {
      type: 'range',
      label: 'Cycle Range (0-1)',
      default: 0.2,
      min: 0.1,
      max: 1,
      step: 0.1,
    },
  },
})
