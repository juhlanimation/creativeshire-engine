/**
 * GlassNav chrome pattern — factory function for header region.
 * Fixed transparent header that transitions to frosted glass on scroll.
 *
 * Structure:
 * - Flex (.glass-nav, style: CSS custom properties)
 *   - Box (.glass-nav__brand)
 *     - Image? (logo)
 *   - Flex (.glass-nav__links)
 *     - Link x N (nav links)
 *
 * Glass effect wired via data-effect="glass" and scroll/glass behaviour.
 * forceOpaque mode sets full-strength glass immediately (for non-hero pages).
 */

import type { CSSProperties } from 'react'
import type { PresetRegionConfig } from '../../../../presets/types'
import type { WidgetSchema } from '../../../../schema/widget'
import type { GlassNavProps } from './types'

export function createGlassNavRegion(props?: GlassNavProps): PresetRegionConfig {
  const logoSrc = props?.logoSrc ?? '{{ content.chrome.logoSrc }}'
  const logoAlt = props?.logoAlt ?? '{{ content.chrome.logoAlt }}'
  const navLinks = props?.navLinks ?? []
  const forceOpaque = props?.forceOpaque ?? false
  const glassBgOpacity = props?.glassBgOpacity ?? 0.85
  const blurStrength = props?.blurStrength ?? 12

  // Brand section
  const brandWidgets: WidgetSchema[] = []
  if (logoSrc) {
    brandWidgets.push({
      id: 'glass-nav-logo',
      type: 'Image',
      props: {
        src: logoSrc,
        alt: logoAlt ?? 'Logo',
      },
      className: 'glass-nav__logo',
    })
  }

  // Nav links — Figma: 14px with 30px gap between links
  const navLinkWidgets: WidgetSchema[] = navLinks.map((link, i) => ({
    id: `glass-nav-link-${i}`,
    type: 'Link',
    props: {
      href: link.href,
      children: link.label,
    },
    className: 'glass-nav__link',
  }))

  // Style: set glass CSS custom properties
  const navStyle: CSSProperties = {
    ...(forceOpaque && {
      '--glass-opacity': glassBgOpacity,
      '--glass-blur': `${blurStrength}px`,
    }),
  } as CSSProperties

  return {
    overlay: props?.overlay ?? true,
    layout: {
      justify: 'between',
      align: 'center',
      padding: 'var(--spacing-md, 1rem) var(--spacing-lg, 2rem)',
      ...props?.layout,
    },
    widgets: [
      {
        id: 'glass-nav',
        type: 'Flex',
        props: {},
        className: 'glass-nav',
        style: navStyle,
        'data-effect': 'glass',
        widgets: [
          {
            id: 'glass-nav-brand',
            type: 'Box',
            props: {},
            className: 'glass-nav__brand',
            widgets: brandWidgets,
          },
          {
            id: 'glass-nav-links',
            type: 'Flex',
            props: {},
            className: 'glass-nav__links',
            widgets: navLinkWidgets,
          },
        ],
      },
    ],
    ...(props?.style && { style: props.style }),
  }
}
