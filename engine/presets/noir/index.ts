/**
 * Noir Preset — Cinematic Portfolio
 * Portfolio site preset with hero, about, and projects sections.
 *
 * Usage:
 * ```typescript
 * import { noirPreset } from './'
 *
 * export const siteConfig: SiteSchema = {
 *   id: 'my-site',
 *   ...noirPreset,
 * }
 * ```
 */

import type { SitePreset } from '../types'
import { registerPreset, type PresetMeta } from '../registry'
import { createContactFooterRegion } from '../../content/chrome/patterns/ContactFooter'
import { createCursorTrackerOverlay } from '../../content/chrome/patterns/CursorTracker'
import { createVideoModalOverlay } from '../../content/chrome/patterns/VideoModal'
import { homePageTemplate } from './pages/home'
import { noirContentContract } from './content-contract'
import { noirSampleContent } from './sample-content'

/**
 * Noir preset metadata for UI display.
 */
export const noirMeta: PresetMeta = {
  id: 'noir',
  name: 'Cinematic Portfolio - Noir',
  description: 'Cinematic portfolio with hero video, about section, and project grid.',
}

/**
 * Noir preset - complete portfolio site configuration.
 * Includes hero, about, featured projects, and other projects sections.
 */
export const noirPreset: SitePreset = {
  content: {
    id: 'noir-content',
    name: 'Noir',
    pages: {
      home: homePageTemplate,
    },
    chrome: {
      regions: {
        header: {
          overlay: true,
          layout: {
            justify: 'end',
            align: 'start',
            padding: '1.5rem 2rem',
          },
          widgets: [
            {
              id: 'floating-contact',
              type: 'EmailCopy',
              props: {
                label: '{{ content.contact.label }}',
                email: '{{ content.contact.email }}',
                blendMode: 'difference',
              },
              behaviour: { id: 'hover/reveal' },
            },
          ],
        },
        footer: {
          ...createContactFooterRegion({
            navLinks: '{{ content.footer.navLinks }}',
            contactHeading: '{{ content.footer.contactHeading }}',
            contactEmail: '{{ content.footer.email }}',
            linkedinUrl: '{{ content.footer.linkedinUrl }}',
            studioHeading: '{{ content.footer.studioHeading }}',
            studioUrl: '{{ content.footer.studioUrl }}',
            studioUrlLabel: '{{ content.footer.studioUrlLabel }}',
            studioEmail: '{{ content.footer.studioEmail }}',
            studioSocials: '{{ content.footer.studioSocials }}',
            copyright: '{{ content.footer.copyright }}',
          }),
          colorMode: 'dark',
          style: {
            backgroundColor: 'var(--dark-bg)',
            color: 'var(--dark-text-primary)',
          },
        },
      },
      overlays: {
        cursorLabel: createCursorTrackerOverlay({
          label: 'ENTER',
          targetSelector: '.text-widget a',
        }),
        modal: createVideoModalOverlay(),
      },
    },
    contentContract: noirContentContract,
    sampleContent: noirSampleContent,
  },
  experience: {
    base: 'cover-scroll',
    overrides: {
      sectionBehaviours: {
        hero: [{
          behaviour: 'scroll/cover-progress',
          options: {
            propagateToRoot: '--hero-cover-progress',
            propagateContentEdge: '--hero-content-edge',
            targetTop: 0.4,
            targetBottom: 0.95,
          },
          pinned: true,
        }],
        About: [{ behaviour: 'scroll/fade' }],
      },
    },
  },
  theme: {
    id: 'noir-theme',
    name: 'Noir Contrast',
    theme: {
      colorTheme: 'contrast',
      scrollbar: {
        width: 6,
        thumb: '#000000',
        track: '#ffffff',
        thumbDark: '#ffffff',
        trackDark: '#0a0a0a',
      },
      smoothScroll: {
        enabled: true,
        smooth: 1.2,
        smoothMac: 0.5,
        effects: true,
      },
      // Typography inherited from colorTheme (contrast theme provides Inter + Plus Jakarta Sans).
      // Only override here if the preset needs fonts different from its theme.
      sectionTransition: {
        fadeDuration: '0.15s',
        fadeEasing: 'ease-out',
      },
      container: {
        maxWidth: '2400px',
        outerBackground: '#000000',
        sectionGap: 'loose',
      },
    },
  },
}

// Auto-register on module load
registerPreset(noirMeta, noirPreset)

// Content contract export
export { noirContentContract } from './content-contract'

// Export sample content for dev preview
export { noirSampleContent } from './sample-content'
