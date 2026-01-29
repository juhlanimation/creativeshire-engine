'use client'

/**
 * Icon widget - renders SVG icons with CSS variable support.
 * Content Layer (L1) - no scroll listeners or viewport units.
 */

import React, { memo, forwardRef, type CSSProperties } from 'react'
import type { IconProps } from './types'
import './styles.css'

/**
 * Converts size prop to CSS value.
 */
function toCssSize(size: number | string | undefined): string | undefined {
  if (size === undefined) return undefined
  return typeof size === 'number' ? `${size}px` : size
}

/**
 * Checks if the name prop is a raw SVG string.
 */
function isRawSvg(name: string): boolean {
  return name.trim().startsWith('<svg')
}

/**
 * Icon component renders SVG icons.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 */
const Icon = memo(forwardRef<HTMLSpanElement, IconProps>(function Icon(
  {
    id,
    name,
    size,
    color,
    style,
    className,
    'data-behaviour': dataBehaviour
  },
  ref
) {
  const computedStyle: CSSProperties = {
    ...style,
    ...(size !== undefined ? { width: toCssSize(size), height: toCssSize(size) } : {}),
    ...(color ? { color } : {}),
  }

  // If name is a raw SVG string, render it directly
  if (isRawSvg(name)) {
    return (
      <span
        ref={ref}
        id={id}
        className={className ? `icon-widget ${className}` : 'icon-widget'}
        style={Object.keys(computedStyle).length > 0 ? computedStyle : undefined}
        data-behaviour={dataBehaviour}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: name }}
      />
    )
  }

  // Otherwise, render as an icon name (for icon font or CSS-based icons)
  return (
    <span
      ref={ref}
      id={id}
      className={className ? `icon-widget ${className}` : 'icon-widget'}
      style={Object.keys(computedStyle).length > 0 ? computedStyle : undefined}
      data-icon={name}
      data-behaviour={dataBehaviour}
      aria-hidden="true"
    />
  )
}))

export default Icon
