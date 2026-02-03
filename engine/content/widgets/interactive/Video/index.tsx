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
 * - The 'open-video-modal' action (registered by ModalRoot) handles opening
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

import { useState, useRef, useEffect, useCallback, type CSSProperties } from 'react'
import { useVisibilityPlayback } from './useVisibilityPlayback'
import { usePlaybackPosition } from '../VideoPlayer/hooks'
import type { VideoProps } from './types'
import './styles.css'

/**
 * Video widget component.
 * Renders a video with configurable autoplay, loop, and muted options.
 */
export default function Video({
  src,
  poster,
  alt = '',
  autoplay = true,
  hoverPlay = false,
  loop = true,
  muted = true,
  objectFit = 'cover',
  background = false,
  aspectRatio,
  className,
  videoUrl,
  modalAnimationType,
  onClick,
  'data-behaviour': dataBehaviour,
}: VideoProps) {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced hover handlers to prevent flicker during scroll
  // Small delay prevents brief mouse passes from triggering video playback
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
  }, [])

  const handleMouseLeave = useCallback(() => {
    // Clear any pending enter timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    // Immediate leave for responsive feel
    setIsHovered(false)
  }, [])

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

  // Pause autoplay videos when scrolled out of view (performance optimization)
  useVisibilityPlayback(videoRef, autoplay && !hoverPlay)

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
      video.currentTime = 0
    }
  }, [isHovered, hoverPlay])

  // Handle click - calls onClick with payload if videoUrl and handler exist
  const handleClick = useCallback(() => {
    if (!videoUrl || !onClick || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const startTime = getPosition(videoUrl)

    onClick({
      videoUrl,
      poster,
      rect,
      startTime: startTime > 0 ? startTime : undefined,
      animationType: modalAnimationType,
    })
  }, [videoUrl, poster, onClick, getPosition, modalAnimationType])

  // Default mode: render video element with visibility-based playback
  if (!hoverPlay) {
    const classes = [
      'video-widget',
      background && 'video-widget--background',
      className,
    ].filter(Boolean).join(' ')

    return (
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        playsInline
        className={classes}
        data-behaviour={dataBehaviour}
        style={!background ? { objectFit } : undefined}
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
      ref={containerRef}
      className={containerClasses}
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      data-behaviour={dataBehaviour}
    >
      {/* Poster image - visible when not hovering */}
      {poster && (
        <img
          src={poster}
          alt={alt}
          className={`video-widget__poster ${isHovered ? 'video-widget__poster--hidden' : ''}`}
          style={{ objectFit }}
          data-effect="media-crossfade"
        />
      )}

      {/* Video - visible and playing when hovering */}
      <video
        ref={videoRef}
        src={src}
        loop={loop}
        muted={muted}
        playsInline
        preload="metadata"
        className={`video-widget__video ${isHovered ? 'video-widget__video--visible' : ''}`}
        style={{ objectFit }}
        data-effect="media-crossfade"
      />
    </div>
  )
}
