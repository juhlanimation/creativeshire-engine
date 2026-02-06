/**
 * ShotIndicator widget props.
 * Video shot/frame number navigation.
 *
 * Supports two patterns:
 * 1. Children via __repeat (preferred): Receives widgets array, visible in hierarchy
 * 2. Legacy shots prop: Receives shots array directly (hidden in hierarchy)
 */

import type { WidgetSchema } from '../../../../schema'
import type { WidgetBaseProps } from '../../types'

export interface ShotIndicatorProps extends WidgetBaseProps {
  /** Array of shot numbers to display (legacy, prefer widgets) */
  shots?: number[]
  /** Children widgets from __repeat (preferred) */
  widgets?: WidgetSchema[]
  /** Currently active shot (controlled) */
  activeShot?: number
  /** Callback when shot is selected */
  onSelect?: (shot: number) => void
  /** Prefix label (default: 'sh') */
  prefix?: string
  /** Position */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  /** Additional class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
}
