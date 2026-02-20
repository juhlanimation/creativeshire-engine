/**
 * Flex layout widget props interface.
 * Container widget for arranging children with flexbox.
 */

import type { CSSProperties } from 'react'
import type { WidgetSchema } from '../../../../schema'

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
  /** Multiplier for the gap value (e.g., 3 = triple the gap) */
  gapScale?: number
  /** Inline styles */
  style?: CSSProperties
  /** Additional CSS class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
  /** Data attribute for effect binding */
  'data-effect'?: string
  /** Data attribute for item index (from __repeat binding) */
  'data-index'?: string | number
  /** Data attribute for reversed layout (explicit or computed from data-index) */
  'data-reversed'?: boolean | string
  /** Child widgets - schema-driven rendering */
  widgets?: WidgetSchema[]
}
