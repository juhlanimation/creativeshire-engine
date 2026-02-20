/**
 * ExpandRowImageRepeater widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { ExpandRowImageRepeaterProps } from './types'

export const meta = defineMeta<ExpandRowImageRepeaterProps>({
  id: 'ExpandRowImageRepeater',
  name: 'Expand Row Image Repeater',
  description: 'Horizontal row of expandable thumbnails with coordinated hover',
  category: 'repeater',
  icon: 'gallery',
  tags: ['gallery', 'portfolio', 'interactive', 'expand'],
  component: true,

  settings: {
    height: {
      type: 'text',
      label: 'Row Height',
      default: '32rem',
      description: 'Height of the gallery row',
      validation: { maxLength: 50 },
      bindable: true,
    },
    gap: {
      type: 'spacing',
      label: 'Gap',
      default: '4px',
      description: 'Space between thumbnails',
      validation: { min: 0, max: 500 },
      bindable: true,
    },
    expandedWidth: {
      type: 'text',
      label: 'Expanded Width',
      default: '32rem',
      description: 'Width of expanded thumbnail',
      validation: { maxLength: 50 },
      advanced: true,
      bindable: true,
    },
    transitionDuration: {
      type: 'number',
      label: 'Transition Duration',
      default: 400,
      description: 'Animation duration in milliseconds',
      min: 0,
      max: 2000,
      step: 50,
      advanced: true,
      bindable: true,
    },
    cursorLabel: {
      type: 'text',
      label: 'Cursor Label',
      default: 'WATCH',
      description: 'Text shown on cursor when hovering',
      validation: { maxLength: 100 },
      bindable: true,
    },
  },
})
