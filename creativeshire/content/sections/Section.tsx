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
import { ALIGN_MAP, JUSTIFY_MAP } from './types'
import './styles.css'

/**
 * Computes inline styles from layout configuration.
 * Only returns styles that cannot be handled via data attributes.
 */
function getLayoutStyles(layout: LayoutConfig): React.CSSProperties {
  const styles: React.CSSProperties = {}

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
 * Computes inline styles from feature configuration.
 */
function getFeatureStyles(features: SectionProps['features']): React.CSSProperties {
  if (!features) return {}

  const styles: React.CSSProperties = {}

  // Spacing features
  if (features.spacing) {
    if (features.spacing.margin) styles.margin = features.spacing.margin
    if (features.spacing.padding) styles.padding = features.spacing.padding
  }

  // Background features
  if (features.background) {
    if (features.background.color) styles.backgroundColor = features.background.color
    if (features.background.image) styles.backgroundImage = `url(${features.background.image})`
    if (features.background.gradient) styles.backgroundImage = features.background.gradient
  }

  // Border features
  if (features.border) {
    if (features.border.width) styles.borderWidth = features.border.width
    if (features.border.color) styles.borderColor = features.border.color
    if (features.border.radius) styles.borderRadius = features.border.radius
  }

  return styles
}

/**
 * Section component - renders a semantic container for widgets.
 *
 * @param props - Section schema properties
 * @returns A section element with layout and feature styles applied
 */
export default function Section({
  id,
  layout,
  features,
  widgets,
}: SectionProps): ReactNode {
  const layoutStyles = getLayoutStyles(layout)
  const featureStyles = getFeatureStyles(features)
  const combinedStyles = { ...layoutStyles, ...featureStyles }

  return (
    <section
      id={id}
      className="section"
      data-layout={layout.type}
      data-direction={layout.direction}
      data-align={layout.align}
      data-justify={layout.justify}
      style={Object.keys(combinedStyles).length > 0 ? combinedStyles : undefined}
    >
      {widgets.length > 0 ? (
        widgets.map((widget, index) => (
          <div key={widget.id ?? `widget-${index}`} data-widget-id={widget.id}>
            {/* Widget rendering delegated to WidgetRenderer */}
            {/* Placeholder for widget content */}
          </div>
        ))
      ) : null}
    </section>
  )
}
