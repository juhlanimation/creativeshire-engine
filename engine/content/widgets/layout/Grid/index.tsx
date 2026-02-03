'use client'

/**
 * Grid layout widget - arranges children in a 2D grid.
 * Content Layer (L1) - no scroll listeners or viewport units.
 */

import React, { memo, forwardRef, type CSSProperties } from 'react'
import { WidgetRenderer } from '../../../../renderer/WidgetRenderer'
import type { GridProps } from './types'
import './styles.css'

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
 * Converts gap value to CSS.
 */
function toCssGap(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined
  return typeof value === 'number' ? `${value}px` : value
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
    styles.gridTemplateColumns = toGridTemplate(props.columns)
  }

  if (props.rows !== undefined) {
    styles.gridTemplateRows = toGridTemplate(props.rows)
  }

  if (props.gap !== undefined) {
    styles.gap = toCssGap(props.gap)
  }

  if (props.columnGap !== undefined) {
    styles.columnGap = toCssGap(props.columnGap)
  }

  if (props.rowGap !== undefined) {
    styles.rowGap = toCssGap(props.rowGap)
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
  const computedStyle = gridToStyle({ columns, rows, gap, columnGap, rowGap, style })

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
