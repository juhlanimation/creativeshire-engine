/**
 * BrandFooter chrome pattern — factory function for footer region.
 * Builds a responsive 3-column footer: nav links | brand + copyright | contact.
 *
 * Mobile: stacked column (brand first, then nav, then contact).
 * Desktop: horizontal row with nav left, brand center (flex-1), contact right.
 *
 * Structure:
 * - Flex (.brand-footer) — responsive direction via CSS
 *   - Flex (.brand-footer__nav) — nav links column
 *     - Link x N (nav items via __repeat)
 *   - Flex (.brand-footer__brand) — brand + copyright, always centered
 *     - Text (brand name, h2)
 *     - Text (copyright, xs)
 *   - Flex (.brand-footer__contact) — contact details column
 *     - Link (email mailto)
 *     - Link (phone tel) [conditional]
 *     - Text (address) [conditional]
 */

import type { PresetRegionConfig } from '../../../../presets/types'
import type { WidgetSchema } from '../../../../schema/widget'
import { applyMetaDefaults } from '../../../../schema/settings'
import type { BrandFooterProps } from './types'
import { meta } from './meta'

/**
 * Creates a BrandFooter region configuration.
 *
 * @param props - Footer configuration with brand, nav, and contact info
 * @returns PresetRegionConfig for the footer region
 */
export function createBrandFooterRegion(rawProps: BrandFooterProps): PresetRegionConfig {
  const props = applyMetaDefaults(meta, rawProps)
  // ── Nav column (left on desktop) ────────────────────────────
  // navLinks can be a binding expression (string) for platform resolution,
  // or a direct array for Storybook/preview rendering.
  const navLinks = props.navLinks as string | Array<{ href: string; label: string }> | undefined

  let navWidgets: WidgetSchema[] | null = null

  if (typeof navLinks === 'string') {
    // Binding expression → single widget with __repeat for platform expansion
    navWidgets = [
      {
        id: 'footer-nav-link',
        type: 'Link',
        __repeat: navLinks,
        __key: 'label',
        props: {
          href: '{{ item.href }}',
          children: '{{ item.label }}',
        },
      },
    ]
  } else if (Array.isArray(navLinks) && navLinks.length > 0) {
    // Direct array (Storybook/preview) → individual Link widgets
    navWidgets = navLinks.map((link, i) => ({
      id: `footer-nav-link-${i}`,
      type: 'Link',
      props: {
        href: link.href,
        children: link.label,
      },
    }))
  }

  const navColumn: WidgetSchema | null = navWidgets
    ? {
        id: 'footer-nav',
        type: 'Flex',
        props: {
          direction: 'column',
          gap: 'var(--spacing-xs, 0.25rem)',
        },
        className: 'brand-footer__nav',
        widgets: navWidgets,
      }
    : null

  // ── Brand column (center) ───────────────────────────────────
  const brandColumn: WidgetSchema = {
    id: 'footer-brand',
    type: 'Flex',
    props: {
      direction: 'column',
      align: 'center',
      gap: 'var(--spacing-sm, 0.5rem)',
    },
    className: 'brand-footer__brand',
    widgets: [
      {
        id: 'footer-brand-name',
        type: 'Text',
        props: {
          content: props.brandName,
          as: 'h2',
          textTransform: 'uppercase',
          fontWeight: '700',
          letterSpacing: '0.05em',
        },
      },
      {
        id: 'footer-copyright',
        type: 'Text',
        props: {
          content: props.copyright,
          as: 'xs',
        },
        style: {
          opacity: 0.6,
        },
      },
    ],
  }

  // ── Contact column (right on desktop) ───────────────────────
  const contactWidgets: WidgetSchema[] = [
    {
      id: 'footer-email',
      type: 'Link',
      props: {
        href: `mailto:${props.email}`,
        children: props.email,
      },
    },
  ]

  if (props.phone) {
    contactWidgets.push({
      id: 'footer-phone',
      type: 'Link',
      props: {
        href: `tel:${props.phone}`,
        children: props.phoneDisplay || props.phone,
      },
    })
  }

  if (props.address) {
    contactWidgets.push({
      id: 'footer-address',
      type: 'Text',
      props: {
        content: props.address,
        as: 'xs',
      },
    })
  }

  const contactColumn: WidgetSchema = {
    id: 'footer-contact',
    type: 'Flex',
    props: {
      direction: 'column',
      gap: 'var(--spacing-xs, 0.25rem)',
    },
    className: 'brand-footer__contact',
    widgets: contactWidgets,
  }

  // Build inline style for spacing (CSS custom properties)
  const rootStyle: Record<string, string> = {}
  if (props.paddingTop != null) rootStyle['--footer-padding-top'] = `${props.paddingTop}rem`
  if (props.paddingBottom != null) rootStyle['--footer-padding-bottom'] = `${props.paddingBottom}rem`

  // ── Root: 3-column responsive layout ────────────────────────
  return {
    widgets: [
      {
        id: 'brand-footer',
        type: 'Flex',
        className: 'brand-footer',
        ...(Object.keys(rootStyle).length > 0 && { style: rootStyle }),
        // No direction/align/justify — CSS handles responsive switching
        widgets: [
          ...(navColumn ? [navColumn] : []),
          brandColumn,
          contactColumn,
        ],
      },
    ],
    layout: {
      maxWidth: 'var(--site-max-width)',
    },
  }
}
