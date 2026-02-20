'use client'

/**
 * Base Section component.
 * Renders a semantic <section> container with layout configuration.
 *
 * Sections are Content Layer (L1) components - they render static structure.
 * Animation and viewport sizing are handled by BehaviourWrapper in L2.
 */

import type { ReactNode } from 'react'
import type { SectionProps, LayoutConfig } from './types'
import { toCssGap, toCssPadding } from '../widgets/layout/utils'

/**
 * Computes inline styles from layout configuration.
 * Only returns styles that cannot be handled via data attributes.
 */
function getLayoutStyles(layout: LayoutConfig, style?: React.CSSProperties): React.CSSProperties {
  const styles: React.CSSProperties = {
    ...style,
  }

  // Gap: supports numbers, raw strings, and layout preset names
  if (layout.gap !== undefined) {
    styles.gap = toCssGap(layout.gap, layout.gapScale)
  }

  // Padding: supports layout preset names and raw CSS strings
  if (layout.padding !== undefined) {
    styles.padding = toCssPadding(layout.padding, layout.paddingScale)
  }

  // Grid-specific styles
  if (layout.type === 'grid') {
    if (layout.columns !== undefined) {
      styles.gridTemplateColumns = `repeat(${layout.columns}, 1fr)`
    }
    if (layout.rows !== undefined) {
      styles.gridTemplateRows = `repeat(${layout.rows}, 1fr)`
    }
  }

  return styles
}

/**
 * Section component - renders a semantic container for widgets.
 *
 * @param props - Section schema properties
 * @returns A section element with layout and style applied
 */
export default function Section({
  id,
  layout,
  style,
  className,
  constrained,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  sectionHeight,
  children,
}: SectionProps): ReactNode {
  // Theme baseline: paint background + text color from CSS variables.
  // Inline styles ensure these are in SSR HTML (zero FOUC) and override
  // any CSS loading-order issues in Storybook HMR.
  // Section-specific `style` overrides these defaults via spread order.
  // Container settings (padding, sectionHeight) override factory styles last.
  const computedStyle: React.CSSProperties = {
    backgroundColor: 'var(--site-outer-bg)',
    color: 'var(--text-primary)',
    ...getLayoutStyles(layout, style),
    ...(paddingTop ? { paddingTop: `${paddingTop}px` } : undefined),
    ...(paddingBottom ? { paddingBottom: `${paddingBottom}px` } : undefined),
    ...(paddingLeft ? { paddingLeft: `${paddingLeft}px` } : undefined),
    ...(paddingRight ? { paddingRight: `${paddingRight}px` } : undefined),
    ...(sectionHeight === 'viewport' && { minHeight: 'var(--viewport-height, 100dvh)' }),
    ...(sectionHeight === 'viewport-fixed' && { height: 'var(--viewport-height, 100dvh)', overflow: 'hidden' }),
  }
  const computedClassName = className ? `section ${className}` : 'section'

  return (
    <section
      id={id}
      className={computedClassName}
      data-layout={layout.type}
      data-direction={layout.direction}
      data-align={layout.align}
      data-justify={layout.justify}
      data-constrained={constrained ? '' : undefined}
      style={computedStyle}
    >
      {children}
    </section>
  )
}
