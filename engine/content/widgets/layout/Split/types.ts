/**
 * Split layout widget props interface.
 * Two-column split layout for hero sections, sidebars, etc.
 */

import type { CSSProperties } from 'react'
import type { WidgetSchema } from '../../../../schema'

/**
 * Common split ratios.
 */
export type SplitRatio = '1:1' | '2:1' | '1:2' | '3:1' | '1:3' | '3:2' | '2:3'

/**
 * Props for the Split layout widget.
 */
export interface SplitProps {
  /** Element ID for CSS targeting */
  id?: string
  /** Split ratio (e.g., '1:1', '2:1', '1:2') or custom CSS grid-template-columns */
  ratio?: SplitRatio | string
  /** Gap between columns (number = px, string = CSS value) */
  gap?: number | string
  /** Multiplier for the gap value (e.g., 2 = double the gap) */
  gapScale?: number
  /** Reverse the column order */
  reverse?: boolean
  /** Vertical alignment of columns */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** Inline styles */
  style?: CSSProperties
  /** Additional CSS class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
  /** Data attribute for effect binding */
  'data-effect'?: string
  /** Child widgets - schema-driven rendering (expects exactly 2 widgets) */
  widgets?: WidgetSchema[]
}
