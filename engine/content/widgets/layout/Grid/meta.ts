/**
 * Grid layout widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { GridProps } from './types'

export const meta = defineMeta<GridProps>({
  id: 'Grid',
  name: 'Grid',
  description: '2D grid layout using CSS Grid',
  category: 'layout',
  icon: 'grid',
  tags: ['container', 'layout', 'grid', 'responsive'],
  component: true,

  settings: {
    columns: {
      type: 'number',
      label: 'Columns',
      default: 2,
      description: 'Number of columns (or CSS grid-template-columns)',
      min: 1,
      max: 12,
      step: 1,
    },
    rows: {
      type: 'text',
      label: 'Rows',
      default: 'auto',
      description: 'Number of rows or CSS grid-template-rows',
      advanced: true,
    },
    gap: {
      type: 'spacing',
      label: 'Gap',
      default: 0,
      description: 'Space between grid items',
    },
    columnGap: {
      type: 'spacing',
      label: 'Column Gap',
      default: '',
      description: 'Override gap for columns only',
      advanced: true,
    },
    rowGap: {
      type: 'spacing',
      label: 'Row Gap',
      default: '',
      description: 'Override gap for rows only',
      advanced: true,
    },
  },
})
