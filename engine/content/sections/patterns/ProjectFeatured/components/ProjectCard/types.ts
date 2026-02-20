/**
 * ProjectCard composite configuration.
 * Factory function props for creating project card widget schemas.
 */

import type { DecoratorRef } from '../../../../../../content/decorators/types'

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
  /** Item index binding (e.g. '{{ item.$index }}') — Flex computes reversed from this */
  dataIndex?: string | number
  /** Override default interaction decorators for the thumbnail (replaces meta defaults) */
  thumbnailDecorators?: DecoratorRef[]
}
