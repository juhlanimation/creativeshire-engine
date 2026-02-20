/**
 * Video widget props interface.
 * Renders a video element with autoplay, loop, muted options.
 *
 * Supports two modes:
 * - Default (autoplay): Video plays automatically (hero background)
 * - Hover-play: Video plays on hover, shows poster otherwise (thumbnails)
 *
 * Modal integration:
 * - videoUrl: URL for modal playback (optional)
 * - When videoUrl is set and onClick is provided (via schema.on),
 *   clicking triggers the action with payload { videoUrl, poster, rect }
 *
 * Why composite (not primitive):
 * - Multiple elements in hover-play mode (div > img + video)
 * - Local state management (useState, useRef, useEffect)
 * - Two render modes with different DOM structures
 */

import type { WidgetBaseProps } from '../../types'

/**
 * Payload sent when Video widget is clicked with videoUrl.
 * Consumed by '{overlayKey}.open' action registered by ModalRoot.
 */
export interface VideoClickPayload {
  /** Full-length video URL for modal playback */
  videoUrl: string
  /** Poster image URL */
  poster?: string
  /** Bounding rect for expand animation */
  rect?: DOMRect
  /** Stored playback position to resume from */
  startTime?: number
  /** Animation type for modal (wipe-left, wipe-right, expand) */
  animationType?: 'wipe-left' | 'wipe-right' | 'expand'
}

/**
 * Props for the Video widget.
 */
export interface VideoProps extends WidgetBaseProps {
  /** Video source URL (hover/preview) */
  src: string
  /** Poster image URL (shown before video loads or when not hovering) */
  poster?: string
  /** Alt text for poster image (accessibility) */
  alt?: string
  /** Whether to autoplay the video (ignored when hoverPlay is true) */
  autoplay?: boolean
  /** Play video on hover, show poster otherwise (thumbnail mode) */
  hoverPlay?: boolean
  /** Whether to loop the video */
  loop?: boolean
  /** Whether to mute the video */
  muted?: boolean
  /** Preload behavior for the video element */
  preload?: 'none' | 'metadata' | 'auto'
  /** Object fit style */
  objectFit?: 'cover' | 'contain' | 'fill'
  /** Whether video is a background (absolute positioning) */
  background?: boolean
  /** Aspect ratio for hover-play container (e.g., '16/9') */
  aspectRatio?: string
  /** Time in seconds to seek to for initial frame display (when no poster image) */
  posterTime?: number

  /** Custom loop point: restart from N seconds when video ends instead of 0.
   *  When set and > 0, disables native loop attribute and uses ended event handler. */
  loopStartTime?: number
  /** Adds data-intro-video attribute to the <video> element.
   *  The intro system's useVideoTime hook queries [data-intro-video] to monitor playback timing. */
  introVideo?: boolean

  // Modal integration props
  /** Full-length video URL for modal playback (enables click-to-open) */
  videoUrl?: string
  /** Animation type for modal opening (wipe-left, wipe-right, expand) */
  modalAnimationType?: 'wipe-left' | 'wipe-right' | 'expand'

  /**
   * Click handler injected by WidgetRenderer from schema.on.
   * When provided with videoUrl, clicking triggers this with VideoClickPayload.
   */
  onClick?: (payload: VideoClickPayload) => void

  /**
   * Mouse enter handler injected by WidgetRenderer from schema.on.
   * Forwarded alongside internal hover-play state management.
   */
  onMouseEnter?: () => void

  /**
   * Mouse leave handler injected by WidgetRenderer from schema.on.
   * Forwarded alongside internal hover-play state management.
   */
  onMouseLeave?: () => void
}
