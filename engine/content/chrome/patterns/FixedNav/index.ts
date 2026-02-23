/**
 * FixedNav chrome pattern — factory function for header region.
 * Builds a navigation bar with brand (logo + title) and nav links.
 *
 * Uses header-chrome__* CSS classes for layout, typography, and responsive breakpoints.
 * CSS handles flex-direction, gap, and justify — Flex widgets must NOT
 * set props that override those (inline styles beat class styles).
 *
 * Structure:
 * - Flex (.header-chrome, style: --header-background, --header-color)
 *   - Box (.header-chrome__brand)
 *     - Image? (logo, conditional)
 *     - Link (href: '/', children: siteTitle, .header-chrome__title)
 *   - Flex (.header-chrome__nav)
 *     - Link x N (navLinks, .header-chrome__nav-link)
 */

import type { CSSProperties } from 'react'
import type { PresetRegionConfig } from '../../../../presets/types'
import type { WidgetSchema } from '../../../../schema/widget'
import type { FixedNavProps } from './types'

/**
 * Creates a FixedNav header region configuration.
 *
 * @param props - Header configuration with site title, nav links, and styling
 * @returns PresetRegionConfig for the header region
 */
export function createFixedNavRegion(props: FixedNavProps): PresetRegionConfig {
  const background = props.background ?? 'rgba(255, 255, 255, 0.95)'
  const color = props.color ?? '#000000'

  // Brand section: logo + title
  const brandWidgets: WidgetSchema[] = []

  if (props.logo) {
    brandWidgets.push({
      id: 'header-logo',
      type: 'Image',
      props: {
        src: props.logo,
        alt: '',
      },
      className: 'header-chrome__logo',
    })
  }

  if (props.siteTitle) {
    brandWidgets.push({
      id: 'header-title',
      type: 'Link',
      props: {
        href: '/',
        children: props.siteTitle,
        variant: 'default',
      },
      className: 'header-chrome__title',
    })
  }

  // Nav links
  const navLinkWidgets: WidgetSchema[] = (props.navLinks ?? []).map((link, index) => ({
    id: `header-nav-link-${index}`,
    type: 'Link',
    props: {
      href: link.href,
      children: link.label,
    },
    className: 'header-chrome__nav-link',
  }))

  return {
    overlay: true,
    layout: {
      justify: 'between',
      align: 'center',
      padding: 'var(--spacing-md, 1rem) var(--spacing-lg, 2rem)',
    },
    widgets: [
      {
        id: 'fixed-nav',
        type: 'Flex',
        // No direction/align/justify props — CSS .header-chrome handles layout
        props: {},
        className: 'header-chrome',
        style: {
          '--header-background': background,
          '--header-color': color,
        } as CSSProperties,
        widgets: [
          {
            id: 'header-brand',
            type: 'Box',
            props: {},
            className: 'header-chrome__brand',
            widgets: brandWidgets,
          },
          {
            id: 'header-nav',
            type: 'Flex',
            // No direction/gap props — CSS .header-chrome__nav handles layout
            props: {},
            className: 'header-chrome__nav',
            widgets: navLinkWidgets,
          },
        ],
      },
    ],
  }
}
