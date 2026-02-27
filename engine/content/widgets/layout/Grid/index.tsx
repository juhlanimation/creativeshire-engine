'use client'

/**
 * Grid layout widget - arranges children in a 2D grid.
 * Content Layer (L1) - no scroll listeners or viewport units.
 */

import React, { memo, forwardRef, type CSSProperties } from 'react'
import { useWidgetRenderer } from '../../../../renderer/WidgetRendererContext'
import { toCssGap } from '../utils'
import type { GridProps } from './types'

/**
 * Converts a column/row value to CSS grid template.
 */
function toGridTemplate(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'number') {
    return `repeat(${value}, 1fr)`
  }
  return value
}

/**
 * Maps grid props to CSS properties.
 */
function gridToStyle(props: GridProps): CSSProperties {
  const styles: CSSProperties = {
    display: 'grid',
    ...props.style,
  }

  if (props.columns !== undefined) {
    (styles as Record<string, string>)['--grid-cols'] = toGridTemplate(props.columns)!
  }

  if (props.rows !== undefined) {
    (styles as Record<string, string>)['--grid-rows'] = toGridTemplate(props.rows)!
  }

  if (props.gap !== undefined) {
    styles.gap = toCssGap(props.gap, props.gapScale)
  }

  if (props.columnGap !== undefined) {
    styles.columnGap = toCssGap(props.columnGap, props.gapScale)
  }

  if (props.rowGap !== undefined) {
    styles.rowGap = toCssGap(props.rowGap, props.gapScale)
  }

  return styles
}

/**
 * Grid layout component arranges children in a 2D grid.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 */
const Grid = memo(forwardRef<HTMLDivElement, GridProps>(function Grid(
  {
    id,
    columns,
    rows,
    gap,
    gapScale,
    columnGap,
    rowGap,
    style,
    className,
    'data-behaviour': dataBehaviour,
    'data-effect': dataEffect,
    widgets
  },
  ref
) {
  const WidgetRenderer = useWidgetRenderer()
  const computedStyle = gridToStyle({ columns, rows, gap, gapScale, columnGap, rowGap, style })

  return (
    <div
      ref={ref}
      id={id}
      className={className ? `grid-widget ${className}` : 'grid-widget'}
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

export default Grid
