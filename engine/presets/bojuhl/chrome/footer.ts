/**
 * Bojuhl preset footer configuration.
 * Three-column footer with navigation, contact, and studio sections.
 *
 * Uses widget-based approach: ChromeRenderer wraps in semantic <footer>,
 * widgets define the content structure.
 *
 * Structure:
 * - Flex container (footer-chrome)
 *   - Content row (footer-chrome__content)
 *     - Left: Navigation stack
 *     - Right: Contact + Studio sections
 *   - Copyright text
 *
 * Content bindings:
 * - navLinks: Array of { label, href } for navigation
 * - contactHeading, email, linkedinUrl: Contact section
 * - studioHeading, studioUrl, studioEmail, studioSocials: Studio section
 * - copyright: Copyright text
 */

import type { PresetRegionConfig } from '../../types'
import type { WidgetSchema } from '../../../schema'

/**
 * Creates a section with heading and content.
 */
function createSection(
  id: string,
  headingBinding: string,
  content: WidgetSchema[]
): WidgetSchema {
  return {
    id,
    type: 'Stack',
    props: { gap: 8 },
    className: 'footer-chrome__section',
    widgets: [
      {
        id: `${id}-heading`,
        type: 'Text',
        props: { content: headingBinding, as: 'h2' },
        className: 'footer-chrome__heading',
      },
      ...content,
    ],
  }
}

/**
 * Footer region configuration.
 * Widget-based: ChromeRenderer provides semantic <footer> wrapper,
 * widgets define the configurable content.
 *
 * Content values use binding expressions ({{ content.xxx }}) that
 * are resolved at runtime by the platform.
 */
export const footerConfig: PresetRegionConfig = {
  widgets: [
    // Main container - applies footer-chrome styles
    {
      id: 'footer-container',
      type: 'Flex',
      props: {
        direction: 'column',
        gap: 32,
      },
      className: 'footer-chrome',
      widgets: [
        // Content row: navigation (left) + sections (right)
        {
          id: 'footer-content',
          type: 'Flex',
          props: {
            justify: 'between',
            align: 'start',
            gap: 64,
          },
          className: 'footer-chrome__content',
          widgets: [
            // Left column: Navigation
            {
              id: 'footer-left',
              type: 'Stack',
              className: 'footer-chrome__left',
              widgets: [
                {
                  id: 'footer-nav',
                  type: 'Stack',
                  props: { gap: 8 },
                  className: 'footer-chrome__nav',
                  widgets: [
                    {
                      __repeat: '{{ content.footer.navLinks }}',
                      id: 'nav-link',
                      type: 'Link',
                      props: {
                        href: '{{ item.href }}',
                        children: '{{ item.label }}',
                      },
                      className: 'footer-chrome__nav-link',
                    },
                  ],
                },
              ],
            },
            // Right column: Contact + Studio
            {
              id: 'footer-right',
              type: 'Flex',
              props: { gap: 64 },
              className: 'footer-chrome__right',
              widgets: [
                // Contact section
                createSection('footer-contact', '{{ content.footer.contactHeading }}', [
                  {
                    id: 'footer-contact-email',
                    type: 'ContactPrompt',
                    props: {
                      email: '{{ content.footer.email }}',
                      showPrompt: false,
                    },
                    className: 'footer-chrome__link',
                  },
                  {
                    id: 'footer-contact-linkedin',
                    type: 'Link',
                    props: {
                      href: '{{ content.footer.linkedinUrl }}',
                      children: 'linkedin',
                      target: '_blank',
                    },
                    className: 'footer-chrome__social-link',
                  },
                ]),
                // Studio section
                createSection('footer-studio', '{{ content.footer.studioHeading }}', [
                  {
                    id: 'footer-studio-url',
                    type: 'Link',
                    props: {
                      href: '{{ content.footer.studioUrl }}',
                      children: '{{ content.footer.studioUrlLabel }}',
                      target: '_blank',
                    },
                    className: 'footer-chrome__link',
                  },
                  {
                    id: 'footer-studio-email',
                    type: 'ContactPrompt',
                    props: {
                      email: '{{ content.footer.studioEmail }}',
                      showPrompt: false,
                    },
                    className: 'footer-chrome__link',
                  },
                  {
                    id: 'footer-studio-socials',
                    type: 'Stack',
                    props: { gap: 8 },
                    className: 'footer-chrome__socials',
                    widgets: [
                      {
                        __repeat: '{{ content.footer.studioSocials }}',
                        id: 'studio-social',
                        type: 'Link',
                        props: {
                          href: '{{ item.url }}',
                          children: '{{ item.platform }}',
                          target: '_blank',
                        },
                        className: 'footer-chrome__social-link',
                      },
                    ],
                  },
                ]),
              ],
            },
          ],
        },
        // Copyright
        {
          id: 'footer-copyright',
          type: 'Text',
          props: {
            content: '{{ content.footer.copyright }}',
            as: 'p',
          },
          className: 'footer-chrome__copyright',
        },
      ],
    },
  ],
}
