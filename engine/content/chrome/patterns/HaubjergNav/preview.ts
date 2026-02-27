import type { HaubjergNavProps } from './types'

export const previewProps: Partial<HaubjergNavProps> = {
  brandParts: ['Studio', 'Dokumentar'],
  navLinks: [
    { label: 'Forside', href: '/' },
    { label: 'Kerneprodukter', href: '/kerneprodukter' },
    { label: 'Mennesker', href: '/mennesker' },
    { label: 'Workshops', href: '/workshops' },
  ],
}
