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
 * Payload sent when GalleryThumbnail is clicked with videoUrl.
 * Consumed by 'open-video-modal' action registered by ModalRoot.
 */
export interface GalleryThumbnailClickPayload {
  /** Full-length video URL for modal playback */
  videoUrl: string
  /** Poster image URL */
  poster?: string
  /** Bounding rect for expand animation */
  rect?: DOMRect
  /** Stored playback position to resume from */
  startTime?: number
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

  /**
   * Click handler injected by WidgetRenderer from schema.on.
   * When provided with project.videoUrl, clicking triggers this with payload.
   */
  onClick?: (payload: GalleryThumbnailClickPayload) => void
}
