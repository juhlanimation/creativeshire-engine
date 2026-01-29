/**
 * GalleryThumbnail composite widget types.
 * Expandable thumbnail with video and metadata labels.
 */

import type { WidgetBaseProps } from '../../types'

/**
 * Project data for gallery thumbnail.
 */
export interface GalleryProject {
  /** Unique project ID */
  id: string
  /** Thumbnail image source */
  thumbnailSrc: string
  /** Thumbnail alt text */
  thumbnailAlt: string
  /** Video source for hover playback (optional) */
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
 * Props for the GalleryThumbnail widget.
 */
export interface GalleryThumbnailProps extends WidgetBaseProps {
  /** Project data */
  project: GalleryProject
  /** Whether this thumbnail is currently expanded */
  isExpanded?: boolean
  /** Callback when thumbnail is hovered */
  onExpand?: () => void
  /** Callback when thumbnail hover ends */
  onCollapse?: () => void
  /** Expanded width (default: '32rem') */
  expandedWidth?: string
  /** Transition duration in ms (default: 400) */
  transitionDuration?: number
}
