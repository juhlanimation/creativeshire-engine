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
 */

import type { PresetRegionConfig } from '../../types'
import type { WidgetSchema } from '@/engine/schema'

/**
 * Creates navigation links for the footer.
 */
function createNavLinks(links: Array<{ label: string; href: string }>): WidgetSchema[] {
  return links.map((link, index) => ({
    id: `footer-nav-${index}`,
    type: 'Link',
    props: {
      href: link.href,
      children: link.label,
    },
    className: 'footer-chrome__nav-link',
  }))
}

/**
 * Creates social links for the footer.
 */
function createSocialLinks(socials: Array<{ platform: string; url: string }>): WidgetSchema[] {
  return socials.map((social, index) => ({
    id: `footer-social-${index}`,
    type: 'Link',
    props: {
      href: social.url,
      children: social.platform,
      target: '_blank',
    },
    className: 'footer-chrome__social-link',
  }))
}

/**
 * Creates a section with heading and content.
 */
function createSection(
  id: string,
  heading: string,
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
        props: { content: heading, as: 'h2' },
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
                  widgets: createNavLinks([
                    { label: 'HOME', href: '#hero' },
                    { label: 'ABOUT', href: '#about' },
                    { label: 'PROJECTS', href: '#projects' },
                  ]),
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
                createSection('footer-contact', 'CONTACT', [
                  {
                    id: 'footer-contact-email',
                    type: 'ContactPrompt',
                    props: {
                      email: 'hello@example.com',
                      showPrompt: false,
                    },
                    className: 'footer-chrome__link',
                  },
                  {
                    id: 'footer-contact-linkedin',
                    type: 'Link',
                    props: {
                      href: 'https://linkedin.com',
                      children: 'linkedin',
                      target: '_blank',
                    },
                    className: 'footer-chrome__social-link',
                  },
                ]),
                // Studio section
                createSection('footer-studio', 'STUDIO', [
                  {
                    id: 'footer-studio-url',
                    type: 'Link',
                    props: {
                      href: 'https://example.com',
                      children: 'example.com',
                      target: '_blank',
                    },
                    className: 'footer-chrome__link',
                  },
                  {
                    id: 'footer-studio-email',
                    type: 'ContactPrompt',
                    props: {
                      email: 'studio@example.com',
                      showPrompt: false,
                    },
                    className: 'footer-chrome__link',
                  },
                  ...createSocialLinks([
                    { platform: 'linkedin', url: 'https://linkedin.com' },
                    { platform: 'instagram', url: 'https://instagram.com' },
                    { platform: 'facebook', url: 'https://facebook.com' },
                  ]),
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
            content: 'Copyright © Your Name / All rights reserved',
            as: 'p',
          },
          className: 'footer-chrome__copyright',
        },
      ],
    },
  ],
}
