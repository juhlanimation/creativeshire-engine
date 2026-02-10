import { defineMeta } from '../../../../schema/meta'
import type { ShotIndicatorProps } from './types'

export const meta = defineMeta<ShotIndicatorProps>({
  id: 'ShotIndicator',
  name: 'Shot Indicator',
  description: 'Video shot/frame number navigation',
  category: 'interactive',
  icon: 'film',
  tags: ['video', 'shot', 'frame', 'navigation', 'indicator'],
  component: true,

  settings: {
    shots: {
      type: 'custom',
      label: 'Shots',
      default: [],
      description: 'Array of shot numbers',
      validation: { required: true },
      bindable: true,
    },
    activeShot: {
      type: 'number',
      label: 'Active Shot',
      default: 0,
      description: 'Currently active shot number',
      min: 0,
      max: 1000,
    },
    prefix: {
      type: 'text',
      label: 'Prefix',
      default: 'sh',
      description: 'Label prefix (e.g., "sh" for shot)',
      validation: { maxLength: 100 },
    },
    position: {
      type: 'select',
      label: 'Position',
      default: 'top-right',
      choices: [
        { value: 'top-left', label: 'Top Left' },
        { value: 'top-right', label: 'Top Right' },
        { value: 'bottom-left', label: 'Bottom Left' },
        { value: 'bottom-right', label: 'Bottom Right' }
      ],
      description: 'Position within parent',
    },
  },
})
