import type { ColumnFooterProps } from './types'

export const previewProps: Partial<ColumnFooterProps> = {
  columns: [
    {
      heading: 'Talk to us',
      items: [
        { label: 'hello@studio.com', href: 'mailto:hello@studio.com' },
        { label: '+1 (555) 123-4567' },
      ],
    },
    {
      heading: 'Follow us',
      items: [
        { label: 'Instagram', href: 'https://instagram.com' },
        { label: 'Twitter', href: 'https://twitter.com' },
        { label: 'LinkedIn', href: 'https://linkedin.com' },
      ],
    },
    {
      heading: 'Company',
      items: [
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Privacy Policy', href: '/privacy' },
      ],
    },
  ],
  copyright: '\u00a9 2024 Studio. All rights reserved.',
  showDivider: true,
  lastColumnAlign: 'end',
}
