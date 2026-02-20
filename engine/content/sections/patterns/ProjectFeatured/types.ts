/**
 * FeaturedProjectsSection pattern props interface.
 * Featured projects grid with ProjectCard widgets.
 */

import type { DecoratorRef } from '../../../../content/decorators/types'
import type { BaseSectionProps } from '../base'

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
  /** Video URL for modal playback (optional) */
  videoUrl?: string
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
 * Props for the createProjectFeaturedSection factory.
 */
export interface ProjectFeaturedProps extends BaseSectionProps {
  /** Array of featured projects — defaults to {{ content.projects.featured }} */
  projects?: FeaturedProject[] | string
  /** Start with reversed layout (first project has thumbnail right) */
  startReversed?: boolean
  /** Override default decorators on each thumbnail (replaces ProjectCard defaults) */
  thumbnailDecorators?: DecoratorRef[]
}
