/**
 * Text widget props interface.
 * Text renders static text content and reads CSS variables for animation.
 */

import type { CSSProperties } from 'react'

/**
 * Text scale levels matching the theme type scale.
 * Each maps to an HTML element: display→h1, h1→h1, h2→h2, h3→h3, body→p, p→p, small→small, span→span.
 * 'body' is the canonical theme scale name; 'p' is kept for backward compatibility.
 */
export type TextElement = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'p' | 'small' | 'xs' | 'span'

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
  /** Semantic color from theme palette */
  color?: 'primary' | 'secondary' | 'accent' | 'interaction' | 'inherit'
  /** Render content as HTML (enables inline links, etc.) */
  html?: boolean
  /** Hover style for inline links when html is true */
  linkHoverStyle?: 'none' | 'underline' | 'hover-underline'
  /** Text alignment */
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  /** Text transform */
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize'
  /** CSS mix-blend-mode */
  blendMode?: string
  /** Font weight override (e.g. '700') — overrides theme default */
  fontWeight?: string
  /** Letter spacing override (e.g. '-0.02em') — overrides theme default */
  letterSpacing?: string
  /** Line height override (e.g. '1.2') — overrides theme default */
  lineHeight?: string
  /** Inline styles */
  style?: CSSProperties
  /** Additional CSS class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
}
