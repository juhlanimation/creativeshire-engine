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
import './styles.css'

/**
 * Computes inline styles from layout configuration.
 * Only returns styles that cannot be handled via data attributes.
 */
function getLayoutStyles(layout: LayoutConfig, style?: React.CSSProperties): React.CSSProperties {
  const styles: React.CSSProperties = {
    ...style,
  }

  // Gap can be number or string
  if (layout.gap !== undefined) {
    styles.gap = typeof layout.gap === 'number' ? `${layout.gap}px` : layout.gap
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
  children,
}: SectionProps): ReactNode {
  const computedStyle = getLayoutStyles(layout, style)
  const computedClassName = className ? `section ${className}` : 'section'

  return (
    <section
      id={id}
      className={computedClassName}
      data-layout={layout.type}
      data-direction={layout.direction}
      data-align={layout.align}
      data-justify={layout.justify}
      style={Object.keys(computedStyle).length > 0 ? computedStyle : undefined}
    >
      {children}
    </section>
  )
}
