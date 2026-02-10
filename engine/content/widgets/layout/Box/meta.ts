/**
 * Box layout widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { BoxProps } from './types'

export const meta = defineMeta<BoxProps>({
  id: 'Box',
  name: 'Box',
  description: 'Generic container for applying sizing and flex properties',
  category: 'layout',
  icon: 'box',
  tags: ['container', 'layout', 'sizing'],
  component: true,

  settings: {
    width: {
      type: 'text',
      label: 'Width',
      default: 'auto',
      description: 'Width (px number or CSS value like 50%, auto)',
      group: 'Size',
      bindable: true,
      validation: { maxLength: 50 },
    },
    height: {
      type: 'text',
      label: 'Height',
      default: 'auto',
      description: 'Height (px number or CSS value)',
      group: 'Size',
      bindable: true,
      validation: { maxLength: 50 },
    },
    minWidth: {
      type: 'text',
      label: 'Min Width',
      default: '',
      description: 'Minimum width constraint',
      group: 'Size',
      advanced: true,
      bindable: true,
      validation: { maxLength: 50 },
    },
    maxWidth: {
      type: 'text',
      label: 'Max Width',
      default: '',
      description: 'Maximum width constraint',
      group: 'Size',
      advanced: true,
      bindable: true,
      validation: { maxLength: 50 },
    },
    flexGrow: {
      type: 'number',
      label: 'Flex Grow',
      default: 0,
      description: 'Flex grow factor',
      min: 0,
      max: 10,
      step: 1,
      group: 'Flex',
      advanced: true,
      bindable: true,
    },
    flexShrink: {
      type: 'number',
      label: 'Flex Shrink',
      default: 1,
      description: 'Flex shrink factor',
      min: 0,
      max: 10,
      step: 1,
      group: 'Flex',
      advanced: true,
      bindable: true,
    },
  },
})
