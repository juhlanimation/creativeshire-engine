/**
 * VideoPlayer composite widget types.
 * Full-featured video player for modal playback.
 */

import type { WidgetBaseProps } from '../../types'

/**
 * Exposed control methods for external callers.
 * Allows parent components to control playback without coupling.
 */
export interface VideoPlayerControls {
  /** Pause video playback */
  pause: () => void
  /** Start video playback */
  play: () => void
  /** Get current playback time */
  getCurrentTime: () => number
  /** Hide play button and controls overlay (for programmatic pause without UI flash) */
  suppressUI: () => void
}

/**
 * VideoPlayer props.
 */
export interface VideoPlayerProps extends WidgetBaseProps {
  /** Video source URL */
  src: string
  /** Poster image URL */
  poster?: string
  /** Auto-play on mount (default: true) */
  autoPlay?: boolean
  /** Start playback at this time (seconds) */
  startTime?: number
  /** Called when playback time updates */
  onTimeUpdate?: (currentTime: number) => void
  /** Called when video ends */
  onEnded?: () => void
  /** Called with control methods after video is ready - allows parent to control playback */
  onInit?: (controls: VideoPlayerControls) => void
  /** Additional className */
  className?: string
}
