/**
 * Cursor Label decorator.
 * Shows a label on cursor tracker on mouseenter, hides on mouseleave.
 */

import type { DecoratorDefinition } from '../types'
import { registerDecorator } from '../registry'

interface CursorLabelParams {
  label?: string
}

const cursorLabel: DecoratorDefinition<CursorLabelParams> = {
  id: 'cursor-label',
  name: 'Cursor Label',
  description: 'Shows a label following the cursor on hover',
  tags: ['cursor', 'hover', 'label'],
  requiredOverlays: ['CursorTracker'],
  defaultOverlayKeys: { CursorTracker: 'cursorLabel' },
  settings: {
    label: {
      type: 'text',
      label: 'Label',
      description: 'Text shown on the cursor',
      default: 'VIEW',
    },
  },
  actions: (params, keys) => ({
    mouseenter: {
      action: `${keys.CursorTracker}.show`,
      params: { label: params.label ?? 'VIEW' },
    },
    mouseleave: `${keys.CursorTracker}.hide`,
  }),
}

registerDecorator(cursorLabel)
