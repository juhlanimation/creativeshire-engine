/**
 * ProjectExpand section props.
 * Expandable video gallery (Riot Games style).
 */

import type { WidgetEventMap } from '../../../../schema/widget'
import type { SocialLink } from '../../../widgets/interactive/ContactBar/types'
import type { BaseSectionProps } from '../base'

/**
 * Video item for the expandable gallery.
 * Compatible with ExpandRowItem interface used by ExpandRowImageRepeater.
 */
export interface ExpandableVideoItem {
  /** Unique item ID */
  id: string
  /** Thumbnail image URL */
  thumbnailSrc: string
  /** Thumbnail alt text */
  thumbnailAlt: string
  /** Video source for hover preview (optional) */
  videoSrc?: string
  /** Video URL for modal playback */
  videoUrl: string
  /** Video/project title */
  title: string
  /** Client name */
  client?: string
  /** Studio name */
  studio?: string
  /** Year */
  year?: string
  /** Role/position */
  role?: string
}

/**
 * Logo configuration for the section header.
 */
export interface LogoConfig {
  /** Logo image source URL */
  src: string
  /** Alt text for accessibility */
  alt: string
  /** Logo width in pixels (default: 120) */
  width?: number
  /** Invert logo colors (for dark backgrounds) */
  invert?: boolean
}

/**
 * Props for the createProjectExpandSection factory.
 */
export interface ProjectExpandProps extends BaseSectionProps {
  /** Project/client logo */
  logo: LogoConfig
  /** Videos for expandable gallery - supports binding expressions */
  videos: ExpandableVideoItem[] | string
  /** Gallery height */
  galleryHeight?: string
  /** Cursor label text */
  cursorLabel?: string
  /** Event handlers for the gallery widget (e.g., { click: 'modal.open' }) */
  galleryOn?: WidgetEventMap
  /** Social links for footer bar (array or binding expression) */
  socialLinks?: SocialLink[] | string
  /** Text/icon color scheme for footer */
  textColor?: 'light' | 'dark'
}
