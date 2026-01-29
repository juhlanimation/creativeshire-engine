/**
 * LogoLink widget types.
 * Text or image logo that links to homepage with hover color transition.
 */

import type { WidgetBaseProps } from '../../types'

/**
 * Props for LogoLink widget.
 */
export interface LogoLinkProps extends WidgetBaseProps {
  /** Logo text (if no image) */
  text?: string
  /** Logo image src (if no text) */
  imageSrc?: string
  /** Alt text for image */
  imageAlt?: string
  /** Link href (defaults to /) */
  href?: string
}
