/**
 * MinimalNav chrome pattern content declaration.
 * Right-aligned header with nav links and contact email.
 */

import type { SectionContentDeclaration } from '../../../../schema/content-field'

export const content: SectionContentDeclaration = {
  label: 'Minimal Navigation',
  description: 'Right-aligned header with navigation links and contact email',
  contentFields: [
    {
      path: 'navLinks',
      type: 'collection',
      label: 'Navigation Links',
      itemFields: [
        { path: 'label', type: 'text', label: 'Link Label', required: true },
        { path: 'href', type: 'text', label: 'Link URL', required: true },
      ],
    },
    { path: 'email', type: 'text', label: 'Contact Email', placeholder: 'hello@studio.com' },
  ],
  sampleContent: {
    navLinks: [
      { label: 'Work', href: '#work' },
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#contact' },
    ],
    email: 'hello@studio.com',
  },
}
