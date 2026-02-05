/**
 * ProjectExpand section props.
 * Expandable video gallery (Riot Games style).
 */

/**
 * Video item for the expandable gallery.
 * Compatible with GalleryProject interface used by ExpandableGalleryRow.
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
export interface ProjectExpandProps {
  /** Section ID override (default: 'project-expand') */
  id?: string
  /** Project/client logo */
  logo: LogoConfig
  /** Videos for expandable gallery - supports binding expressions */
  videos: ExpandableVideoItem[] | string
  /** Section background color (default: '#0B0A0A') */
  backgroundColor?: string
  /** Video area background color (default: '#1F1F1F') */
  videoBackgroundColor?: string
  /** Contact email */
  email: string
  /** Optional prompt text for contact bar */
  contactPrompt?: string
}
