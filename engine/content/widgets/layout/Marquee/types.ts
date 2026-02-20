/**
 * Marquee layout widget props interface.
 * Infinite horizontal scroll container for any children.
 */

import type { CSSProperties } from 'react'
import type { WidgetSchema } from '../../../../schema'

/**
 * Props for the Marquee layout widget.
 */
export interface MarqueeProps {
  /** Element ID for CSS targeting */
  id?: string
  /** Animation duration in seconds (default: 30) */
  duration?: number
  /** Gap between items (number = px, string = CSS value) */
  gap?: number | string
  /** Multiplier for the gap value (e.g., 2 = double the gap) */
  gapScale?: number
  /** Scroll direction (default: 'left') */
  direction?: 'left' | 'right'
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
