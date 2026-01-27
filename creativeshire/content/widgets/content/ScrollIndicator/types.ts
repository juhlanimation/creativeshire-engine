/**
 * ScrollIndicator widget props interface.
 * Visual prompt encouraging users to scroll down.
 */

import type { FeatureSet } from '../../../../schema/features'

/**
 * Props for the ScrollIndicator widget.
 */
export interface ScrollIndicatorProps {
  /** Text content to display (default: "(SCROLL)") */
  text?: string
  /** Whether to apply mix-blend-mode: difference (default: true) */
  useBlendMode?: boolean
  /** Static styling features */
  features?: FeatureSet
  /** Additional CSS class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
}
