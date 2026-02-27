/**
 * ArrowLink widget types.
 */

import type { WidgetBaseProps } from '../../types'

export type ArrowLinkVariant = 'swap' | 'slide'
export type ArrowLinkSize = 'small' | 'medium' | 'large'

export interface ArrowLinkProps extends WidgetBaseProps {
  /** Visual variant */
  variant?: ArrowLinkVariant
  /** Email address for mailto link */
  email?: string
  /** Display label (swap variant: visible text before hover) */
  label?: string
  /** Optional explicit href (defaults to mailto:{email}) */
  href?: string
  /** Arrow direction */
  arrowDirection?: 'right' | 'down'
  /** Arrow size — small (24px), medium (38px), large (92px S-curve) */
  arrowSize?: ArrowLinkSize
  /** Custom class */
  className?: string
}
