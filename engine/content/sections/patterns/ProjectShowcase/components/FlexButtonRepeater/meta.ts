/**
 * FlexButtonRepeater repeater widget metadata for platform UI.
 */

import { defineMeta } from '../../../../../../schema/meta'
import type { FlexButtonRepeaterProps } from './types'

export const meta = defineMeta<FlexButtonRepeaterProps>({
  id: 'FlexButtonRepeater',
  name: 'Flex Button Repeater',
  description: 'Extracts labeled items from button children and renders an IndexNav',
  category: 'repeater',
  icon: 'list',
  tags: ['navigation', 'index', 'button', 'repeater'],
  component: true,

  settings: {
    activeIndex: {
      type: 'number',
      label: 'Active Index',
      default: 0,
      description: 'Currently active item index',
      min: 0,
      max: 1000,
    },
    prefix: {
      type: 'text',
      label: 'Prefix',
      default: '',
      description: 'Label prefix displayed before buttons',
      validation: { maxLength: 100 },
    },
    direction: {
      type: 'select',
      label: 'Direction',
      default: 'row',
      choices: [
        { value: 'row', label: 'Row' },
        { value: 'column', label: 'Column' },
      ],
      description: 'Layout direction',
    },
  },
})
