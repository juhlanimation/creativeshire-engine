/**
 * ExpandableGalleryRow layout widget types.
 * Horizontal row of expandable thumbnails with coordinated hover.
 */

import type { WidgetBaseProps } from '../../types'
import type { GalleryProject as GalleryProjectType } from '../../composite/GalleryThumbnail'

/** Re-export GalleryProject type */
export type GalleryProject = GalleryProjectType

/**
 * Props for the ExpandableGalleryRow widget.
 */
export interface ExpandableGalleryRowProps extends WidgetBaseProps {
  /** Array of projects to display */
  projects: GalleryProjectType[]
  /** Row height (default: '32rem') */
  height?: string
  /** Gap between thumbnails (default: '4px') */
  gap?: string
  /** Expanded thumbnail width (default: '32rem') */
  expandedWidth?: string
  /** Transition duration in ms (default: 400) */
  transitionDuration?: number
  /** Cursor label text (default: 'WATCH') */
  cursorLabel?: string
}
