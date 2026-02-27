import type { SectionContentDeclaration } from '../../../../schema/content-field'

export const content: SectionContentDeclaration = {
  label: 'Column Footer',
  description: 'Multi-column footer with divider and staggered reveal.',
  contentFields: [
    {
      path: 'columns',
      type: 'collection',
      label: 'Footer Columns',
      required: true,
      itemFields: [
        { path: 'heading', type: 'text', label: 'Column Heading', required: true },
        {
          path: 'items',
          type: 'collection',
          label: 'Column Items',
          itemFields: [
            { path: 'label', type: 'text', label: 'Label', required: true },
            { path: 'href', type: 'text', label: 'URL' },
          ],
        },
      ],
    },
    { path: 'copyright', type: 'text', label: 'Copyright Text', default: '\u00a9 2024 Studio. All rights reserved.' },
  ],
  sampleContent: {
    columns: [
      {
        heading: 'Talk to us',
        items: [
          { label: '+45 28 56 37 73' },
          { label: 'hello@studio.com', href: 'mailto:hello@studio.com' },
        ],
      },
      {
        heading: 'Follow us',
        items: [
          { label: 'Instagram', href: 'https://instagram.com' },
          { label: 'LinkedIn', href: 'https://linkedin.com' },
          { label: 'YouTube', href: 'https://youtube.com' },
          { label: 'Vimeo', href: 'https://vimeo.com' },
        ],
      },
      {
        heading: 'Company',
        items: [
          { label: 'Studio Name ApS' },
          { label: 'VAT DK12345678' },
          { label: 'Copenhagen, Denmark' },
        ],
      },
    ],
    copyright: '',
  },
}
