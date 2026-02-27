'use client'

/**
 * Flex layout widget - arranges children with flexbox.
 * Content Layer (L1) - no scroll listeners or viewport units.
 */

import React, { memo, forwardRef, useRef, useImperativeHandle, type CSSProperties } from 'react'
import { useWidgetRenderer } from '../../../../renderer/WidgetRendererContext'
import { ALIGN_MAP, JUSTIFY_MAP, toCssGap } from '../utils'
import type { FlexProps } from './types'

/**
 * Maps flex props to CSS properties.
 */
function flexToStyle(props: FlexProps): CSSProperties {
  const styles: CSSProperties = {
    display: 'flex',
    ...props.style,
  }

  if (props.direction) {
    styles.flexDirection = props.direction
  }

  if (props.align) {
    styles.alignItems = ALIGN_MAP[props.align]
  }

  if (props.justify) {
    styles.justifyContent = JUSTIFY_MAP[props.justify]
  }

  if (props.wrap) {
    styles.flexWrap = 'wrap'
  }

  if (props.gap !== undefined) {
    styles.gap = toCssGap(props.gap, props.gapScale)
  }

  return styles
}

/**
 * Flex layout component arranges children with flexbox.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 */
const Flex = memo(forwardRef<HTMLDivElement, FlexProps>(function Flex(
  {
    id,
    direction,
    align,
    justify,
    wrap,
    gap,
    gapScale,
    style,
    className,
    'data-behaviour': dataBehaviour,
    'data-effect': dataEffect,
    'data-index': dataIndex,
    'data-reversed': dataReversedProp,
    widgets
  },
  forwardedRef
) {
  const WidgetRenderer = useWidgetRenderer()
  // Internal ref for computing data-reversed
  const internalRef = useRef<HTMLDivElement>(null)

  // Merge forwarded ref with internal ref
  useImperativeHandle(forwardedRef, () => internalRef.current!, [])

  // Compute data-reversed: explicit prop takes priority, otherwise compute from data-index
  // Odd indices (1, 3, 5...) are reversed for alternating layout
  const computedReversed = (() => {
    // Explicit prop takes priority
    if (dataReversedProp !== undefined) {
      return dataReversedProp === true || dataReversedProp === 'true'
    }
    // Compute from data-index if available
    if (dataIndex !== undefined) {
      const index = typeof dataIndex === 'number' ? dataIndex : parseInt(dataIndex, 10)
      if (!isNaN(index)) {
        return index % 2 === 1
      }
    }
    return undefined
  })()

  // Only pass direction if explicitly provided - allows CSS to control responsive direction
  const computedStyle = flexToStyle({ direction, align, justify, wrap, gap, gapScale, style })

  return (
    <div
      ref={internalRef}
      id={id}
      className={className ? `flex-widget ${className}` : 'flex-widget'}
      style={computedStyle}
      data-behaviour={dataBehaviour}
      data-effect={dataEffect}
      data-index={dataIndex !== undefined ? String(dataIndex) : undefined}
      data-reversed={computedReversed !== undefined ? String(computedReversed) : undefined}
    >
      {widgets?.map((widget, index) => (
        <WidgetRenderer key={widget.id ?? index} widget={widget} />
      ))}
    </div>
  )
}))

export default Flex
