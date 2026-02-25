'use client'

/**
 * Video widget (composite).
 * Content Layer (L1) - renders video element with state and hooks.
 *
 * Supports two modes:
 * - Default (autoplay): Video plays automatically, pauses when scrolled out of view
 * - Hover-play: Video plays on hover, shows poster otherwise (thumbnails)
 *
 * Modal integration:
 * - When videoUrl is provided and onClick handler is set (via schema.on),
 *   clicking calls onClick with { videoUrl, poster, rect }
 * - The '{overlayKey}.open' action (registered by ModalRoot) handles opening
 *
 * Why composite (not primitive):
 * - Multiple elements in hover-play mode (div > img + video)
 * - Local state management (useState, useRef, useEffect)
 * - Multiple render modes with different DOM structures
 *
 * Note on useVisibilityPlayback:
 * This hook is colocated here (not in experience/) because it's component-specific.
 * It doesn't write to a store or set CSS variables - it directly controls the video
 * element. Per spec, composites with complex state CAN have colocated hooks.
 */

import React, { memo, forwardRef, useState, useRef, useEffect, useCallback, type CSSProperties } from 'react'
import { useSectionLifecycle } from '../../../../experience'
import { useVisibilityPlayback } from './useVisibilityPlayback'
import { usePlaybackPosition } from '../VideoPlayer/hooks'
import type { VideoProps } from './types'

/**
 * Video widget component.
 * Renders a video with configurable autoplay, loop, and muted options.
 */
const Video = memo(forwardRef<HTMLElement, VideoProps>(function Video({
  src,
  poster,
  alt = '',
  autoplay = true,
  hoverPlay = false,
  loop = true,
  muted = true,
  preload,
  objectFit = 'cover',
  background = false,
  aspectRatio,
  posterTime,
  loopStartTime,
  introVideo,
  className,
  videoUrl,
  modalAnimationType,
  onClick,
  onMouseEnter: onMouseEnterProp,
  onMouseLeave: onMouseLeaveProp,
  overlayTitle,
  'data-behaviour': dataBehaviour,
}, ref) {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced hover handlers to prevent flicker during scroll
  // Small delay prevents brief mouse passes from triggering video playback
  // Also forwards to action handler props (onMouseEnter/onMouseLeave) for cursor label etc.
  const handleMouseEnter = useCallback(() => {
    // Clear any pending leave timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    // Small delay before starting video (prevents scroll flicker)
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true)
    }, 50) // 50ms delay - fast enough to feel instant, slow enough to filter scroll
    // Forward to action handler (e.g. cursorLabel.show) — fires immediately
    onMouseEnterProp?.()
  }, [onMouseEnterProp])

  const handleMouseLeave = useCallback(() => {
    // Clear any pending enter timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    // Immediate leave for responsive feel
    setIsHovered(false)
    // Forward to action handler (e.g. cursorLabel.hide)
    onMouseLeaveProp?.()
  }, [onMouseLeaveProp])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  // Playback position persistence
  const { getPosition } = usePlaybackPosition()

  // Lifecycle awareness for preloading adjacent sections
  const lifecycle = useSectionLifecycle()

  // Pause autoplay videos when scrolled out of view (performance optimization)
  useVisibilityPlayback(videoRef, autoplay && !hoverPlay)

  // Force frame display for autoplay videos.
  // preload="auto" is just a hint — browsers may ignore it. Even when data loads,
  // a paused, never-played video may not render a frame. Seeking to a time offset
  // forces the browser to decode and display a frame.
  // posterTime allows choosing which frame to show (useful when first frame is black).
  //
  // PRELOAD-AWARE: When the section is adjacent (isPreloading), explicitly call
  // video.load() to force the browser to start fetching data. This ensures the
  // frame is decoded and visible before the user navigates to this section.
  useEffect(() => {
    if (hoverPlay || !autoplay) return
    const video = videoRef.current
    if (!video) return

    const targetTime = posterTime ?? 0.001
    const showFrame = () => {
      if (video.paused && video.currentTime === 0) {
        video.currentTime = targetTime
      }
    }

    // When section is preloading (adjacent to active), kick the loading process.
    // Browsers may deprioritize loading for paused off-screen videos even with
    // preload="auto". Calling load() explicitly forces the resource fetch.
    if (lifecycle?.isPreloading && video.networkState === 0) {
      video.load()
    }

    if (video.readyState >= 2) {
      showFrame()
    } else {
      video.addEventListener('loadeddata', showFrame, { once: true })
      return () => video.removeEventListener('loadeddata', showFrame)
    }
  }, [autoplay, hoverPlay, posterTime, lifecycle?.isPreloading])

  // Hover-play mode: control playback based on hover state
  useEffect(() => {
    if (!hoverPlay) return
    const video = videoRef.current
    if (!video) return

    if (isHovered) {
      video.play().catch(() => {
        // Autoplay may be blocked - silent fail
      })
    } else {
      video.pause()
      // Reset to poster frame (or start) when unhovered
      video.currentTime = posterTime ?? 0
    }
  }, [isHovered, hoverPlay, posterTime])

  // Hover-play mode: seek to posterTime on load when no poster image is set.
  // This forces the browser to decode and display a frame so the video isn't black.
  useEffect(() => {
    if (!hoverPlay || poster) return
    const video = videoRef.current
    if (!video) return

    const targetTime = posterTime ?? 0.001
    const showFrame = () => {
      if (video.paused && video.currentTime === 0) {
        video.currentTime = targetTime
      }
    }

    if (video.readyState >= 2) {
      showFrame()
    } else {
      video.addEventListener('loadeddata', showFrame, { once: true })
      return () => video.removeEventListener('loadeddata', showFrame)
    }
  }, [hoverPlay, poster, posterTime])

  // Custom loop point: restart from loopStartTime when video ends
  // When loopStartTime > 0, native loop is disabled and we use ended event instead
  useEffect(() => {
    if (!loopStartTime || loopStartTime <= 0) return
    const video = videoRef.current
    if (!video) return

    const handleEnded = () => {
      video.currentTime = loopStartTime
      video.play().catch(() => {
        // Autoplay may be blocked - silent fail
      })
    }

    video.addEventListener('ended', handleEnded)
    return () => video.removeEventListener('ended', handleEnded)
  }, [loopStartTime])

  // Handle click - calls onClick with payload if videoUrl and handler exist
  const handleClick = useCallback(() => {
    if (!videoUrl || !onClick || !containerRef.current) return

    // Compute animation type: explicit prop takes priority, otherwise read from CSS variable
    let animationType = modalAnimationType
    if (!animationType) {
      const reversedAncestor = containerRef.current.closest('[data-reversed]')
      if (reversedAncestor) {
        animationType = reversedAncestor.getAttribute('data-reversed') === 'true' ? 'wipe-right' : 'wipe-left'
      } else {
        animationType = 'wipe-left'
      }
    }

    const rect = containerRef.current.getBoundingClientRect()
    const startTime = getPosition(videoUrl)

    onClick({
      videoUrl,
      poster,
      rect,
      startTime: startTime > 0 ? startTime : undefined,
      animationType,
    })
  }, [videoUrl, poster, onClick, getPosition, modalAnimationType])

  // Default mode: render video element with visibility-based playback
  if (!hoverPlay) {
    const classes = [
      'video-widget',
      background && 'video-widget--background',
      className,
    ].filter(Boolean).join(' ')

    // Disable native loop when custom loop point is set (handled by ended event)
    const useNativeLoop = loop && !(loopStartTime && loopStartTime > 0)

    return (
      <video
        ref={(node) => {
          (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node
        }}
        src={src || undefined}
        poster={poster}
        loop={useNativeLoop}
        muted={muted}
        playsInline
        preload={preload ?? (autoplay ? 'auto' : undefined)}
        className={classes}
        data-behaviour={dataBehaviour}
        data-intro-video={introVideo || undefined}
        style={!background ? { objectFit, ...(aspectRatio ? { aspectRatio } : {}) } : undefined}
      />
    )
  }

  // Hover-play mode: container with poster + video crossfade
  const containerClasses = [
    'video-widget',
    'video-widget--hover-play',
    videoUrl && onClick && 'video-widget--clickable',
    className,
  ].filter(Boolean).join(' ')

  const containerStyle: CSSProperties = {
    aspectRatio: aspectRatio ?? '16/9',
    cursor: videoUrl && onClick ? 'pointer' : undefined,
  }

  return (
    <div
      ref={(node) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node
      }}
      className={containerClasses}
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      data-behaviour={dataBehaviour}
    >
      {/* Poster image - visible when not hovering */}
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt={alt}
          className={`video-widget__poster ${isHovered ? 'video-widget__poster--hidden' : ''}`}
          style={{ objectFit }}
          data-effect="media-crossfade"
        />
      )}

      {/* Video - visible when hovering (or always visible when no poster for frame preview) */}
      <video
        ref={videoRef}
        src={src || undefined}
        loop={loop && !(loopStartTime && loopStartTime > 0)}
        muted={muted}
        playsInline
        preload={preload ?? 'metadata'}
        className={`video-widget__video ${(isHovered || !poster) ? 'video-widget__video--visible' : ''}`}
        style={{ objectFit }}
        data-effect="media-crossfade"
        data-intro-video={introVideo || undefined}
      />

      {/* Title overlay - fades in with hover */}
      {overlayTitle && (
        <div className={`video-widget__overlay-title ${isHovered ? 'video-widget__overlay-title--visible' : ''}`}>
          <span>{overlayTitle}</span>
        </div>
      )}
    </div>
  )
}))

export default Video
