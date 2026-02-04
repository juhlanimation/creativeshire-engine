/**
 * LogoMarquee widget types.
 * Horizontal marquee of client logos.
 */

import type { WidgetBaseProps } from '../../types'

export interface LogoItem {
  src: string
  alt: string
  href?: string
}

export interface LogoMarqueeProps extends WidgetBaseProps {
  /** Array of logo items OR binding expression string */
  logos: LogoItem[] | string
  /** Animation duration in seconds (default: 30) */
  duration?: number
  /** Logo width in pixels (default: 120) */
  logoWidth?: number
  /** Gap between logos in pixels (default: 48) */
  logoGap?: number
}
