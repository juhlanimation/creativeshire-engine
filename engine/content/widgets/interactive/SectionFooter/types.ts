/**
 * SectionFooter widget types.
 * A footer bar for project sections with social links, email copy-to-clipboard,
 * and an optional display name.
 *
 * Used at the bottom of each project section (not a chrome region).
 */

import type { WidgetBaseProps } from '../../types'

export interface SectionFooterProps extends WidgetBaseProps {
  /** Email address (click to copy) */
  email?: string
  /** Instagram profile URL */
  instagram?: string
  /** LinkedIn profile URL */
  linkedin?: string
  /** Display name shown in bottom-left corner */
  displayName?: string
  /** Footer height */
  height?: string
  /** Text color mode */
  textColor?: 'light' | 'dark'
  /** Additional CSS class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
}
