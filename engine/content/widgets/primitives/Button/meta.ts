/**
 * Button widget metadata for platform UI.
 */

import { defineMeta } from '@/engine/schema/meta'
import type { ButtonProps } from './types'

export const meta = defineMeta<ButtonProps>({
  id: 'Button',
  name: 'Button',
  description: 'Interactive button element for user actions',
  category: 'primitive',
  icon: 'button',
  tags: ['interactive', 'action', 'form'],
  component: true,

  settings: {
    label: {
      type: 'text',
      label: 'Label',
      default: 'Button',
      description: 'Button text',
      validation: { required: true },
    },
    variant: {
      type: 'select',
      label: 'Variant',
      default: 'primary',
      description: 'Visual style variant',
      choices: [
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'ghost', label: 'Ghost' },
      ],
    },
    type: {
      type: 'select',
      label: 'Type',
      default: 'button',
      description: 'HTML button type attribute',
      choices: [
        { value: 'button', label: 'Button' },
        { value: 'submit', label: 'Submit' },
        { value: 'reset', label: 'Reset' },
      ],
      advanced: true,
    },
    disabled: {
      type: 'toggle',
      label: 'Disabled',
      default: false,
      description: 'Disable button interactions',
    },
  },
})
