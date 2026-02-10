/**
 * Flex layout widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { FlexProps } from './types'

export const meta = defineMeta<FlexProps>({
  id: 'Flex',
  name: 'Flex',
  description: 'Flexible container using CSS flexbox for arranging children',
  category: 'layout',
  icon: 'flex',
  tags: ['container', 'layout', 'flexbox', 'responsive'],
  component: true,

  settings: {
    direction: {
      type: 'select',
      label: 'Direction',
      default: 'row',
      description: 'Main axis direction for children',
      choices: [
        { value: 'row', label: 'Row (Horizontal)' },
        { value: 'column', label: 'Column (Vertical)' },
      ],
      bindable: true,
    },
    align: {
      type: 'alignment',
      label: 'Align Items',
      default: 'stretch',
      description: 'Alignment along the cross axis',
      choices: [
        { value: 'start', label: 'Start' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'End' },
        { value: 'stretch', label: 'Stretch' },
      ],
      bindable: true,
    },
    justify: {
      type: 'select',
      label: 'Justify Content',
      default: 'start',
      description: 'Distribution along the main axis',
      choices: [
        { value: 'start', label: 'Start' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'End' },
        { value: 'between', label: 'Space Between' },
        { value: 'around', label: 'Space Around' },
      ],
      bindable: true,
    },
    wrap: {
      type: 'toggle',
      label: 'Wrap',
      default: false,
      description: 'Allow items to wrap to new lines',
      bindable: true,
    },
    gap: {
      type: 'spacing',
      label: 'Gap',
      default: 0,
      description: 'Space between child items',
      bindable: true,
      validation: { min: 0, max: 500 },
    },
  },
})
