/**
 * ArrowLink widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { ArrowLinkProps } from './types'

export const meta = defineMeta<ArrowLinkProps>({
  id: 'ArrowLink',
  name: 'Arrow Link',
  description: 'Mailto link with animated arrow — swap or slide variant',
  category: 'interactive',
  icon: 'arrow-right',
  tags: ['arrow', 'link', 'cta', 'email', 'contact'],
  component: true,

  settings: {
    variant: {
      type: 'select',
      label: 'Variant',
      default: 'swap',
      choices: [
        { value: 'swap', label: 'Swap (label ↔ email)' },
        { value: 'slide', label: 'Slide (shift right)' },
      ],
    },
    email: {
      type: 'text',
      label: 'Email Address',
      default: '',
      validation: {
        maxLength: 320,
        pattern: '^[^@]+@[^@]+\\.[^@]+$',
        message: 'Please enter a valid email address',
      },
      bindable: true,
    },
    label: {
      type: 'text',
      label: 'Display Label',
      default: '',
      validation: { maxLength: 100 },
      bindable: true,
    },
    arrowDirection: {
      type: 'select',
      label: 'Arrow Direction',
      default: 'right',
      choices: [
        { value: 'right', label: 'Right' },
        { value: 'down', label: 'Down' },
      ],
      advanced: true,
    },
    arrowSize: {
      type: 'select',
      label: 'Arrow Size',
      default: 'small',
      choices: [
        { value: 'small', label: 'Small (24px)' },
        { value: 'medium', label: 'Medium (38px)' },
        { value: 'large', label: 'Large (92px)' },
      ],
      hidden: true,
    },
  },
})
