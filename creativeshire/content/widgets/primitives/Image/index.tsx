'use client'

/**
 * Image widget - renders images with CSS variable support.
 * Content Layer (L1) - no scroll listeners or viewport units.
 */

import React, { memo, forwardRef, useMemo, type CSSProperties } from 'react'
import type { ImageProps } from './types'
import './styles.css'

/**
 * Image component renders an image.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 */
const Image = memo(forwardRef<HTMLImageElement, ImageProps>(function Image(
  {
    id,
    src,
    alt,
    aspectRatio,
    objectFit = 'cover',
    objectPosition = 'center',
    decorative = false,
    style,
    className,
    'data-behaviour': dataBehaviour
  },
  ref
) {
  const computedStyle = useMemo<CSSProperties>(() => ({
    ...style,
    ...(aspectRatio ? { aspectRatio } : {}),
    objectFit,
    objectPosition,
  }), [style, aspectRatio, objectFit, objectPosition])

  return (
    <img
      ref={ref}
      id={id}
      className={className ? `image-widget ${className}` : 'image-widget'}
      src={src}
      alt={decorative ? '' : alt}
      aria-hidden={decorative ? true : undefined}
      style={Object.keys(computedStyle).length > 0 ? computedStyle : undefined}
      data-behaviour={dataBehaviour}
    />
  )
}))

export default Image
