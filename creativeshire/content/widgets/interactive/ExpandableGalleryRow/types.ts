/**
 * ExpandableGalleryRow layout widget types.
 * Horizontal row of expandable thumbnails with coordinated hover.
 */

import type { WidgetBaseProps } from '../../types'
import type { GalleryProject as GalleryProjectType } from '../GalleryThumbnail'

/** Re-export GalleryProject type */
export type GalleryProject = GalleryProjectType

/**
 * Payload sent when a gallery thumbnail is clicked.
 * Consumed by 'open-video-modal' action registered by ModalRoot.
 */
export interface ExpandableGalleryClickPayload {
  /** Full-length video URL for modal playback */
  videoUrl: string
  /** Poster image URL */
  poster?: string
  /** Bounding rect for expand animation */
  rect?: DOMRect
  /** Animation type for modal (wipe-left, wipe-right, expand) */
  animationType?: 'wipe-left' | 'wipe-right' | 'expand'
  /**
   * Callback to invoke when the modal closes.
   * Allows widget to restore state after modal animation completes.
   */
  onComplete?: () => void
}

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
  /** Animation type for modal opening (default: 'expand') */
  modalAnimationType?: 'wipe-left' | 'wipe-right' | 'expand'

  /**
   * Click handler injected by WidgetRenderer from schema.on.
   * When provided with project.videoUrl, clicking triggers this with payload.
   */
  onClick?: (payload: ExpandableGalleryClickPayload) => void
}
