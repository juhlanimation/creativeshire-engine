/**
 * CursorTracker chrome pattern metadata for platform UI.
 */

import { defineChromeMeta } from '../../../../schema/meta'
import type { CursorTrackerProps } from './types'

export const meta = defineChromeMeta<CursorTrackerProps>({
  id: 'CursorTracker',
  name: 'Cursor Tracker',
  description: 'Custom cursor label that follows the mouse over target elements',
  category: 'chrome-pattern',
  chromeSlot: null,
  icon: 'cursor',
  tags: ['chrome', 'cursor', 'overlay', 'interactive'],
  component: false,
  providesActions: ['{key}.show', '{key}.hide'],

  settings: {
    label: {
      type: 'text',
      label: 'Cursor Label',
      default: 'View',
      description: 'Text displayed on the custom cursor',
      validation: { maxLength: 50 },
      group: 'Content',
      bindable: true,
    },
    offsetX: {
      type: 'number',
      label: 'X Offset',
      default: 24,
      description: 'Horizontal offset from cursor in pixels',
      min: 0,
      max: 100,
      group: 'Position',
      advanced: true,
    },
    offsetY: {
      type: 'number',
      label: 'Y Offset',
      default: 8,
      description: 'Vertical offset from cursor in pixels',
      min: 0,
      max: 100,
      group: 'Position',
      advanced: true,
    },
    targetSelector: {
      type: 'text',
      label: 'Target Selector',
      default: '',
      description: 'CSS selector for native DOM elements (e.g. ".text-widget a")',
      validation: { maxLength: 200 },
      group: 'Targeting',
      advanced: true,
    },
  },
})
