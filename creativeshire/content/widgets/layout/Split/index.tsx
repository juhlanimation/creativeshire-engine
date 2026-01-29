'use client'

/**
 * Split layout widget - two-column split layout.
 * Content Layer (L1) - no scroll listeners or viewport units.
 *
 * Useful for hero sections, sidebars, and content/media layouts.
 */

import React, { memo, forwardRef, type CSSProperties } from 'react'
import type { SplitProps, SplitRatio } from './types'
import './styles.css'

/**
 * Converts ratio to CSS grid template.
 */
function ratioToTemplate(ratio: SplitRatio | string | undefined): string {
  if (!ratio) return '1fr 1fr'

  // Handle predefined ratios
  const ratioMap: Record<SplitRatio, string> = {
    '1:1': '1fr 1fr',
    '2:1': '2fr 1fr',
    '1:2': '1fr 2fr',
    '3:1': '3fr 1fr',
    '1:3': '1fr 3fr',
    '3:2': '3fr 2fr',
    '2:3': '2fr 3fr',
  }

  // Check if it's a predefined ratio
  if (ratio in ratioMap) {
    return ratioMap[ratio as SplitRatio]
  }

  // Otherwise, assume it's a custom grid template
  return ratio
}

/**
 * Converts gap value to CSS.
 */
function toCssGap(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

/**
 * Maps split props to CSS properties.
 */
function splitToStyle(props: SplitProps): CSSProperties {
  const styles: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: ratioToTemplate(props.ratio),
    ...props.style,
  }

  if (props.gap !== undefined) {
    styles.gap = toCssGap(props.gap)
  }

  if (props.align) {
    const alignMap: Record<string, string> = {
      start: 'start',
      center: 'center',
      end: 'end',
      stretch: 'stretch',
    }
    styles.alignItems = alignMap[props.align]
  }

  if (props.reverse) {
    styles.direction = 'rtl'
  }

  return styles
}

/**
 * Split layout component for two-column layouts.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 */
const Split = memo(forwardRef<HTMLDivElement, SplitProps>(function Split(
  {
    id,
    ratio,
    gap,
    reverse,
    align,
    style,
    className,
    'data-behaviour': dataBehaviour,
    'data-effect': dataEffect,
    children
  },
  ref
) {
  const computedStyle = splitToStyle({ ratio, gap, reverse, align, style })

  return (
    <div
      ref={ref}
      id={id}
      className={className ? `split-widget ${className}` : 'split-widget'}
      style={computedStyle}
      data-behaviour={dataBehaviour}
      data-effect={dataEffect}
    >
      {children}
    </div>
  )
}))

export default Split
