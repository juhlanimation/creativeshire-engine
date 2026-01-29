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
 * - modalTransition: Type of transition when opening modal
 * - modalDirection: Direction for mask-wipe transition
 *
 * Why composite (not primitive):
 * - Multiple elements in hover-play mode (div > img + video)
 * - Local state management (useState, useRef, useEffect)
 * - Two render modes with different DOM structures
 * - Modal integration with complex callbacks
 *
 * See TASK-027 decision in composite/CLAUDE.md for rationale.
 */

import type { WidgetBaseProps } from '../../types'
import type { TransitionType, WipeDirection } from '@/creativeshire/content/chrome/overlays/Modal/types'

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
  /** Object fit style */
  objectFit?: 'cover' | 'contain' | 'fill'
  /** Whether video is a background (absolute positioning) */
  background?: boolean
  /** Aspect ratio for hover-play container (e.g., '16/9') */
  aspectRatio?: string

  // Modal integration props
  /** Full-length video URL for modal playback (enables click-to-open) */
  videoUrl?: string
  /** Transition type for modal (default: 'mask-wipe') */
  modalTransition?: TransitionType
  /** Direction for mask-wipe transition */
  modalDirection?: WipeDirection
}
