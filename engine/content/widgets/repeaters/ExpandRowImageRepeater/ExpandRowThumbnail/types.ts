/**
 * ExpandRowThumbnail types.
 * Internal component of ExpandRowImageRepeater — not a standalone widget.
 */

/**
 * Data shape for an expand-row item.
 */
export interface ExpandRowItem {
  /** Unique item ID */
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
 * Payload sent when an expand-row thumbnail is clicked.
 * Consumed by '{overlayKey}.open' action registered by ModalRoot.
 */
export interface ExpandRowClickPayload {
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
 * Props for the ExpandRowThumbnail component.
 * Internal to ExpandRowImageRepeater — not a standalone widget.
 */
export interface ExpandRowThumbnailProps {
  /** Thumbnail image source */
  thumbnailSrc: string
  /** Thumbnail alt text */
  thumbnailAlt?: string
  /** Video source for hover playback (optional) */
  videoSrc?: string
  /** Video URL for modal playback (optional) */
  videoUrl?: string
  /** Project title */
  title?: string
  /** Client name */
  client?: string
  /** Studio name */
  studio?: string
  /** Project year */
  year?: string
  /** Role in project */
  role?: string
  /** Whether this thumbnail is currently expanded */
  isExpanded?: boolean
  /** Whether this thumbnail was just locked (waiting for transition) */
  wasJustLocked?: boolean
  /** Width when expanded (CSS value) */
  expandedWidth?: string
  /** Transition duration in ms */
  transitionDuration?: number
  /** Callback when mouse enters (for coordinated hover) */
  onExpand?: () => void
  /** Callback when thumbnail is click-locked (waiting for transition) */
  onLock?: () => void
  /** Click handler for modal opening */
  onClick?: (payload: ExpandRowClickPayload) => void
  /** Additional CSS class */
  className?: string
}
