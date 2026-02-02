/**
 * Site configuration for Bojuhl portfolio.
 * Uses bojuhlPreset with chrome components.
 */

import type { SiteSchema } from '../engine/schema'
import { bojuhlPreset } from '../engine/presets/bojuhl'

/**
 * Toggle experience mode for testing.
 * Set to 'slideshow' to test new navigation system.
 * Set to 'default' to use preset's cinematic-portfolio experience.
 */
const EXPERIENCE_MODE: 'default' | 'slideshow' = 'default'

/**
 * Main site configuration.
 * Easy to swap: change bojuhlPreset to another preset.
 * Sites inherit from presets and can override specific values.
 */
export const siteConfig: SiteSchema = {
  id: 'bojuhl',
  theme: bojuhlPreset.theme,
  experience: EXPERIENCE_MODE === 'slideshow'
    ? { id: 'slideshow' }
    : bojuhlPreset.experience,
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
            id: 'hover/reveal',
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
      // Modal infrastructure - registers 'open-video-modal' action
      modal: { component: 'ModalRoot' },
    },
  },
  pages: [
    { id: 'home', slug: '/' }
  ]
}
