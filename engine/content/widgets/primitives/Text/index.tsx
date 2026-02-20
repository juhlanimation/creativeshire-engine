'use client'

/**
 * Text widget - renders text content with CSS variable support.
 * Content Layer (L1) - no scroll listeners or viewport units.
 */

import React, { memo, forwardRef } from 'react'
import type { TextProps, TextElement } from './types'

/** HTML elements used by Text. */
type TextHTMLElement = 'h1' | 'h2' | 'h3' | 'p' | 'small' | 'span'

/** Map scale levels to HTML elements. */
const ELEMENT_MAP: Record<TextElement, TextHTMLElement> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  p: 'p',
  small: 'small',
  xs: 'small',
  span: 'span',
}

/**
 * Text component renders text content.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 */
const Text = memo(forwardRef<HTMLElement, TextProps>(function Text(
  {
    id, content, as: scale = 'p', variant, color, html, linkHoverStyle,
    textAlign, textTransform, blendMode, fontWeight, letterSpacing, lineHeight,
    style, className, 'data-behaviour': dataBehaviour,
  },
  ref
) {
  const Element = ELEMENT_MAP[scale] ?? 'p'
  const computedClassName = className ? `text-widget ${className}` : 'text-widget'
  const dataColor = color && color !== 'inherit' ? color : undefined

  const computedStyle: React.CSSProperties = {
    ...style,
    ...(textAlign && { textAlign }),
    ...(textTransform && { textTransform }),
    ...(blendMode && { mixBlendMode: blendMode as React.CSSProperties['mixBlendMode'] }),
    ...(fontWeight && { fontWeight }),
    ...(letterSpacing && { letterSpacing }),
    ...(lineHeight && { lineHeight }),
  }

  // Render with dangerouslySetInnerHTML for rich text (inline links, etc.)
  if (html) {
    return (
      <Element
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as React.Ref<any>}
        id={id}
        className={computedClassName}
        style={computedStyle}
        data-scale={scale}
        data-variant={variant}
        data-color={dataColor}
        data-link-hover={linkHoverStyle || 'hover-underline'}
        data-behaviour={dataBehaviour}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  return (
    <Element
      // Dynamic element type requires ref cast for polymorphic components
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as React.Ref<any>}
      id={id}
      className={computedClassName}
      style={computedStyle}
      data-scale={scale}
      data-variant={variant}
      data-color={dataColor}
      data-behaviour={dataBehaviour}
    >
      {content}
    </Element>
  )
}))

export default Text
