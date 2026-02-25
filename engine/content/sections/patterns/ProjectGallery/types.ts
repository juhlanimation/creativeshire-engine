/**
 * ProjectGallery section props.
 * Main video with selectable project thumbnails (Azuki style).
 */

import type { BaseSectionProps } from '../base'
import type { SocialLink } from '../../../widgets/interactive/ContactBar/types'

export interface GalleryProject {
  /** Unique identifier */
  id: string
  /** Thumbnail image URL */
  thumbnail: string
  /** Main video URL */
  video: string
  /** Project title */
  title: string
  /** Project year */
  year: string
  /** Studio name */
  studio: string
  /** External URL (optional) */
  url?: string
  /** Role in the project (e.g. "Animation Lead") */
  role?: string
  /** Time in seconds to seek to for video poster frame */
  posterTime?: number
}

export interface LogoConfig {
  src: string
  alt: string
  width?: number
  invert?: boolean
}

export interface ProjectGalleryProps extends BaseSectionProps {
  /** Project logo */
  logo: LogoConfig
  /** Projects in gallery OR binding expression */
  projects: GalleryProject[] | string
  /** Initial active project index */
  defaultActiveIndex?: number
  /** Background color */
  backgroundColor?: string
  /** Text color mode */
  textColor?: 'light' | 'dark'
  /** Logo filter (e.g. binding expression for invert) */
  logoFilter?: string
  /** Thumbnail width in pixels for selector */
  thumbnailWidth?: number
  /** Active thumbnail width in pixels for selector */
  activeThumbnailWidth?: number
  /** Accent color for selector */
  accentColor?: string
  /** Show playing indicator on selector */
  showPlayingIndicator?: boolean
  /** Show play icon on selector */
  showPlayIcon?: boolean
  /** Show overlay on selector */
  showOverlay?: boolean
  /** Thumbnail border style */
  thumbnailBorder?: string
  /** Thumbnail border radius */
  thumbnailBorderRadius?: string
  /** Border around the content canvas (video area) */
  contentBorder?: string
  /** Social links for footer bar (array or binding expression) */
  socialLinks?: SocialLink[] | string
}
