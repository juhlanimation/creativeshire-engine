/**
 * CenteredNav chrome pattern content declaration.
 * Centered header with brand name and navigation links.
 */

import type { SectionContentDeclaration } from '../../../../schema/content-field'

export const content: SectionContentDeclaration = {
  label: 'Centered Navigation',
  description: 'Centered header with brand name and navigation links',
  contentFields: [
    { path: 'brandName', type: 'text', label: 'Brand Name', default: 'PORT12' },
  ],
  sampleContent: {
    brandName: 'PORT12',
  },
}
