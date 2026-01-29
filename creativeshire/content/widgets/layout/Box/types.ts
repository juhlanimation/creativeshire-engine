/**
 * Box layout widget props interface.
 * Generic container for applying layout styling to children.
 */

import type { CSSProperties } from 'react'

/**
 * Props for the Box layout widget.
 */
export interface BoxProps {
  /** Element ID for CSS targeting */
  id?: string
  /** Width (number = px, string = CSS value like '50%' or 'auto') */
  width?: number | string
  /** Height (number = px, string = CSS value) */
  height?: number | string
  /** Min width */
  minWidth?: number | string
  /** Max width */
  maxWidth?: number | string
  /** Flex grow factor */
  flexGrow?: number
  /** Flex shrink factor */
  flexShrink?: number
  /** Inline styles */
  style?: CSSProperties
  /** Additional CSS class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
  /** Data attribute for effect binding */
  'data-effect'?: string
  /** Data attribute for marquee track */
  'data-marquee-track'?: boolean
  /** Child widgets */
  children?: React.ReactNode
}
