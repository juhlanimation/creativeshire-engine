/**
 * ProjectVideoGrid section props.
 * Grid layout with mixed aspect ratio videos (Clash Royale style).
 */

import type { BaseSectionProps } from '../base'

export interface VideoGridItem {
  /** Video source URL */
  src: string
  /** Video title (for hover display) */
  title: string
  /** Aspect ratio: '16:9' (horizontal), '9:16' (vertical), '1:1' (square) */
  aspectRatio: '16:9' | '9:16' | '1:1'
  /** Grid column assignment */
  column: 'left' | 'right'
}

export interface LogoConfig {
  /** Logo image source */
  src: string
  /** Logo alt text */
  alt: string
  /** Logo width in pixels (optional) */
  width?: number
  /** Invert logo colors for dark backgrounds */
  invert?: boolean
}

export interface ProjectVideoGridProps extends BaseSectionProps {
  /** Project logo */
  logo: LogoConfig
  /** Videos to display in grid OR binding expression string */
  videos: VideoGridItem[] | string
  /** Enable hover-to-play on videos */
  hoverPlay?: boolean
}
