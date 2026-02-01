/**
 * Text widget props interface.
 * Text renders static text content and reads CSS variables for animation.
 */

import type { CSSProperties } from 'react'

/**
 * HTML element types that Text can render as.
 */
export type TextElement = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'

/**
 * Props for the Text widget.
 */
export interface TextProps {
  /** Unique identifier for CSS targeting */
  id?: string
  /** Text content to display */
  content: string
  /** HTML element to render (default: 'p') */
  as?: TextElement
  /** Semantic variant for CSS styling (renders as data-variant attribute) */
  variant?: string
  /** Render content as HTML (enables inline links, etc.) */
  html?: boolean
  /** Inline styles */
  style?: CSSProperties
  /** Additional CSS class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
}
