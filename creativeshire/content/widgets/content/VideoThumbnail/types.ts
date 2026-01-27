/**
 * VideoThumbnail widget props interface.
 * Clickable video preview with WATCH overlay.
 */

import type { FeatureSet } from '../../../../schema/features'

/**
 * Props for the VideoThumbnail widget.
 */
export interface VideoThumbnailProps {
  /** Thumbnail image source */
  src: string
  /** Alt text for image accessibility */
  alt: string
  /** Video source for playback (optional) */
  videoSrc?: string
  /** Aspect ratio (default: "16/9") */
  aspectRatio?: string
  /** Whether to show WATCH button overlay (default: true) */
  showWatchButton?: boolean
  /** WATCH button label text (default: "WATCH") */
  watchLabel?: string
  /** Click handler for video modal trigger */
  onClick?: () => void
  /** Static styling features */
  features?: FeatureSet
  /** Additional CSS class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
}
