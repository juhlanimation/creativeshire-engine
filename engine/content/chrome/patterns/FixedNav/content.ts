/**
 * FixedNav chrome pattern content declaration.
 * Fixed header with site title and navigation links.
 */

import type { SectionContentDeclaration } from '../../../../schema/content-field'

export const content: SectionContentDeclaration = {
  label: 'Fixed Navigation',
  description: 'Fixed header with site title and navigation links',
  contentFields: [
    { path: 'siteTitle', type: 'text', label: 'Site Title', required: true, default: 'PORT12' },
  ],
  sampleContent: {
    siteTitle: 'PORT12',
  },
}
