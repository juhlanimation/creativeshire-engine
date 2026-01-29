/**
 * Flex layout widget props interface.
 * Container widget for arranging children with flexbox.
 */

import type { CSSProperties } from 'react'

/**
 * Props for the Flex layout widget.
 */
export interface FlexProps {
  /** Element ID for CSS targeting */
  id?: string
  /** Flex direction */
  direction?: 'row' | 'column'
  /** Align items along cross axis */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** Justify content along main axis */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  /** Allow items to wrap */
  wrap?: boolean
  /** Gap between items (number = px, string = CSS value) */
  gap?: number | string
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
