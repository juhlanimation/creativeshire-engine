/**
 * Icon widget props interface.
 * Icon renders SVG icons and reads CSS variables for animation.
 */

import type { CSSProperties } from 'react'

/**
 * Props for the Icon widget.
 */
export interface IconProps {
  /** Element ID for CSS targeting */
  id?: string
  /** Icon name (maps to icon set) or raw SVG string */
  name: string
  /** Icon size (number = px, string = CSS value) */
  size?: number | string
  /** Icon color (CSS color value) */
  color?: string
  /** Whether icon is decorative (hidden from screen readers). Default: true */
  decorative?: boolean
  /** Accessible label for non-decorative icons. Required if decorative=false */
  label?: string
  /** Inline styles */
  style?: CSSProperties
  /** Additional CSS class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
}
