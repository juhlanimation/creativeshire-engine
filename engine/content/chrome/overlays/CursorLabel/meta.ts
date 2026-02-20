/**
 * CursorLabel overlay metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { CursorLabelProps } from './types'

export const meta = defineMeta<CursorLabelProps>({
  id: 'CursorLabel',
  name: 'Cursor Label',
  description: 'Shows label text near cursor when hovering target elements',
  category: 'overlay',
  icon: 'cursor',
  tags: ['chrome', 'overlay', 'cursor', 'hover'],
  component: true,

  settings: {
    label: {
      type: 'text',
      label: 'Label Text',
      default: 'ENTER',
      description: 'Text to display near cursor',
      validation: { maxLength: 100 },
    },
    offsetX: {
      type: 'number',
      label: 'X Offset',
      default: 24,
      description: 'Horizontal offset from cursor in pixels',
      min: -500,
      max: 500,
      advanced: true,
    },
    offsetY: {
      type: 'number',
      label: 'Y Offset',
      default: 8,
      description: 'Vertical offset from cursor in pixels',
      min: -500,
      max: 500,
      advanced: true,
    },
    targetSelector: {
      type: 'text',
      label: 'Target Selector',
      default: '',
      description: 'CSS selector for native DOM elements (e.g. ".text-widget a")',
      validation: { maxLength: 200 },
      advanced: true,
    },
  },
})
