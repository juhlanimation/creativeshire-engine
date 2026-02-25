/**
 * ProjectVideoGrid section props.
 * Grid layout with mixed aspect ratio videos (Clash Royale style).
 */

import type { SocialLink } from '../../../widgets/interactive/ContactBar/types'
import type { BaseSectionProps } from '../base'

export interface VideoGridItem {
  /** Video source URL */
  src: string
  /** Video title (for hover display) */
  title: string
  /** Aspect ratio in CSS-native format */
  aspectRatio: '16/9' | '9/16' | '1/1'
  /** Poster/thumbnail image shown when not hovering */
  poster?: string
  /** Time in seconds to seek to for initial frame display (when no poster image) */
  posterTime?: number
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
  /** Social links for footer bar (array or binding expression) */
  socialLinks?: SocialLink[] | string
  /** Text/icon color scheme for footer */
  textColor?: 'light' | 'dark'
}
