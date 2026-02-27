/**
 * BrandFooter chrome pattern content declaration.
 * Centered brand footer with navigation and contact details.
 */

import type { SectionContentDeclaration } from '../../../../schema/content-field'

export const content: SectionContentDeclaration = {
  label: 'Brand Footer',
  description: 'Centered brand footer with navigation and contact details',
  contentFields: [
    { path: 'brandName', type: 'text', label: 'Brand Name', default: 'PORT12' },
    { path: 'copyright', type: 'text', label: 'Copyright Text' },
    {
      path: 'navLinks',
      type: 'collection',
      label: 'Footer Nav Links',
      itemFields: [
        { path: 'href', type: 'text', label: 'Link URL', required: true },
        { path: 'label', type: 'text', label: 'Link Label', required: true },
      ],
    },
    { path: 'email', type: 'text', label: 'Footer Email' },
    { path: 'phone', type: 'text', label: 'Phone Number' },
    { path: 'phoneDisplay', type: 'text', label: 'Phone Display Text' },
    { path: 'address', type: 'text', label: 'Address' },
  ],
  sampleContent: {
    brandName: 'PORT12',
    copyright: 'Copyright \u00a9 All rights reserved.',
    navLinks: [
      { href: '#about', label: 'ABOUT' },
      { href: '#team', label: 'TEAM' },
      { href: '#pricing', label: 'PRICING' },
    ],
    email: 'info@example.com',
    phone: '+4500000000',
    phoneDisplay: '00000000',
    address: 'Example Street 1 / City',
  },
}
