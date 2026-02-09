/**
 * Bishoy Gendi preset chrome configuration.
 *
 * NavTimeline is a preset overlay (not experience chrome) — the preset
 * decides what UI wraps sections; the experience only controls scroll physics.
 * FixedCard renders glassmorphic about card at fixed viewport position.
 * Footer hiding via hideChrome: ['footer']
 * IntroOverlay is configured in intro config (not chrome)
 */

import type { PresetChromeConfig } from '../../types'

/**
 * Chrome configuration for Bishoy Gendi preset.
 * Header and footer are hidden - navigation is handled by the experience.
 */
export const chromeConfig: PresetChromeConfig = {
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
              // Label: "HEY, I AM"
              {
                id: 'about-card-label',
                type: 'Text',
                props: { content: '{{ content.about.label }}', as: 'span' },
                className: 'about-card__label',
              },
              // Name: "BISHOY GENDI"
              {
                id: 'about-card-name',
                type: 'Text',
                props: { content: '{{ content.about.name }}', as: 'h1' },
                className: 'about-card__name',
              },
              // Role / Location on same line
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
              // Divider line
              {
                id: 'about-card-divider',
                type: 'Box',
                className: 'about-card__divider',
                widgets: [],
              },
              // Bio paragraph
              {
                id: 'about-card-bio',
                type: 'Text',
                props: { content: '{{ content.about.bio }}', as: 'p', html: true },
                className: 'about-card__bio',
              },
              // Contact row: Social links (left) | Email reveal (right)
              {
                id: 'about-card-contact',
                type: 'Flex',
                props: { direction: 'row', align: 'center', justify: 'between', wrap: true, gap: '1rem' },
                className: 'about-card__contact',
                widgets: [
                  // Social links - left group
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
                  // Email reveal - right side
                  {
                    type: 'EmailReveal',
                    props: {
                      email: '{{ content.contact.email }}',
                      label: 'EMAIL',
                      accentColor: '#ffffff',
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
}
