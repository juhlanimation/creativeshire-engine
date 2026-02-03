'use client'

/**
 * Box layout widget - generic container for layout styling.
 * Content Layer (L1) - no scroll listeners or viewport units.
 */

import React, { memo, forwardRef, type CSSProperties } from 'react'
import { WidgetRenderer } from '../../../../renderer/WidgetRenderer'
import type { BoxProps } from './types'
import './styles.css'

/**
 * Converts number or string to CSS value.
 */
function toCssValue(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

/**
 * Maps box props to CSS properties.
 */
function boxToStyle(props: BoxProps): CSSProperties {
  const styles: CSSProperties = {
    ...props.style,
  }

  if (props.width !== undefined) styles.width = toCssValue(props.width)
  if (props.height !== undefined) styles.height = toCssValue(props.height)
  if (props.minWidth !== undefined) styles.minWidth = toCssValue(props.minWidth)
  if (props.maxWidth !== undefined) styles.maxWidth = toCssValue(props.maxWidth)
  if (props.flexGrow !== undefined) styles.flexGrow = props.flexGrow
  if (props.flexShrink !== undefined) styles.flexShrink = props.flexShrink

  return styles
}

/**
 * Box component is a generic container for layout styling.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 */
const Box = memo(forwardRef<HTMLDivElement, BoxProps>(function Box(
  {
    id,
    width,
    height,
    minWidth,
    maxWidth,
    flexGrow,
    flexShrink,
    style,
    className,
    'data-behaviour': dataBehaviour,
    'data-effect': dataEffect,
    'data-marquee-track': dataMarqueeTrack,
    widgets
  },
  ref
) {
  const computedStyle = boxToStyle({ width, height, minWidth, maxWidth, flexGrow, flexShrink, style })

  return (
    <div
      ref={ref}
      id={id}
      className={className ? `box-widget ${className}` : 'box-widget'}
      style={Object.keys(computedStyle).length > 0 ? computedStyle : undefined}
      data-behaviour={dataBehaviour}
      data-effect={dataEffect}
      data-marquee-track={dataMarqueeTrack ? '' : undefined}
    >
      {widgets?.map((widget, index) => (
        <WidgetRenderer key={widget.id ?? index} widget={widget} />
      ))}
    </div>
  )
}))

export default Box
