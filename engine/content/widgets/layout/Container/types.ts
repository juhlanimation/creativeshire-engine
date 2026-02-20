/**
 * Container layout widget props interface.
 * Max-width wrapper for constraining content width.
 */

import type { CSSProperties } from 'react'
import type { WidgetSchema } from '../../../../schema'

/**
 * Props for the Container layout widget.
 */
export interface ContainerProps {
  /** Element ID for CSS targeting */
  id?: string
  /** Maximum width (number = px, string = CSS value) */
  maxWidth?: number | string
  /** Horizontal padding (layout preset name or CSS value) */
  padding?: string
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
  /** Child widgets - schema-driven rendering */
  widgets?: WidgetSchema[]
}
