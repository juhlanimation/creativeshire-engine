'use client'

/**
 * Stack layout widget - arranges children vertically.
 * Content Layer (L1) - no scroll listeners or viewport units.
 *
 * Shorthand for Flex with direction='column'.
 */

import React, { memo, forwardRef, type CSSProperties } from 'react'
import { WidgetRenderer } from '../../../../renderer/WidgetRenderer'
import { ALIGN_MAP, toCssGap } from '../utils'
import type { StackProps } from './types'
import './styles.css'

/**
 * Maps stack props to CSS properties.
 */
function stackToStyle(props: StackProps): CSSProperties {
  const styles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    ...props.style,
  }

  if (props.align) {
    styles.alignItems = ALIGN_MAP[props.align]
  }

  if (props.gap !== undefined) {
    styles.gap = toCssGap(props.gap)
  }

  return styles
}

/**
 * Stack layout component arranges children vertically.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 */
const Stack = memo(forwardRef<HTMLDivElement, StackProps>(function Stack(
  {
    id,
    gap,
    align,
    style,
    className,
    'data-behaviour': dataBehaviour,
    'data-effect': dataEffect,
    widgets
  },
  ref
) {
  const computedStyle = stackToStyle({ gap, align, style })

  return (
    <div
      ref={ref}
      id={id}
      className={className ? `stack-widget ${className}` : 'stack-widget'}
      style={computedStyle}
      data-behaviour={dataBehaviour}
      data-effect={dataEffect}
    >
      {widgets?.map((widget, index) => (
        <WidgetRenderer key={widget.id ?? index} widget={widget} />
      ))}
    </div>
  )
}))

export default Stack
