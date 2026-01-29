'use client'

/**
 * VideoPlayer composite widget.
 * Matches bo-juhl-portfolio video player exactly.
 *
 * Layout (from bojuhl):
 * - Video: absolute inset-0, object-contain, starts opacity 0
 * - Center play: w-20 h-20, bg-white/20 backdrop-blur-sm
 * - Progress bar: bottom-24 (6rem), left-8 right-8 (2rem)
 * - Volume control: bottom-8 (2rem), centered pill bg-white/10
 *
 * Animation sequence (from bojuhl):
 * 1. Wipe animation reveals black background
 * 2. After wipe completes, video fades from opacity 0 to 1
 * 3. Video starts playing during the fade-in
 *
 * Features:
 * - Autoplay after video is ready (not on mount)
 * - Play/pause with center button
 * - Seekable progress bar with scrubber
 * - Volume control with mute
 * - Time display (current / duration)
 * - Auto-hide controls when playing
 * - Playback position persistence
 */

import { useRef, useState, useCallback, useEffect, memo } from 'react'
import { gsap } from 'gsap'
import { useVideoControls, useAutoSavePosition } from './hooks'
import type { VideoPlayerProps, VideoPlayerControls } from './types'
import './styles.css'

/**
 * Format seconds to MM:SS or HH:MM:SS.
 */
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00'

  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Play icon SVG - matches bojuhl exactly.
 */
function PlayIcon() {
  return (
    <svg className="video-player__play-icon" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

/**
 * Volume icons SVG - matches bojuhl exactly.
 */
function VolumeIcon({ volume }: { volume: number }) {
  if (volume === 0) {
    return (
      <svg className="video-player__volume-icon" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
      </svg>
    )
  }

  if (volume < 0.5) {
    return (
      <svg className="video-player__volume-icon" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
      </svg>
    )
  }

  return (
    <svg className="video-player__volume-icon" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  )
}

/**
 * VideoPlayer component.
 * Matches bo-juhl-portfolio video player layout exactly.
 */
const VideoPlayer = memo(function VideoPlayer({
  src,
  poster,
  autoPlay = true,
  startTime,
  onTimeUpdate,
  onEnded,
  onInit,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [showControls, setShowControls] = useState(true)
  const [videoReady, setVideoReady] = useState(false)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Video controls hook (handles state, NOT autoplay)
  const controls = useVideoControls(videoRef, false, startTime)

  // Auto-save position
  useAutoSavePosition(videoRef, src)

  // Handle video ready - fade in and play (matches bojuhl.com)
  const handleCanPlay = useCallback(() => {
    if (videoReady) return
    setVideoReady(true)

    const video = videoRef.current
    if (!video) return

    // Set start time if provided
    if (startTime !== undefined && startTime > 0) {
      video.currentTime = startTime
    }

    // Autoplay if enabled
    if (autoPlay) {
      video.play().catch(() => {
        // Autoplay blocked - silent fail, user can click play
      })
    }

    // Expose control methods to parent (for modal close, etc.)
    onInit?.({
      pause: () => video.pause(),
      play: () => video.play(),
      getCurrentTime: () => video.currentTime,
    })

    // Fade video in from opacity 0 (matches bojuhl.com sequence)
    gsap.to(video, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.inOut',
    })
  }, [videoReady, autoPlay, startTime, onInit])

  // Report time updates to parent
  const handleTimeUpdate = useCallback(() => {
    if (onTimeUpdate && videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime)
    }
  }, [onTimeUpdate])

  // Handle video end
  const handleEnded = useCallback(() => {
    onEnded?.()
  }, [onEnded])

  // Handle progress bar seek
  const handleProgressSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current
    if (!bar) return

    const rect = bar.getBoundingClientRect()
    const percent = ((e.clientX - rect.left) / rect.width) * 100
    controls.seekPercent(Math.max(0, Math.min(100, percent)))
  }, [controls])

  // Auto-hide controls on mouse idle
  const handleMouseMove = useCallback(() => {
    setShowControls(true)

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    if (controls.isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }, [controls.isPlaying])

  const controlsVisible = showControls || !controls.isPlaying

  const containerClasses = [
    'video-player',
    !controlsVisible && 'video-player--hide-cursor',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div
      className={containerClasses}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(true)}
    >
      {/* Video element - absolute inset-0, object-contain */}
      {/* Starts opacity 0, fades in when ready (matches bojuhl.com) */}
      <video
        ref={videoRef}
        className="video-player__video"
        src={src}
        poster={poster}
        playsInline
        preload="auto"
        style={{ opacity: 0 }}
        onClick={controls.togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onCanPlay={handleCanPlay}
      />

      {/* Center play button - shown when paused */}
      {/* Matches bojuhl: w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm */}
      {!controls.isPlaying && (
        <div
          className="video-player__center-overlay"
          onClick={controls.togglePlay}
        >
          <div className="video-player__center-play">
            <PlayIcon />
          </div>
        </div>
      )}

      {/* Controls overlay - fades in/out */}
      <div
        className={`video-player__controls ${controlsVisible ? 'video-player__controls--visible' : ''}`}
      >
        {/* Progress bar - bottom-24 left-8 right-8 (matches bojuhl) */}
        <div className="video-player__progress-container">
          <span className="video-player__time video-player__time--current">
            {formatTime(controls.currentTime)}
          </span>

          <div
            ref={progressRef}
            className="video-player__progress"
            onMouseDown={handleProgressSeek}
          >
            <div
              className="video-player__progress-fill"
              style={{ width: `${controls.progress}%` }}
            />
            <div
              className="video-player__progress-scrubber"
              style={{ left: `calc(${controls.progress}% - 8px)` }}
            />
          </div>

          <span className="video-player__time video-player__time--duration">
            {formatTime(controls.duration)}
          </span>
        </div>

        {/* Volume control - bottom-8, centered pill (matches bojuhl) */}
        <div className="video-player__volume-container">
          <button
            type="button"
            className="video-player__volume-button"
            onClick={controls.toggleMute}
            aria-label={controls.isMuted ? 'Unmute' : 'Mute'}
          >
            <VolumeIcon volume={controls.isMuted ? 0 : controls.volume} />
          </button>

          <input
            type="range"
            className="video-player__volume-slider"
            min={0}
            max={1}
            step={0.01}
            value={controls.isMuted ? 0 : controls.volume}
            onChange={(e) => controls.setVolume(parseFloat(e.target.value))}
            aria-label="Volume"
          />
        </div>
      </div>

      {/* Buffering indicator */}
      {controls.isBuffering && (
        <div className="video-player__buffering" aria-label="Loading" />
      )}
    </div>
  )
})

export default VideoPlayer
export type { VideoPlayerProps }
