/**
 * EmailReveal widget types.
 * Hover-triggered email reveal with max-width fold-out animation
 * and copy-to-clipboard functionality.
 */

import type { WidgetBaseProps } from '../../types'

export interface EmailRevealProps extends WidgetBaseProps {
  /** Email address to reveal and copy. Required. */
  email: string
  /** Label text shown before the email (e.g., "Email"). Default: "Email" */
  label?: string
  /** Accent color for hover state. Default: "#ffffff" */
  accentColor?: string
}
