/**
 * Stack layout widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { StackProps } from './types'

export const meta = defineMeta<StackProps>({
  id: 'Stack',
  name: 'Stack',
  description: 'Vertical stack layout (shorthand for Flex column)',
  category: 'layout',
  icon: 'stack',
  tags: ['container', 'layout', 'vertical'],
  component: true,

  settings: {
    gap: {
      type: 'spacing',
      label: 'Gap',
      default: 'tight',
      description: 'Vertical space between items',
      bindable: true,
      validation: { min: 0, max: 500 },
    },
    gapScale: {
      type: 'number',
      label: 'Gap Scale',
      default: 1,
      description: 'Multiplier for the gap value',
      min: 0.25,
      max: 10,
      step: 0.25,
      bindable: true,
    },
    align: {
      type: 'alignment',
      label: 'Align',
      default: 'stretch',
      description: 'Horizontal alignment of items',
      choices: [
        { value: 'start', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'Right' },
        { value: 'stretch', label: 'Stretch' },
      ],
      bindable: true,
    },
  },
})
