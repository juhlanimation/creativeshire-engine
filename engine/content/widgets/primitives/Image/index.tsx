'use client'

/**
 * Image widget - renders images with CSS variable support.
 * Content Layer (L1) - no scroll listeners or viewport units.
 */

import React, { memo, forwardRef, useMemo, type CSSProperties } from 'react'
import NextImage from 'next/image'
import type { ImageProps } from './types'

/**
 * Image component renders an image via next/image.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 */
const Image = memo(forwardRef<HTMLImageElement, ImageProps>(function Image(
  {
    id,
    src,
    alt,
    aspectRatio,
    objectFit,
    objectPosition,
    decorative = false,
    filter,
    style,
    className,
    'data-behaviour': dataBehaviour,
    sizes,
    priority = false,
    quality,
  },
  ref
) {
  const computedStyle = useMemo<CSSProperties>(() => ({
    ...style,
    ...(aspectRatio ? { aspectRatio } : {}),
    ...(objectFit ? { objectFit } : {}),
    ...(objectPosition ? { objectPosition } : {}),
    ...(filter ? { filter } : {}),
  }), [style, aspectRatio, objectFit, objectPosition, filter])

  return (
    <NextImage
      ref={ref}
      id={id}
      className={className ? `image-widget ${className}` : 'image-widget'}
      src={src}
      alt={decorative ? '' : alt}
      aria-hidden={decorative ? true : undefined}
      style={Object.keys(computedStyle).length > 0 ? computedStyle : undefined}
      data-behaviour={dataBehaviour}
      width={1920}
      height={1080}
      sizes={sizes}
      priority={priority}
      quality={quality}
    />
  )
}))

export default Image
