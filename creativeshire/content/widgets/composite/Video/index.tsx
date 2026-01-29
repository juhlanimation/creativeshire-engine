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
 * - When videoUrl is provided, clicking opens a fullscreen modal
 * - modalTransition and modalDirection control the modal animation
 *
 * Why composite (not primitive):
 * - Multiple elements in hover-play mode (div > img + video)
 * - Local state management (useState, useRef, useEffect)
 * - Multiple render modes with different DOM structures
 * - Modal integration with complex callbacks
 *
 * Note on useVisibilityPlayback:
 * This hook is colocated here (not in experience/) because it's component-specific.
 * It doesn't write to a store or set CSS variables - it directly controls the video
 * element. Per spec, composites with complex state CAN have colocated hooks.
 */

import { useState, useRef, useEffect, useCallback, type CSSProperties } from 'react'
import { useVisibilityPlayback } from './useVisibilityPlayback'
import { openModal } from '@/creativeshire/content/chrome/overlays/Modal'
import { VideoPlayer } from '@/creativeshire/content/widgets/composite'
import { usePlaybackPosition } from '@/creativeshire/content/widgets/composite/VideoPlayer/hooks'
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
  modalTransition = 'mask-wipe',
  modalDirection = 'left',
  'data-behaviour': dataBehaviour,
}: VideoProps) {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // Handle click to open modal
  const handleClick = useCallback(() => {
    if (!videoUrl || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()

    // Get stored playback position
    const startTime = getPosition(videoUrl)

    // Generate unique modal ID based on video URL
    const modalId = `video-modal-${videoUrl.replace(/[^a-z0-9]/gi, '-')}`

    // Map modalDirection to animationType for wipe transitions
    const animationType = modalDirection === 'right' ? 'wipe-right' : 'wipe-left'

    // Capture video controls for pause on close
    let videoControls: { pause: () => void } | null = null

    openModal(modalId, {
      content: (
        <VideoPlayer
          src={videoUrl}
          poster={poster}
          autoPlay
          startTime={startTime > 0 ? startTime : undefined}
          onInit={(controls) => {
            videoControls = controls
          }}
        />
      ),
      animationType,
      sourceRect: rect,
      sequenceContentFade: true,
      // No backdrop for video modals - matches bojuhl.com
      backdropColor: 'transparent',
      onBeforeClose: () => {
        // Pause video immediately before close animation starts
        videoControls?.pause()
      },
    })
  }, [videoUrl, poster, modalDirection, getPosition])

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
    videoUrl && 'video-widget--clickable',
    className,
  ].filter(Boolean).join(' ')

  const containerStyle: CSSProperties = {
    aspectRatio: aspectRatio ?? '16/9',
    cursor: videoUrl ? 'pointer' : undefined,
  }

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
