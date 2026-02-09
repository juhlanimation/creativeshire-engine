/**
 * EmailReveal interactive widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { EmailRevealProps } from './types'

export const meta = defineMeta<EmailRevealProps>({
  id: 'EmailReveal',
  name: 'Email Reveal',
  description: 'Hover-triggered email reveal with fold-out animation and copy-to-clipboard',
  category: 'interactive',
  icon: 'mail',
  tags: ['contact', 'email', 'interactive', 'clipboard', 'hover'],
  component: true,

  settings: {
    email: {
      type: 'text',
      label: 'Email Address',
      default: '',
      description: 'Email address to reveal and copy on click',
      validation: {
        required: true,
        pattern: '^[^@]+@[^@]+\\.[^@]+$',
        message: 'Please enter a valid email address',
      },
      bindable: true,
    },
    label: {
      type: 'text',
      label: 'Label',
      default: 'Email',
      description: 'Label text shown before the fold-out email',
      bindable: true,
    },
    accentColor: {
      type: 'color',
      label: 'Accent Color',
      default: '#ffffff',
      description: 'Color for hover state and checkmark icon',
    },
  },
})
