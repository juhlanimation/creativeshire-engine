/**
 * Site configuration for Bojuhl portfolio.
 * Uses bojuhlPreset with chrome components.
 */

import type { SiteSchema } from '../creativeshire/schema'
import { bojuhlPreset } from '../creativeshire/presets/bojuhl'

/**
 * Main site configuration.
 * Easy to swap: change bojuhlPreset to another preset.
 */
export const siteConfig: SiteSchema = {
  id: 'bojuhl',
  experience: bojuhlPreset.experience,
  chrome: {
    regions: {
      footer: {
        component: 'Footer',
        props: {
          navLinks: [
            { label: 'HOME', href: '/' },
            { label: 'ABOUT', href: '#about' },
            { label: 'PROJECTS', href: '#projects' },
          ],
          contactHeading: 'GET IN TOUCH',
          contactEmail: 'hello@bojuhl.com',
          contactLinkedin: 'https://linkedin.com/in/bojuhl',
          studioHeading: 'FIND MY STUDIO',
          studioUrl: 'https://crossroadstudio.com',
          studioEmail: 'hello@crossroadstudio.com',
          studioSocials: [
            { platform: 'linkedin', url: 'https://linkedin.com/company/crossroadstudio' },
            { platform: 'instagram', url: 'https://instagram.com/crossroadstudio' },
          ],
          copyrightText: '© 2024 Bo Juhl. All rights reserved.',
        },
      },
    },
    overlays: {
      floatingContact: {
        component: 'FloatingContact',
        props: {
          promptText: 'How can I help you?',
          email: 'hello@bojuhl.com',
          backgroundColor: '#9933FF',
        },
        position: 'top-right',
      },
    },
  },
  pages: [
    { id: 'home', slug: '/' }
  ]
}
