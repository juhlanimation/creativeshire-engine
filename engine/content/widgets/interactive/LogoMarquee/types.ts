/**
 * LogoMarquee widget types.
 * Horizontal marquee of client logos.
 */

import type { WidgetBaseProps } from '../../types'
import type { WidgetSchema } from '../../../../schema'

export interface LogoItem {
  src: string
  alt: string
  href?: string
}

export interface LogoMarqueeProps extends WidgetBaseProps {
  /**
   * Child widgets (via __repeat). Preferred pattern - visible in hierarchy.
   * Each child is typically an Image widget with src/alt/href.
   */
  widgets?: WidgetSchema[]
  /**
   * Legacy: Array of logo items OR binding expression string.
   * @deprecated Use widgets via __repeat instead for hierarchy visibility.
   */
  logos?: LogoItem[] | string
  /** Animation duration in seconds (default: 30) */
  duration?: number
  /** Logo width in pixels (default: 120) */
  logoWidth?: number
  /** Gap between logos in pixels (default: 48) */
  logoGap?: number
}
