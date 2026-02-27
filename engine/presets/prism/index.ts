/**
 * Prism Preset — Showcase Portfolio
 * Portfolio with 8 project showcase sections.
 *
 * Usage:
 * ```typescript
 * import { prismPreset } from './'
 *
 * export const siteConfig: SiteSchema = {
 *   id: 'my-site',
 *   ...prismPreset,
 * }
 * ```
 */

import './styles.css'
import type { SitePreset } from '../types'
import { registerPreset, type PresetMeta } from '../registry'
import { homePageTemplate } from './pages/home'
import { prismContentContract } from './content-contract'
import { prismSampleContent } from './sample-content'

/**
 * Prism preset metadata for UI display.
 */
export const prismMeta: PresetMeta = {
  id: 'prism',
  name: 'Showcase Portfolio - Prism',
  description: 'Portfolio with 8 project showcase sections.',
}

/**
 * Prism preset configuration.
 *
 * Sections:
 * 1. Showreel - Fullscreen video
 * 2. About - Card overlay
 * 3. Azuki Elementals - ProjectGallery
 * 4. Boy Mole Fox Horse - ProjectShowcase
 * 5. THE 21 - ProjectCompare
 * 6. Clash Royale - ProjectVideoGrid
 * 7. Riot Games - ProjectExpand
 * 8. Projects I Like - ProjectTabs
 */
export const prismPreset: SitePreset = {
  content: {
    id: 'prism-content',
    name: 'Prism',
    pages: {
      home: homePageTemplate,
    },
    chrome: {
      regions: {
        header: 'hidden',
        footer: 'hidden',
      },
      overlays: {
        modal: { component: 'ModalRoot' },
        navTimeline: {
          component: 'NavTimeline',
          props: { position: 'center', showArrows: true, autohide: true },
        },
        fixedCard: {
          component: 'FixedCard',
          props: {
            centerGap: 90,
            cards: [
              {
                sectionId: 'about',
                alignment: 'left',
                width: 650,
                height: 450,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                accentColor: '#ffffff',
                widgets: [
                  {
                    id: 'about-card-label',
                    type: 'Text',
                    props: { content: '{{ content.about.label }}', as: 'span' },
                    className: 'about-card__label',
                  },
                  {
                    id: 'about-card-name',
                    type: 'Text',
                    props: { content: '{{ content.about.name }}', as: 'h1' },
                    className: 'about-card__name',
                  },
                  {
                    id: 'about-card-role',
                    type: 'Flex',
                    props: { direction: 'row', align: 'center' },
                    className: 'about-card__role',
                    widgets: [
                      {
                        type: 'Text',
                        props: { content: '{{ content.about.title }}', as: 'span' },
                      },
                      {
                        type: 'Text',
                        props: { content: '/', as: 'span' },
                        className: 'about-card__role-divider',
                      },
                      {
                        type: 'Text',
                        props: { content: '{{ content.about.location }}', as: 'span' },
                      },
                    ],
                  },
                  {
                    id: 'about-card-divider',
                    type: 'Box',
                    className: 'about-card__divider',
                    widgets: [],
                  },
                  {
                    id: 'about-card-bio',
                    type: 'Text',
                    props: { content: '{{ content.about.bio }}', as: 'p', html: true },
                    className: 'about-card__bio',
                  },
                  {
                    id: 'about-card-contact',
                    type: 'Flex',
                    props: { direction: 'row', align: 'center', justify: 'between', wrap: true, gap: '1rem' },
                    className: 'about-card__contact',
                    widgets: [
                      {
                        type: 'Flex',
                        props: { direction: 'row', align: 'center', gap: '1.5rem' },
                        className: 'about-card__social',
                        widgets: [
                          {
                            type: 'Link',
                            props: { href: '{{ content.contact.instagram }}', target: '_blank', rel: 'noopener noreferrer' },
                            widgets: [{ type: 'Text', props: { content: 'INSTAGRAM' } }],
                          },
                          {
                            type: 'Link',
                            props: { href: '{{ content.contact.linkedin }}', target: '_blank', rel: 'noopener noreferrer' },
                            widgets: [{ type: 'Text', props: { content: 'LINKEDIN' } }],
                          },
                        ],
                      },
                      {
                        type: 'EmailCopy',
                        props: {
                          variant: 'reveal',
                          email: '{{ content.contact.email }}',
                          label: 'EMAIL',
                          hoverColor: 'accent',
                        },
                        className: 'about-card__email',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    },
    contentContract: prismContentContract,
    sampleContent: prismSampleContent,
  },
  experience: {
    base: 'infinite-carousel',
    overrides: {
      sectionBehaviours: {
        showreel: [{ behaviour: 'none', pinned: true }],
      },
    },
  },
  theme: {
    id: 'prism-theme',
    name: 'Prism Contrast',
    theme: {
      colorTheme: 'contrast',
      smoothScroll: {
        enabled: true,
      },
      typography: {
        title: 'var(--font-inter), system-ui, -apple-system, sans-serif',
        paragraph: 'var(--font-plus-jakarta), system-ui, -apple-system, sans-serif',
      },
    },
  },
}

// Auto-register on module load
registerPreset(prismMeta, prismPreset)

// Content contract export
export { prismContentContract } from './content-contract'

// Export sample content for dev preview
export { prismSampleContent } from './sample-content'
