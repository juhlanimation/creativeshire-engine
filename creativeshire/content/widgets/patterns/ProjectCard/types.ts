/**
 * ProjectCard composite configuration.
 * Factory function props for creating project card widget schemas.
 */

/**
 * Configuration for the createProjectCard factory.
 */
export interface ProjectCardConfig {
  /** Unique identifier for the project card */
  id?: string
  /** Thumbnail image source */
  thumbnailSrc: string
  /** Thumbnail alt text */
  thumbnailAlt: string
  /** Video source for hover playback (optional) */
  videoSrc?: string
  /** Full-length video URL for modal playback (optional) */
  videoUrl?: string
  /** Client name (e.g., "AZUKI") */
  client: string
  /** Studio name (e.g., "CROSSROAD STUDIO") */
  studio: string
  /** Project title */
  title: string
  /** Project description */
  description: string
  /** Project year (e.g., "2024") */
  year?: string
  /** Role in project (e.g., "Director") */
  role?: string
  /** Reverse layout (content left, thumbnail right) */
  reversed?: boolean
}
