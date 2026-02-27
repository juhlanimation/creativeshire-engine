/**
 * HaubjergNav chrome pattern content declaration.
 * Dark fixed navbar with two-part brand text and navigation links.
 */

import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { HaubjergNavProps } from './types'

export const content: SectionContentDeclaration<Partial<HaubjergNavProps>> = {
  label: 'Haubjerg Nav',
  description: 'Dark fixed navbar with brand text and navigation links',
  contentFields: [
    {
      path: 'brandParts',
      type: 'string-list',
      label: 'Brand Text Parts',
      separator: ' ',
      default: ['Studio', 'Dokumentar'],
    },
    {
      path: 'navLinks',
      type: 'collection',
      label: 'Navigation Links',
      itemFields: [
        { path: 'label', type: 'text', label: 'Link Label', required: true },
        { path: 'href', type: 'text', label: 'Link URL', required: true },
      ],
    },
  ],
  sampleContent: {
    brandParts: ['Studio', 'Dokumentar'],
    navLinks: [
      { label: 'Forside', href: '/' },
      { label: 'Kerneprodukter', href: '/kerneprodukter' },
      { label: 'Mennesker', href: '/mennesker' },
      { label: 'Workshops', href: '/workshops' },
    ],
  },
}
