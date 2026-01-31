/**
 * Link widget metadata for platform UI.
 */

import { defineMeta } from '@/creativeshire/schema/meta'
import type { LinkProps } from './types'

export const meta = defineMeta<LinkProps>({
  id: 'Link',
  name: 'Link',
  description: 'Navigation link for internal and external URLs',
  category: 'primitive',
  icon: 'link',
  tags: ['navigation', 'interactive', 'anchor'],
  component: true,

  settings: {
    href: {
      type: 'text',
      label: 'URL',
      default: '/',
      description: 'Navigation URL (internal paths start with /)',
      validation: { required: true },
    },
    target: {
      type: 'select',
      label: 'Target',
      default: '_self',
      description: 'Where to open the link',
      choices: [
        { value: '_self', label: 'Same Tab' },
        { value: '_blank', label: 'New Tab' },
      ],
    },
    variant: {
      type: 'select',
      label: 'Variant',
      default: 'default',
      description: 'Visual style variant',
      choices: [
        { value: 'default', label: 'Default' },
        { value: 'underline', label: 'Underline' },
        { value: 'hover-underline', label: 'Hover Underline' },
      ],
    },
    rel: {
      type: 'text',
      label: 'Rel Attribute',
      default: '',
      description: 'Relationship attribute (e.g., noopener noreferrer)',
      advanced: true,
    },
  },
})
