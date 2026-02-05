/**
 * ShotIndicator widget props.
 * Video shot/frame number navigation.
 */

import type { WidgetBaseProps } from '../../types'

export interface ShotIndicatorProps extends WidgetBaseProps {
  /** Array of shot numbers to display */
  shots: number[]
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
