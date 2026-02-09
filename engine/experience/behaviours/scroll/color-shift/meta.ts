import { defineBehaviourMeta } from '../../registry'
import type { ScrollColorShiftSettings } from './index'

export const meta = defineBehaviourMeta<ScrollColorShiftSettings>({
  id: 'scroll/color-shift',
  name: 'Scroll Color Shift',
  description: 'Transitions text color based on scroll position',
  icon: 'palette',
  tags: ['scroll', 'color', 'transition'],
  category: 'scroll',
  settings: {
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
