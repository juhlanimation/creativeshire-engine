/**
 * useVideoControls - manages video playback state.
 * Handles play/pause, seek, volume, and progress tracking.
 */

'use client'

import { useState, useEffect, useCallback, type RefObject } from 'react'

export interface VideoControlsState {
  isPlaying: boolean
  isMuted: boolean
  volume: number
  currentTime: number
  duration: number
  progress: number
  isBuffering: boolean
}

export interface VideoControlsActions {
  play: () => void
  pause: () => void
  togglePlay: () => void
  seek: (time: number) => void
  seekPercent: (percent: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
}

export interface UseVideoControlsReturn extends VideoControlsState, VideoControlsActions {}

/**
 * Hook for managing video playback controls.
 * Handles state sync and actions only - autoplay is handled by component.
 * @param videoRef - Ref to the video element
 */
export function useVideoControls(
  videoRef: RefObject<HTMLVideoElement | null>
): UseVideoControlsReturn {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolumeState] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isBuffering, setIsBuffering] = useState(false)

  // Sync state with video element events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleDurationChange = () => setDuration(video.duration || 0)
    const handleVolumeChange = () => {
      setVolumeState(video.volume)
      setIsMuted(video.muted)
    }
    const handleWaiting = () => setIsBuffering(true)
    const handlePlaying = () => setIsBuffering(false)
    const handleCanPlay = () => setIsBuffering(false)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('volumechange', handleVolumeChange)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('playing', handlePlaying)
    video.addEventListener('canplay', handleCanPlay)

    // Initialize state from video element on mount
    // Safe: one-time initialization with event listeners for subsequent updates
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDuration(video.duration || 0)
    setVolumeState(video.volume)
    setIsMuted(video.muted)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('volumechange', handleVolumeChange)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('playing', handlePlaying)
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [videoRef])

  // NOTE: Autoplay and startTime are handled by the VideoPlayer component's handleCanPlay
  // This hook just manages state and provides actions

  // Actions
  const play = useCallback(() => {
    videoRef.current?.play().catch(() => {})
  }, [videoRef])

  const pause = useCallback(() => {
    videoRef.current?.pause()
  }, [videoRef])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [videoRef])

  const seek = useCallback((time: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Math.max(0, Math.min(time, video.duration || 0))
  }, [videoRef])

  const seekPercent = useCallback((percent: number) => {
    const video = videoRef.current
    if (!video || !video.duration) return
    video.currentTime = (percent / 100) * video.duration
  }, [videoRef])

  const setVolume = useCallback((vol: number) => {
    const video = videoRef.current
    if (!video) return
    video.volume = Math.max(0, Math.min(1, vol))
    if (vol > 0 && video.muted) {
      video.muted = false
    }
  }, [videoRef])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
  }, [videoRef])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return {
    // State
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    progress,
    isBuffering,
    // Actions
    play,
    pause,
    togglePlay,
    seek,
    seekPercent,
    setVolume,
    toggleMute,
  }
}
