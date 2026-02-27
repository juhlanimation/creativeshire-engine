'use client'

/**
 * Container layout widget - max-width wrapper.
 * Content Layer (L1) - no scroll listeners or viewport units.
 *
 * Constrains content width and optionally centers horizontally.
 */

import React, { memo, forwardRef, type CSSProperties } from 'react'
import { useWidgetRenderer } from '../../../../renderer/WidgetRendererContext'
import { toCssPadding, toCssValue } from '../utils'
import type { ContainerProps } from './types'

/**
 * Maps container props to CSS properties.
 */
function containerToStyle(props: ContainerProps): CSSProperties {
  const styles: CSSProperties = {
    ...props.style,
  }

  if (props.maxWidth !== undefined) {
    styles.maxWidth = toCssValue(props.maxWidth)
  }

  if (props.padding !== undefined) {
    styles.paddingLeft = toCssPadding(props.padding)
    styles.paddingRight = toCssPadding(props.padding)
  }

  if (props.center) {
    styles.marginLeft = 'auto'
    styles.marginRight = 'auto'
  }

  return styles
}

/**
 * Container layout component constrains content width.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 */
const Container = memo(forwardRef<HTMLDivElement, ContainerProps>(function Container(
  {
    id,
    maxWidth,
    padding,
    center = true,
    style,
    className,
    'data-behaviour': dataBehaviour,
    'data-effect': dataEffect,
    widgets
  },
  ref
) {
  const WidgetRenderer = useWidgetRenderer()
  const computedStyle = containerToStyle({ maxWidth, padding, center, style })

  return (
    <div
      ref={ref}
      id={id}
      className={className ? `container-widget ${className}` : 'container-widget'}
      style={Object.keys(computedStyle).length > 0 ? computedStyle : undefined}
      data-behaviour={dataBehaviour}
      data-effect={dataEffect}
    >
      {widgets?.map((widget, index) => (
        <WidgetRenderer key={widget.id ?? index} widget={widget} />
      ))}
    </div>
  )
}))

export default Container
