/**
 * MarqueeImageRepeater widget types.
 * Converts image data into Image widgets inside a Marquee layout.
 */

import type { CSSProperties } from 'react'
import type { WidgetBaseProps } from '../../../../../widgets/types'

export interface LogoItem {
  src: string
  alt: string
  href?: string
  /** Display height in pixels — when set, each logo renders at its own height for visual balance */
  height?: number
}

export interface MarqueeImageRepeaterProps extends WidgetBaseProps {
  /** Widget ID for CSS targeting */
  id?: string
  /**
   * Array of logo items OR binding expression string.
   * When binding string, returns null (platform resolves and re-renders).
   */
  logos?: LogoItem[] | string
  /** Animation duration in seconds passed to Marquee (default: 30) */
  duration?: number
  /** Logo width in pixels (default: 120) */
  logoWidth?: number
  /** Gap between logos in pixels (default: 48) */
  logoGap?: number
  /** Inline styles */
  style?: CSSProperties
}
