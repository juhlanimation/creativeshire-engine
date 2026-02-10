/**
 * SectionFooter interactive widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { SectionFooterProps } from './types'

export const meta = defineMeta<SectionFooterProps>({
  id: 'SectionFooter',
  name: 'Section Footer',
  description: 'Footer bar for project sections with social icons, email copy, and display name',
  category: 'interactive',
  icon: 'layout',
  tags: ['footer', 'contact', 'social', 'section'],
  component: true,

  settings: {
    email: {
      type: 'text',
      label: 'Email',
      default: '',
      description: 'Email address (click to copy)',
      validation: { maxLength: 320, pattern: '^[^@]+@[^@]+\\.[^@]+$', message: 'Please enter a valid email address' },
      bindable: true,
    },
    instagram: {
      type: 'text',
      label: 'Instagram URL',
      default: '',
      description: 'Instagram profile URL',
      validation: { maxLength: 2048, pattern: '^(https?:\\/\\/|\\/|#|mailto:)', message: 'Must be a valid URL, path, or anchor' },
      bindable: true,
    },
    linkedin: {
      type: 'text',
      label: 'LinkedIn URL',
      default: '',
      description: 'LinkedIn profile URL',
      validation: { maxLength: 2048, pattern: '^(https?:\\/\\/|\\/|#|mailto:)', message: 'Must be a valid URL, path, or anchor' },
      bindable: true,
    },
    displayName: {
      type: 'text',
      label: 'Display Name',
      default: '',
      description: 'Name shown in the bottom-left corner',
      validation: { maxLength: 100 },
      bindable: true,
    },
    height: {
      type: 'text',
      label: 'Height',
      default: '3rem',
      description: 'Footer bar height (CSS value)',
      validation: { maxLength: 50 },
      advanced: true,
    },
    textColor: {
      type: 'select',
      label: 'Text Color',
      default: 'light',
      description: 'Text color mode (light for dark backgrounds, dark for light)',
      choices: [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
      ],
    },
  },
})
