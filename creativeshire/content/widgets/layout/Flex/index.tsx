'use client'

/**
 * Flex layout widget - arranges children with flexbox.
 * Content Layer (L1) - no scroll listeners or viewport units.
 */

import React, { memo, forwardRef, type CSSProperties } from 'react'
import { WidgetRenderer } from '@/creativeshire/renderer/WidgetRenderer'
import type { FlexProps } from './types'
import './styles.css'

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
    const alignMap: Record<string, string> = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      stretch: 'stretch',
    }
    styles.alignItems = alignMap[props.align]
  }

  if (props.justify) {
    const justifyMap: Record<string, string> = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      between: 'space-between',
      around: 'space-around',
    }
    styles.justifyContent = justifyMap[props.justify]
  }

  if (props.wrap) {
    styles.flexWrap = 'wrap'
  }

  if (props.gap !== undefined) {
    styles.gap = typeof props.gap === 'number' ? `${props.gap}px` : props.gap
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
    style,
    className,
    'data-behaviour': dataBehaviour,
    'data-effect': dataEffect,
    'data-marquee-track': dataMarqueeTrack,
    widgets
  },
  ref
) {
  // Only pass direction if explicitly provided - allows CSS to control responsive direction
  const computedStyle = flexToStyle({ direction, align, justify, wrap, gap, style })

  return (
    <div
      ref={ref}
      id={id}
      className={className ? `flex-widget ${className}` : 'flex-widget'}
      style={computedStyle}
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

export default Flex
