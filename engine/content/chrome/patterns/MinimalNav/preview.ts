import type { MinimalNavProps } from './types'

export const previewProps: Partial<MinimalNavProps> = {
  navLinks: [
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  email: 'hello@example.com',
}
