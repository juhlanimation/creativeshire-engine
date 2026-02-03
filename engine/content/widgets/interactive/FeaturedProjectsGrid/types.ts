/**
 * FeaturedProjectsGrid widget types.
 * Runtime widget for rendering featured project cards.
 */

import type { WidgetBaseProps } from '../../types'

/**
 * Project item for the featured grid.
 * Matches FeaturedProject from section pattern.
 */
export interface FeaturedProject {
  thumbnailSrc: string
  thumbnailAlt: string
  videoSrc?: string
  videoUrl?: string
  client: string
  studio: string
  title: string
  description: string
  year: string
  role: string
}

export interface FeaturedProjectsGridProps extends WidgetBaseProps {
  /** Array of projects OR binding expression string */
  projects: FeaturedProject[] | string
  /** Start with reversed layout (default: false) */
  startReversed?: boolean
}
