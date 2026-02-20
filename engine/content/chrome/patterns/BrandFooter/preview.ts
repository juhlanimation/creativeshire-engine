import type { BrandFooterProps } from './types'

export const previewProps: Partial<BrandFooterProps> = {
  brandName: 'STUDIO',
  email: 'hello@example.com',
  phone: '+4512345678',
  phoneDisplay: '12345678',
  address: 'Main St 42 / 1000 City',
  copyright: 'Copyright \u00A9 All rights reserved.',
  navLinks: [
    { href: '#about', label: 'ABOUT' },
    { href: '#work', label: 'WORK' },
    { href: '#contact', label: 'CONTACT' },
  ],
}
