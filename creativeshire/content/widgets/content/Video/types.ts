/**
 * Video widget props interface.
 * Renders a video element with autoplay, loop, muted options.
 */

import type { WidgetBaseProps } from '../../types'

/**
 * Props for the Video widget.
 */
export interface VideoProps extends WidgetBaseProps {
  /** Video source URL */
  src: string
  /** Poster image URL (shown before video loads) */
  poster?: string
  /** Whether to autoplay the video */
  autoplay?: boolean
  /** Whether to loop the video */
  loop?: boolean
  /** Whether to mute the video */
  muted?: boolean
  /** Object fit style */
  objectFit?: 'cover' | 'contain' | 'fill'
}
