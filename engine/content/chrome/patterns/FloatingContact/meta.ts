/**
 * FloatingContact chrome pattern metadata for platform UI.
 *
 * Content fields (label, email) live in content.ts.
 */

import { defineChromeMeta } from '../../../../schema/meta'
import type { FloatingContactProps } from './types'

export const meta = defineChromeMeta<FloatingContactProps>({
  id: 'FloatingContact',
  name: 'Floating Contact',
  description: 'Floating contact prompt with flip animation and copy-to-clipboard',
  category: 'chrome-pattern',
  chromeSlot: 'header',
  icon: 'contact',
  tags: ['chrome', 'header', 'contact', 'email', 'floating'],
  component: false,

  settings: {
    hoverColor: {
      type: 'select',
      label: 'Hover Color',
      default: 'accent',
      description: 'Color the widget changes to on hover and copy confirmation',
      choices: [
        { value: 'accent', label: 'Accent' },
        { value: 'interaction', label: 'Interaction' },
        { value: 'primary', label: 'Primary' },
      ],
      group: 'Style',
    },
    blendMode: {
      type: 'select',
      label: 'Blend Mode',
      default: 'difference',
      description: 'Blend mode for overlay stacking. "difference" makes text adapt to any background.',
      choices: [
        { value: 'difference', label: 'Difference' },
        { value: 'normal', label: 'Normal' },
      ],
      group: 'Style',
    },
  },
})
