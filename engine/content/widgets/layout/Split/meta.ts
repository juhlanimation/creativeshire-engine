/**
 * Split layout widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { SplitProps } from './types'

export const meta = defineMeta<SplitProps>({
  id: 'Split',
  name: 'Split',
  description: 'Two-column split layout for hero sections, sidebars, etc.',
  category: 'layout',
  icon: 'split',
  tags: ['container', 'layout', 'columns', 'hero'],
  component: true,

  settings: {
    ratio: {
      type: 'select',
      label: 'Ratio',
      default: '1:1',
      description: 'Column width ratio',
      choices: [
        { value: '1:1', label: 'Equal (1:1)' },
        { value: '2:1', label: 'Wide Left (2:1)' },
        { value: '1:2', label: 'Wide Right (1:2)' },
        { value: '3:1', label: 'Very Wide Left (3:1)' },
        { value: '1:3', label: 'Very Wide Right (1:3)' },
        { value: '3:2', label: 'Slight Left (3:2)' },
        { value: '2:3', label: 'Slight Right (2:3)' },
      ],
      bindable: true,
    },
    gap: {
      type: 'spacing',
      label: 'Gap',
      default: 0,
      description: 'Space between columns',
      bindable: true,
      validation: { min: 0, max: 500 },
    },
    reverse: {
      type: 'toggle',
      label: 'Reverse',
      default: false,
      description: 'Swap column order (useful for responsive layouts)',
      bindable: true,
    },
    align: {
      type: 'alignment',
      label: 'Vertical Align',
      default: 'stretch',
      description: 'Vertical alignment of columns',
      choices: [
        { value: 'start', label: 'Top' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'Bottom' },
        { value: 'stretch', label: 'Stretch' },
      ],
      bindable: true,
    },
  },
})
