/**
 * Site configuration for Bojuhl portfolio.
 * Uses bojuhlPreset with chrome components.
 */

import type { SiteSchema } from '../creativeshire/schema'
import { bojuhlPreset } from '../creativeshire/presets/bojuhl'

/**
 * Main site configuration.
 * Easy to swap: change bojuhlPreset to another preset.
 * Sites inherit from presets and can override specific values.
 */
export const siteConfig: SiteSchema = {
  id: 'bojuhl',
  theme: bojuhlPreset.theme,
  experience: bojuhlPreset.experience,
  chrome: {
    regions: {
      footer: {
        component: 'Footer',
        props: {
          navLinks: [
            { label: 'HOME', href: '#hero' },
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
          copyrightText: 'Copyright © Bo Juhl / All rights reserved',
        },
      },
    },
    overlays: {
      floatingContact: {
        widget: {
          id: 'floating-contact',
          type: 'ContactPrompt',
          props: {
            promptText: 'How can I help you?',
            email: 'hello@bojuhl.com',
          },
          behaviour: {
            id: 'contact-reveal',
            options: {
              flipDuration: 200,
              fadeDuration: 100,
            },
          },
        },
        position: 'top-right',
      },
      cursorLabelEnter: {
        component: 'CursorLabel',
        props: {
          label: 'ENTER',
          targetSelector: '.text-widget a',
        },
      },
      cursorLabelWatch: {
        component: 'CursorLabel',
        props: {
          label: 'WATCH',
          targetSelector: '.video-widget--hover-play',
        },
      },
    },
  },
  pages: [
    { id: 'home', slug: '/' }
  ]
}
