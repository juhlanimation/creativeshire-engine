/**
 * EmailCopy interactive widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { EmailCopyProps } from './types'

export const meta = defineMeta<EmailCopyProps>({
  id: 'EmailCopy',
  name: 'Email Copy',
  description: 'Click-to-copy email with flip or horizontal reveal animation',
  category: 'interactive',
  icon: 'mail',
  tags: ['contact', 'email', 'interactive', 'clipboard'],
  component: true,

  settings: {
    variant: {
      type: 'select',
      label: 'Variant',
      default: 'flip',
      choices: [
        { value: 'flip', label: 'Flip' },
        { value: 'reveal', label: 'Reveal' },
      ],
      description: 'Animation style: vertical flip or horizontal fold-out reveal',
    },
    email: {
      type: 'text',
      label: 'Email Address',
      default: '',
      description: 'Email address to copy on click',
      validation: {
        required: true,
        maxLength: 320,
        pattern: '^[^@]+@[^@]+\\.[^@]+$',
        message: 'Please enter a valid email address',
      },
      bindable: true,
    },
    hoverColor: {
      type: 'select',
      label: 'Hover Color',
      default: 'accent',
      choices: [
        { value: 'accent', label: 'Accent' },
        { value: 'interaction', label: 'Interaction' },
        { value: 'primary', label: 'Primary' },
      ],
      description: 'Color the widget changes to on hover and copy confirmation',
    },
    label: {
      type: 'text',
      label: 'Label',
      default: '',
      description: 'Text shown alongside the email. Flip: prompt that flips to email on hover. Reveal: label before fold-out email. Leave empty to show email directly.',
      validation: { maxLength: 100 },
      bindable: true,
    },
    // Flip-specific
    blendMode: {
      type: 'select',
      label: 'Blend Mode',
      default: 'difference',
      choices: [
        { value: 'normal', label: 'Normal' },
        { value: 'difference', label: 'Difference' },
      ],
      description: 'How text blends with content behind it. Difference makes text adapt to any background.',
      condition: "variant === 'flip'",
    },
    color: {
      type: 'color',
      label: 'Text Color',
      default: '',
      description: 'Base text color. Leave empty to inherit from theme. Ignored when blend mode is Difference.',
      condition: "variant === 'flip' && blendMode === 'normal'",
    },
  },
})
