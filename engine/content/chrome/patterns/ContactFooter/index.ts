/**
 * ContactFooter chrome pattern — factory function for footer region.
 * Builds a 2-part footer with navigation (left) and contact+studio (right).
 *
 * Uses footer-chrome__* CSS classes from styles.css for layout, typography,
 * hover effects, and responsive breakpoints. CSS handles flex-direction,
 * gap, and justify — Flex widgets must NOT set props that override those
 * (inline styles beat class styles).
 *
 * Structure (matches Footer/index.tsx component):
 * - Flex (.footer-chrome)
 *   - Flex (.footer-chrome__content)
 *     - Flex (.footer-chrome__left)
 *       - Flex (.footer-chrome__nav)
 *         - Link x N (nav items via __repeat)
 *     - Flex (.footer-chrome__right)
 *       - Flex (.footer-chrome__section, contact)
 *         - Text (heading)
 *         - Link (email)
 *         - Link (linkedin)
 *       - Flex (.footer-chrome__section, studio)
 *         - Text (heading)
 *         - Link (url)
 *         - Link (email)
 *         - Flex (.footer-chrome__socials)
 *           - Link x N (socials via __repeat)
 *   - Text (.footer-chrome__copyright)
 */

import type { PresetRegionConfig } from '../../../../presets/types'
import type { WidgetSchema } from '../../../../schema/widget'
import { applyMetaDefaults } from '../../../../schema/settings'
import type { ContactFooterProps, NavLink } from './types'
import { meta } from './meta'

/**
 * Build nav link widgets from either a binding expression or a direct array.
 * - string → single template widget with __repeat (production, resolved by bindings)
 * - NavLink[] → mapped directly to Link widgets (Storybook, static data)
 */
function buildNavWidgets(navLinks: string | NavLink[]): WidgetSchema[] {
  if (typeof navLinks === 'string') {
    return [
      {
        id: 'footer-nav-link',
        type: 'Link',
        __repeat: navLinks,
        __key: 'label',
        props: {
          href: '{{ item.href }}',
          children: '{{ item.label }}',
        },
        className: 'footer-chrome__nav-link',
      },
    ]
  }
  return navLinks.map((link, i) => ({
    id: `footer-nav-link-${i}`,
    type: 'Link' as const,
    props: {
      href: link.href,
      children: link.label,
    },
    className: 'footer-chrome__nav-link',
  }))
}

/**
 * Creates a ContactFooter region configuration.
 *
 * @param props - Footer configuration with nav links, contact, and studio info
 * @returns PresetRegionConfig for the footer region
 */
export function createContactFooterRegion(rawProps: ContactFooterProps): PresetRegionConfig {
  const props = applyMetaDefaults(meta, rawProps)

  // Nav column — wrapped in __left for CSS layout grouping
  const hasNavLinks = Array.isArray(props.navLinks) ? props.navLinks.length > 0 : !!props.navLinks
  const navWidget: WidgetSchema | null = hasNavLinks
    ? {
        id: 'footer-nav',
        type: 'Flex',
        // No direction/gap props — CSS .footer-chrome__nav handles layout
        props: {},
        className: 'footer-chrome__nav',
        widgets: buildNavWidgets(props.navLinks!),
      }
    : null

  const leftColumn: WidgetSchema | null = navWidget
    ? {
        id: 'footer-left',
        type: 'Flex',
        // No direction props — CSS .footer-chrome__left handles layout
        props: {},
        className: 'footer-chrome__left',
        widgets: [navWidget],
      }
    : null

  // Contact section
  const contactColumn: WidgetSchema = {
    id: 'footer-contact',
    type: 'Flex',
    // No direction/gap props — CSS .footer-chrome__section handles layout
    props: {},
    className: 'footer-chrome__section',
    widgets: [
      {
        id: 'footer-contact-heading',
        type: 'Text',
        props: {
          content: props.contactHeading,
          as: 'h2',
        },
        className: 'footer-chrome__heading',
      },
      {
        id: 'footer-contact-email',
        type: 'Link',
        props: {
          href: `mailto:${props.contactEmail}`,
          children: props.contactEmail,
        },
        className: 'footer-chrome__link',
      },
      {
        id: 'footer-contact-linkedin',
        type: 'Link',
        props: {
          href: props.linkedinUrl,
          children: 'linkedin',
        },
        className: 'footer-chrome__social-link',
        condition: props.linkedinUrl,
      },
    ],
  }

  // Studio section
  const studioColumn: WidgetSchema = {
    id: 'footer-studio',
    type: 'Flex',
    // No direction/gap props — CSS .footer-chrome__section handles layout
    props: {},
    className: 'footer-chrome__section',
    widgets: [
      {
        id: 'footer-studio-heading',
        type: 'Text',
        props: {
          content: props.studioHeading,
          as: 'h2',
        },
        className: 'footer-chrome__heading',
      },
      {
        id: 'footer-studio-url',
        type: 'Link',
        props: {
          href: props.studioUrl,
          children: props.studioUrlLabel ?? props.studioUrl,
        },
        className: 'footer-chrome__link',
        condition: props.studioUrl,
      },
      {
        id: 'footer-studio-email',
        type: 'Link',
        props: {
          href: `mailto:${props.studioEmail}`,
          children: props.studioEmail,
        },
        className: 'footer-chrome__link',
        condition: props.studioEmail,
      },
      ...(props.studioSocials
        ? [
            {
              id: 'footer-studio-socials',
              type: 'Flex' as const,
              // Gap needed here — no CSS rule for __socials gap
              props: { gap: 8 },
              className: 'footer-chrome__socials',
              widgets: [
                {
                  id: 'footer-studio-social',
                  type: 'Link' as const,
                  __repeat: props.studioSocials,
                  __key: 'platform',
                  props: {
                    href: '{{ item.url }}',
                    children: '{{ item.platform }}',
                  },
                  className: 'footer-chrome__social-link',
                },
              ],
            },
          ]
        : []),
    ],
  }

  // Right column — groups contact + studio for CSS layout
  const rightColumn: WidgetSchema = {
    id: 'footer-right',
    type: 'Flex',
    // No direction/gap props — CSS .footer-chrome__right handles layout
    props: {},
    className: 'footer-chrome__right',
    widgets: [contactColumn, studioColumn],
  }

  const copyrightWidget: WidgetSchema = {
    id: 'footer-copyright',
    type: 'Text',
    props: {
      content: props.copyright,
      as: 'p',
    },
    className: 'footer-chrome__copyright',
  }

  // Build inline style for spacing (CSS custom properties)
  const rootStyle: Record<string, string> = {}
  if (props.paddingTop != null) rootStyle['--footer-padding-top'] = `${props.paddingTop}rem`
  if (props.paddingBottom != null) rootStyle['--footer-padding-bottom'] = `${props.paddingBottom}rem`

  return {
    widgets: [
      {
        id: 'contact-footer',
        type: 'Flex',
        // No direction props — CSS .footer-chrome handles layout
        props: {},
        className: 'footer-chrome',
        ...(Object.keys(rootStyle).length > 0 && { style: rootStyle }),
        widgets: [
          {
            id: 'footer-columns',
            type: 'Flex',
            // No direction/justify/gap props — CSS .footer-chrome__content handles
            // responsive layout (column on mobile, row with space-between on tablet+)
            props: {},
            className: 'footer-chrome__content',
            widgets: [leftColumn, rightColumn].filter(Boolean) as WidgetSchema[],
          },
          copyrightWidget,
        ],
      },
    ],
    layout: {
      maxWidth: 'var(--site-max-width)',
    },
    // Background handled by CSS .footer-chrome → var(--site-outer-bg)
  }
}
