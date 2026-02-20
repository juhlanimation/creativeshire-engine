/**
 * MinimalNav chrome pattern — factory function for header region.
 * Builds a right-aligned navigation bar with nav links, divider, and email.
 *
 * Uses minimal-nav__* CSS classes for layout, typography, and responsive breakpoints.
 * CSS handles flex-direction, gap, and justify — Flex widgets must NOT
 * set props that override those (inline styles beat class styles).
 *
 * Structure:
 * - Flex (.minimal-nav)
 *   - Flex (.minimal-nav__links)
 *     - Link x N (nav items, .minimal-nav__link)
 *   - Box (.minimal-nav__divider)
 *   - Link (.minimal-nav__email)
 */

import type { CSSProperties } from 'react'
import type { PresetRegionConfig } from '../../../../presets/types'
import type { WidgetSchema } from '../../../../schema/widget'
import type { MinimalNavProps } from './types'
import { isBindingExpression } from '../../../sections/patterns/utils'

/**
 * Creates a MinimalNav header region configuration.
 *
 * @param props - Navigation configuration with links and email
 * @returns PresetRegionConfig for the header region
 */
export function createMinimalNavRegion(props: MinimalNavProps): PresetRegionConfig {
  const linkVariant = props.linkHoverStyle === 'underline' ? 'hover-underline' : 'default'

  const navLinkWidgets: WidgetSchema[] = isBindingExpression(props.navLinks)
    ? [
        {
          id: 'nav-link',
          type: 'Link',
          __repeat: props.navLinks,
          __key: 'label',
          props: {
            href: '{{ item.href }}',
            children: '{{ item.label }}',
            variant: linkVariant,
          },
          className: 'minimal-nav__link',
        },
      ]
    : (props.navLinks ?? []).map((link, index) => ({
        id: `nav-link-${index}`,
        type: 'Link',
        props: {
          href: link.href,
          children: link.label,
          variant: linkVariant,
        },
        className: 'minimal-nav__link',
      }))

  const widgets: WidgetSchema[] = [
    {
      id: 'nav-links',
      type: 'Flex',
      // No direction/gap props — CSS .minimal-nav__links handles layout
      props: {},
      className: 'minimal-nav__links',
      widgets: navLinkWidgets,
    },
    {
      id: 'nav-divider',
      type: 'Box',
      props: {},
      className: 'minimal-nav__divider',
      widgets: [],
    },
    {
      id: 'nav-email',
      type: 'Link',
      props: {
        href: `mailto:${props.email}`,
        children: props.email,
        variant: 'default',
      },
      className: 'minimal-nav__email',
    },
  ]

  const hoverClass =
    props.linkHoverStyle === 'underline' ? ' minimal-nav--hover-underline' : ''

  const style: CSSProperties | undefined =
    props.blendMode && props.blendMode !== 'normal'
      ? { mixBlendMode: props.blendMode }
      : undefined

  return {
    overlay: true,
    style,
    layout: {
      justify: 'end',
      align: 'center',
      padding: 'var(--spacing-md, 1.25rem) var(--spacing-lg, 2rem)',
    },
    widgets: [
      {
        id: 'minimal-nav',
        type: 'Flex',
        // No direction/align/justify/gap props — CSS .minimal-nav handles layout
        props: {},
        className: `minimal-nav${hoverClass}`,
        widgets,
      },
    ],
  }
}
