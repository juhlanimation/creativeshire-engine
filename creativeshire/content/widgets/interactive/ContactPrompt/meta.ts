/**
 * ContactPrompt interactive widget metadata for platform UI.
 */

import { defineMeta } from '@/creativeshire/schema/meta'
import type { ContactPromptProps } from './types'

export const meta = defineMeta<ContactPromptProps>({
  id: 'ContactPrompt',
  name: 'Contact Prompt',
  description: 'Contact element with copy-to-clipboard and flip animation',
  category: 'interactive',
  icon: 'contact',
  tags: ['contact', 'email', 'interactive', 'clipboard'],
  component: true,

  settings: {
    email: {
      type: 'text',
      label: 'Email Address',
      default: '',
      description: 'Email address to copy on click',
      validation: {
        required: true,
        pattern: '^[^@]+@[^@]+\\.[^@]+$',
        message: 'Please enter a valid email address',
      },
    },
    promptText: {
      type: 'text',
      label: 'Prompt Text',
      default: 'How can I help you?',
      description: 'Text shown before hovering (when Show Prompt is enabled)',
      condition: 'showPrompt === true',
    },
    showPrompt: {
      type: 'toggle',
      label: 'Show Prompt',
      default: true,
      description: 'Show prompt text with flip animation on hover',
    },
  },
})
