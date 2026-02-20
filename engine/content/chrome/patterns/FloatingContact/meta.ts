/**
 * FloatingContact chrome pattern metadata for platform UI.
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
    label: {
      type: 'text',
      label: 'Label',
      default: '',
      description: 'Text displayed on the contact prompt',
      validation: { maxLength: 200 },
      group: 'Content',
      bindable: true,
    },
    email: {
      type: 'text',
      label: 'Contact Email',
      default: '',
      description: 'Email address for the contact prompt',
      validation: { maxLength: 320, pattern: '^[^@]+@[^@]+\\.[^@]+$', message: 'Please enter a valid email address' },
      group: 'Content',
      bindable: true,
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
