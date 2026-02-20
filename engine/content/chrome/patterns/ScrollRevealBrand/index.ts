/**
 * ScrollRevealBrand chrome pattern — factory function for a scroll-reveal brand logo.
 * Creates a Text widget with scroll-driven clip-path reveal and vertical tracking.
 * Driven by CSS variables from scroll/cover-progress behaviour.
 *
 * Usage:
 * ```typescript
 * import { createScrollRevealBrandWidget } from '../../content/chrome/patterns/ScrollRevealBrand'
 *
 * header: {
 *   widgets: [
 *     createScrollRevealBrandWidget({ brandName: '{{ content.header.brandName }}' }),
 *   ],
 * }
 * ```
 */

import type { WidgetSchema } from '../../../../schema'
import type { PresetRegionConfig } from '../../../../presets/types'
import type { ScrollRevealBrandProps } from './types'

/**
 * Creates a ScrollRevealBrand widget schema.
 * Returns a Text widget with the `scroll-reveal-brand` class for CSS-driven animation.
 *
 * @param props - Brand name and optional CSS variable overrides
 * @returns WidgetSchema for the scroll-reveal brand logo
 */
export function createScrollRevealBrandWidget(props: ScrollRevealBrandProps): WidgetSchema {
  const style: Record<string, string> = {}

  if (props.progressVar && props.progressVar !== '--hero-cover-progress') {
    style['--scroll-reveal-progress-var'] = `var(${props.progressVar})`
  }
  if (props.contentEdgeVar && props.contentEdgeVar !== '--hero-content-edge') {
    style['--scroll-reveal-edge-var'] = `var(${props.contentEdgeVar})`
  }

  return {
    id: 'brand-logo',
    type: 'Text',
    props: { content: props.brandName, as: 'div' },
    className: 'scroll-reveal-brand',
    ...(Object.keys(style).length > 0 && { style }),
  }
}

/**
 * Creates a ScrollRevealBrand header region.
 * Wraps the widget in a region config for standalone use as a full header.
 *
 * @param props - Brand name and optional CSS variable overrides
 * @returns PresetRegionConfig with the scroll-reveal brand widget
 */
export function createScrollRevealBrandRegion(props: ScrollRevealBrandProps): PresetRegionConfig {
  return {
    overlay: true,
    style: { mixBlendMode: 'difference' },
    layout: {
      align: 'start',
      padding: '1.5rem 2rem',
    },
    widgets: [createScrollRevealBrandWidget(props)],
  }
}
