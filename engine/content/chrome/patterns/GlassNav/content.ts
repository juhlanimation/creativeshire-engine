import type { SectionContentDeclaration } from '../../../../schema/content-field'

export const content: SectionContentDeclaration = {
  label: 'Glass Nav',
  description: 'Fixed transparent header with frosted glass effect on scroll.',
  contentFields: [
    { path: 'logoSrc', type: 'image', label: 'Logo Image' },
    { path: 'logoAlt', type: 'text', label: 'Logo Alt Text', default: 'Logo' },
  ],
  sampleContent: {
    logoSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='115' height='17' viewBox='0 0 115 17' fill='none'%3E%3Cpath d='M2 8.5c5-7 10-7 15 0s10 7 15 0 10-7 15 0 10 7 15 0 10-7 15 0 10 7 15 0 10-7 15 0' stroke='%23f9f9f9' stroke-width='2' fill='none'/%3E%3C/svg%3E",
    logoAlt: 'Studio Logo',
  },
}
