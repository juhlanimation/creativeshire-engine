/**
 * HeroImage pattern - full-viewport background image hero.
 *
 * Structure:
 * - Image (background, absolute positioned, object-cover)
 * - Optional dark overlay
 * - Optional scroll arrow SVG (bottom center)
 *
 * Parallax via scroll/progress behaviour → CSS transform on image.
 */

import type { CSSProperties } from 'react'
import type { SectionSchema, WidgetSchema } from '../../../../schema'
import { applyMetaDefaults } from '../../../../schema/settings'
import type { HeroImageProps } from './types'
import { meta } from './meta'

export function createHeroImageSection(rawProps?: HeroImageProps): SectionSchema {
  const p = applyMetaDefaults(meta, rawProps ?? {})

  // Content bindings
  const imageSrc = rawProps?.imageSrc ?? '{{ content.hero.imageSrc }}'
  const imageAlt = rawProps?.imageAlt ?? '{{ content.hero.imageAlt }}'

  // Settings
  const showScrollArrow = p.showScrollArrow as boolean
  const parallaxRate = p.parallaxRate as number
  const overlayOpacity = p.overlayOpacity as number

  const widgets: WidgetSchema[] = [
    // Background image
    {
      id: 'hero-bg-image',
      type: 'Image',
      props: {
        src: imageSrc,
        alt: imageAlt,
      },
      className: 'section-hero-image__bg',
    },
  ]

  // Scroll arrow — CSS-drawn line with chevron tip (matches Figma Group 50)
  if (showScrollArrow) {
    widgets.push({
      id: 'hero-scroll-arrow',
      type: 'Box',
      props: {},
      className: 'section-hero-image__scroll-arrow',
      widgets: [],
    })
  }

  const sectionStyle: CSSProperties = {
    '--parallax-rate': parallaxRate,
    '--hero-overlay-color': `rgba(0, 0, 0, ${overlayOpacity})`,
    ...p.style,
  } as CSSProperties

  return {
    id: p.id ?? 'hero',
    patternId: 'HeroImage',
    label: p.label ?? 'Hero',
    constrained: false,
    colorMode: p.colorMode ?? 'dark',
    sectionTheme: p.sectionTheme,
    layout: { type: 'stack', direction: 'column', align: 'center' },
    style: sectionStyle,
    className: p.className,
    paddingTop: p.paddingTop,
    paddingBottom: p.paddingBottom,
    paddingLeft: p.paddingLeft,
    paddingRight: p.paddingRight,
    sectionHeight: p.sectionHeight ?? 'viewport-fixed',
    widgets,
  }
}
