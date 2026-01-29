/**
 * Container layout widget props interface.
 * Max-width wrapper for constraining content width.
 */

import type { CSSProperties, ReactNode } from 'react'

/**
 * Props for the Container layout widget.
 */
export interface ContainerProps {
  /** Element ID for CSS targeting */
  id?: string
  /** Maximum width (number = px, string = CSS value) */
  maxWidth?: number | string
  /** Horizontal padding (number = px, string = CSS value) */
  padding?: number | string
  /** Center the container horizontally */
  center?: boolean
  /** Inline styles */
  style?: CSSProperties
  /** Additional CSS class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
  /** Data attribute for effect binding */
  'data-effect'?: string
  /** Child widgets */
  children?: ReactNode
}
