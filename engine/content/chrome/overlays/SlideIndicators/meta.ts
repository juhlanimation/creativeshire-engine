/**
 * SlideIndicators widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { SlideIndicatorsProps } from './types'

export const meta = defineMeta<SlideIndicatorsProps>({
  id: 'SlideIndicators',
  name: 'Slide Indicators',
  description: 'Navigation dots/lines for slideshow experience',
  category: 'overlay',
  icon: 'dots-horizontal',
  tags: ['chrome', 'overlay', 'navigation', 'slideshow'],
  component: true,

  settings: {
    position: {
      type: 'select',
      label: 'Position',
      default: 'right',
      description: 'Position of the indicators on the screen',
      choices: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
        { value: 'bottom', label: 'Bottom' },
      ],
    },
    style: {
      type: 'select',
      label: 'Style',
      default: 'dots',
      description: 'Visual style of the indicators',
      choices: [
        { value: 'dots', label: 'Dots' },
        { value: 'lines', label: 'Lines' },
        { value: 'numbers', label: 'Numbers' },
      ],
    },
  },
})
