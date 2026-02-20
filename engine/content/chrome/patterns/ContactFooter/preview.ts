import type { ContactFooterProps } from './types'

export const previewProps: Partial<ContactFooterProps> = {
  navLinks: [
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ],
  contactHeading: 'GET IN TOUCH',
  contactEmail: 'hello@studio.com',
  linkedinUrl: 'https://linkedin.com/in/example',
  studioHeading: 'FIND MY STUDIO',
  studioUrl: 'https://studio.com',
  studioEmail: 'info@studio.com',
  copyright: '\u00A9 2024 Studio. All rights reserved.',
}
