'use client'

/**
 * Text widget - renders text content with CSS variable support.
 * Content Layer (L1) - no scroll listeners or viewport units.
 */

import React, { memo, forwardRef, type CSSProperties } from 'react'
import type { TextProps } from './types'
import './styles.css'

/**
 * Maps feature set to CSS properties.
 */
function featuresToStyle(features?: TextProps['features']): CSSProperties {
  if (!features) return {}

  const styles: CSSProperties = {}

  if (features.spacing) {
    if (features.spacing.margin) styles.margin = features.spacing.margin as string
    if (features.spacing.padding) styles.padding = features.spacing.padding as string
  }

  if (features.typography) {
    if (features.typography.size) {
      // Map size tokens to CSS values
      const sizeMap: Record<string, string> = {
        xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem',
        xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem',
        '5xl': '3rem', '6xl': '3.75rem'
      }
      styles.fontSize = sizeMap[features.typography.size] || features.typography.size
    }
    if (features.typography.weight) {
      const weightMap: Record<string, number> = {
        normal: 400, medium: 500, semibold: 600, bold: 700
      }
      styles.fontWeight = weightMap[features.typography.weight] || 400
    }
    if (features.typography.color) styles.color = features.typography.color
    if (features.typography.align) styles.textAlign = features.typography.align
  }

  return styles
}

/**
 * Text component renders text content.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 */
const Text = memo(forwardRef<HTMLElement, TextProps>(function Text(
  { content, as: Element = 'p', features, className, 'data-behaviour': dataBehaviour },
  ref
) {
  const styles = featuresToStyle(features)

  return (
    <Element
      // Dynamic element type requires ref cast for polymorphic components
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as React.Ref<any>}
      className={className ? `text-widget ${className}` : 'text-widget'}
      style={Object.keys(styles).length > 0 ? styles : undefined}
      data-behaviour={dataBehaviour}
    >
      {content}
    </Element>
  )
}))

export default Text
