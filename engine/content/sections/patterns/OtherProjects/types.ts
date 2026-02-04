/**
 * OtherProjectsSection pattern props interface.
 * Horizontal thumbnail gallery (hidden on mobile).
 */

/**
 * Project item for the gallery.
 */
export interface OtherProject {
  /** Unique project ID */
  id: string
  /** Thumbnail image source */
  thumbnailSrc: string
  /** Thumbnail alt text */
  thumbnailAlt: string
  /** Video source for hover preview (optional) */
  videoSrc?: string
  /** Video URL for modal playback (optional) */
  videoUrl?: string
  /** Project title */
  title: string
  /** Client name */
  client: string
  /** Studio name */
  studio: string
  /** Project year */
  year: string
  /** Role in project */
  role: string
}

/**
 * Props for the createOtherProjectsSection factory.
 */
export interface OtherProjectsProps {
  /** Section ID override (default: 'other-projects') */
  id?: string
  /** Section heading */
  heading?: string
  /** Year range label */
  yearRange?: string
  /** Array of other projects - supports binding expressions */
  projects: OtherProject[] | string
}
