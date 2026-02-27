import type { GlassNavProps } from './types'

export const previewProps: Partial<GlassNavProps> = {
  logoSrc: '/images/logo.svg',
  logoAlt: 'Studio Logo',
  navLinks: [
    { label: 'Work', href: '/' },
    { label: 'About', href: '/about' },
  ],
}
