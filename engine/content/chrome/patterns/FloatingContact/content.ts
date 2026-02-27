/**
 * FloatingContact chrome pattern content declaration.
 * Floating contact prompt with email copy action.
 */

import type { SectionContentDeclaration } from '../../../../schema/content-field'

export const content: SectionContentDeclaration = {
  label: 'Floating Contact',
  description: 'Floating contact prompt with flip animation and copy-to-clipboard',
  contentFields: [
    { path: 'label', type: 'text', label: 'Prompt Label', required: true, default: 'Get in touch' },
    { path: 'email', type: 'text', label: 'Contact Email', required: true, placeholder: 'hello@studio.com' },
  ],
  sampleContent: {
    label: 'Get in touch',
    email: 'hello@studio.com',
  },
}
