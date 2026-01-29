'use client'

/**
 * Text widget - renders text content with CSS variable support.
 * Content Layer (L1) - no scroll listeners or viewport units.
 */

import React, { memo, forwardRef } from 'react'
import type { TextProps } from './types'
import './styles.css'

/**
 * Text component renders text content.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 */
const Text = memo(forwardRef<HTMLElement, TextProps>(function Text(
  { id, content, as: Element = 'p', variant, html, style, className, 'data-behaviour': dataBehaviour },
  ref
) {
  const computedClassName = className ? `text-widget ${className}` : 'text-widget'

  // Render with dangerouslySetInnerHTML for rich text (inline links, etc.)
  if (html) {
    return (
      <Element
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as React.Ref<any>}
        id={id}
        className={computedClassName}
        style={style}
        data-variant={variant}
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
      style={style}
      data-variant={variant}
      data-behaviour={dataBehaviour}
    >
      {content}
    </Element>
  )
}))

export default Text
