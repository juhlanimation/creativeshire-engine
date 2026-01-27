/**
 * Bojuhl preset footer configuration.
 * Three-column footer with navigation, contact, and studio sections.
 */

import type { PresetRegionConfig } from '../../types'

/**
 * Footer region configuration.
 * Uses placeholder values that site can override.
 */
export const footerConfig: PresetRegionConfig = {
  component: 'Footer',
  props: {
    navLinks: [
      { label: 'HOME', href: '/' },
      { label: 'ABOUT', href: '#about' },
      { label: 'PROJECTS', href: '#projects' },
    ],
    contactHeading: 'CONTACT',
    contactEmail: 'hello@example.com',
    contactLinkedin: 'https://linkedin.com',
    studioHeading: 'STUDIO',
    studioUrl: 'https://example.com',
    studioEmail: 'studio@example.com',
    studioSocials: [
      { platform: 'linkedin', url: 'https://linkedin.com' },
      { platform: 'instagram', url: 'https://instagram.com' },
      { platform: 'facebook', url: 'https://facebook.com' },
    ],
    copyrightText: '© 2024. All rights reserved.',
  },
}
