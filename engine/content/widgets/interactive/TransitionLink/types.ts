/**
 * TransitionLink widget types.
 */

import type { ReactNode } from 'react'
import type { WidgetBaseProps } from '../../types'

export interface TransitionLinkProps extends WidgetBaseProps {
  /** Target URL */
  href: string
  /** Link content */
  children: ReactNode
  /** Transition duration in ms (default: 400) */
  duration?: number
  /** Disable transition (use normal navigation) */
  skipTransition?: boolean
}
