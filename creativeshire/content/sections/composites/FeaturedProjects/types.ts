/**
 * FeaturedProjectsSection composite props interface.
 * Featured projects grid with ProjectCard widgets.
 */

/**
 * Project item for the featured grid.
 */
export interface FeaturedProject {
  /** Thumbnail image source */
  thumbnailSrc: string
  /** Thumbnail alt text */
  thumbnailAlt: string
  /** Video source for playback (optional) */
  videoSrc?: string
  /** Client name */
  client: string
  /** Studio name */
  studio: string
  /** Project title */
  title: string
  /** Project description */
  description: string
  /** Project year */
  year: string
  /** Role in project */
  role: string
}

/**
 * Props for the createFeaturedProjectsSection factory.
 */
export interface FeaturedProjectsProps {
  /** Section ID override (default: 'projects') */
  id?: string
  /** Array of featured projects */
  projects: FeaturedProject[]
}
