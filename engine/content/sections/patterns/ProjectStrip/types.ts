/**
 * OtherProjectsSection pattern props interface.
 * Horizontal thumbnail gallery (hidden on mobile).
 */

import type { WidgetEventMap } from '../../../../schema/widget'
import type { BaseSectionProps } from '../base'

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
 * Props for the createProjectStripSection factory.
 */
export interface ProjectStripProps extends BaseSectionProps {
  /** Section heading */
  heading?: string
  /** Year range label */
  yearRange?: string
  /** Array of other projects — defaults to {{ content.projects.other }} */
  projects?: OtherProject[] | string
  /** Event handlers for the gallery widget (e.g., { click: 'modal.open' }) */
  galleryOn?: WidgetEventMap
}
