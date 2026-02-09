import { defineBehaviourMeta } from '../../registry'
import type { ScrollProgressSettings } from './index'

export const meta = defineBehaviourMeta<ScrollProgressSettings>({
  id: 'scroll/progress',
  name: 'Scroll Progress',
  description: 'Fades element based on scroll progress position',
  icon: 'trending-up',
  tags: ['scroll', 'progress', 'opacity'],
  category: 'scroll',
  settings: {
    fadeEnd: {
      type: 'range',
      label: 'Fade End Point',
      default: 0.1,
      min: 0.05,
      max: 0.3,
      step: 0.01,
    },
  },
})
