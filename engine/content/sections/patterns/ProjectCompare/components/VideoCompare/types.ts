/**
 * VideoCompare widget props.
 * Interactive before/after video comparison with draggable divider.
 */

import type { WidgetBaseProps } from '../../../../../widgets/types'

export interface VideoCompareProps extends WidgetBaseProps {
  /** Video source for "before" state (left/bottom) */
  beforeSrc: string
  /** Video source for "after" state (right/top) */
  afterSrc: string
  /** Label for before video (optional) */
  beforeLabel?: string
  /** Label for after video (optional) */
  afterLabel?: string
  /** Initial divider position (0-100, default: 50) */
  initialPosition?: number
  /** Aspect ratio (default: '16/9') */
  aspectRatio?: string
  /** Additional class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
}
