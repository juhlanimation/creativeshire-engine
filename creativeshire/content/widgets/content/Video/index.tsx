/**
 * Video widget.
 * Renders a video element, typically used for hero backgrounds.
 */

import type { VideoProps } from './types'

/**
 * Video widget component.
 * Renders a video with configurable autoplay, loop, and muted options.
 */
export default function Video({
  src,
  poster,
  autoplay = true,
  loop = true,
  muted = true,
  objectFit = 'cover',
  className,
}: VideoProps) {
  return (
    <video
      src={src}
      poster={poster}
      autoPlay={autoplay}
      loop={loop}
      muted={muted}
      playsInline
      className={className}
      style={{
        width: '100%',
        height: '100%',
        objectFit,
      }}
    />
  )
}
