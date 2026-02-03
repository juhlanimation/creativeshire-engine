/**
 * Grid layout widget props interface.
 * 2D grid layout using CSS Grid.
 */

import type { CSSProperties } from 'react'
import type { WidgetSchema } from '../../../../schema'

/**
 * Props for the Grid layout widget.
 */
export interface GridProps {
  /** Element ID for CSS targeting */
  id?: string
  /** Number of columns or CSS grid-template-columns value */
  columns?: number | string
  /** Number of rows or CSS grid-template-rows value */
  rows?: number | string
  /** Gap between items (number = px, string = CSS value) */
  gap?: number | string
  /** Column gap (overrides gap for columns) */
  columnGap?: number | string
  /** Row gap (overrides gap for rows) */
  rowGap?: number | string
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
