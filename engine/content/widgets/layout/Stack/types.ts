/**
 * Stack layout widget props interface.
 * Vertical stack layout (shorthand for Flex column).
 */

import type { CSSProperties } from 'react'
import type { WidgetSchema } from '@/engine/schema'

/**
 * Props for the Stack layout widget.
 */
export interface StackProps {
  /** Element ID for CSS targeting */
  id?: string
  /** Gap between items (number = px, string = CSS value) */
  gap?: number | string
  /** Align items along cross axis (horizontal alignment) */
  align?: 'start' | 'center' | 'end' | 'stretch'
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
