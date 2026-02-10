/**
 * ContactBar pattern metadata.
 * Provides UI hints and settings for the CMS editor.
 */

import { defineMeta } from '../../../../schema/meta'
import type { ContactBarConfig } from './types'

export const meta = defineMeta<ContactBarConfig>({
  id: 'ContactBar',
  name: 'Contact Bar',
  description: 'Footer bar with email contact and optional social links',
  category: 'pattern',
  icon: 'mail',
  tags: ['contact', 'footer', 'email', 'social'],
  component: false, // Factory function

  settings: {
    email: {
      type: 'text',
      label: 'Email',
      default: '',
      description: 'Email address for copy-to-clipboard',
      validation: { required: true, maxLength: 320, pattern: '^[^@]+@[^@]+\\.[^@]+$', message: 'Please enter a valid email address' },
      bindable: true,
    },
    prompt: {
      type: 'text',
      label: 'Prompt Text',
      default: '',
      description: 'Optional prompt text (leave empty for email-only mode)',
      validation: { maxLength: 100 },
      bindable: true,
    },
    socialLinks: {
      type: 'custom',
      label: 'Social Links',
      default: [],
      description: 'Social media profile links',
      bindable: true,
    },
    textColor: {
      type: 'select',
      label: 'Text Color',
      default: 'light',
      choices: [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
      ],
      description: 'Text color mode for contrast',
    },
    align: {
      type: 'select',
      label: 'Alignment',
      default: 'end',
      choices: [
        { value: 'start', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'Right' },
        { value: 'between', label: 'Space Between' },
      ],
      description: 'Horizontal alignment',
      advanced: true,
    },
  },
})
