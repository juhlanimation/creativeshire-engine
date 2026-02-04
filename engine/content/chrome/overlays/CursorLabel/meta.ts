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
    },
    targetSelector: {
      type: 'text',
      label: 'Target Selector',
      default: '.text-widget a',
      description: 'CSS selector for elements that trigger the label',
      advanced: true,
    },
    offsetX: {
      type: 'number',
      label: 'X Offset',
      default: 24,
      description: 'Horizontal offset from cursor in pixels',
      advanced: true,
    },
    offsetY: {
      type: 'number',
      label: 'Y Offset',
      default: 8,
      description: 'Vertical offset from cursor in pixels',
      advanced: true,
    },
  },
})
