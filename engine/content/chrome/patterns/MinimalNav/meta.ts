/**
 * MinimalNav chrome pattern metadata for platform UI.
 */

import { defineChromeMeta } from '../../../../schema/meta'
import type { MinimalNavProps } from './types'

export const meta = defineChromeMeta<MinimalNavProps>({
  id: 'MinimalNav',
  name: 'Minimal Navigation',
  description: 'Right-aligned header with nav links, divider, and contact email',
  category: 'chrome-pattern',
  chromeSlot: 'header',
  icon: 'header',
  tags: ['chrome', 'header', 'navigation', 'minimal'],
  component: false,

  settings: {
    navLinks: {
      type: 'custom',
      label: 'Navigation Links',
      default: [],
      description: 'Links displayed in the header navigation',
      group: 'Navigation',
      bindable: true,
    },
    email: {
      type: 'text',
      label: 'Contact Email',
      default: '',
      description: 'Contact email displayed in the header',
      validation: { maxLength: 320, pattern: '^[^@]+@[^@]+\\.[^@]+$', message: 'Please enter a valid email address' },
      group: 'Contact',
      bindable: true,
    },
    blendMode: {
      type: 'select',
      label: 'Blend Mode',
      default: 'normal',
      choices: [
        { value: 'normal', label: 'Normal' },
        { value: 'difference', label: 'Difference' },
      ],
      description: 'Mix-blend-mode for automatic contrast against backgrounds',
      group: 'Style',
    },
    linkHoverStyle: {
      type: 'select',
      label: 'Link Hover Style',
      default: 'opacity',
      choices: [
        { value: 'opacity', label: 'Opacity Fade' },
        { value: 'underline', label: 'Underline' },
      ],
      description: 'Hover effect for navigation links',
      group: 'Style',
    },
  },
})
