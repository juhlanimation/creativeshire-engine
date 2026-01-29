/**
 * usePlaybackPosition - persists video playback position.
 * Remembers where the user left off for each video URL.
 */

'use client'

import { useCallback, useRef, useEffect } from 'react'

/**
 * In-memory storage for playback positions.
 * Persists across component mounts but not page reloads.
 */
const playbackPositions = new Map<string, number>()

/**
 * Throttle interval for saving position (ms).
 */
const SAVE_INTERVAL = 1000

export interface UsePlaybackPositionReturn {
  /** Get stored position for URL (returns 0 if not found) */
  getPosition: (url: string) => number
  /** Save position for URL */
  savePosition: (url: string, time: number) => void
  /** Clear position for URL */
  clearPosition: (url: string) => void
  /** Get all stored positions */
  getAllPositions: () => Map<string, number>
}

/**
 * Hook for managing video playback positions.
 * Provides throttled saving to prevent excessive updates.
 */
export function usePlaybackPosition(): UsePlaybackPositionReturn {
  const lastSaveTime = useRef<Map<string, number>>(new Map())

  const getPosition = useCallback((url: string): number => {
    return playbackPositions.get(url) ?? 0
  }, [])

  const savePosition = useCallback((url: string, time: number): void => {
    const now = Date.now()
    const lastSave = lastSaveTime.current.get(url) ?? 0

    // Throttle saves
    if (now - lastSave < SAVE_INTERVAL) {
      return
    }

    playbackPositions.set(url, time)
    lastSaveTime.current.set(url, now)
  }, [])

  const clearPosition = useCallback((url: string): void => {
    playbackPositions.delete(url)
    lastSaveTime.current.delete(url)
  }, [])

  const getAllPositions = useCallback((): Map<string, number> => {
    return new Map(playbackPositions)
  }, [])

  return {
    getPosition,
    savePosition,
    clearPosition,
    getAllPositions,
  }
}

/**
 * Auto-save position hook.
 * Automatically saves position on timeupdate and clears on video end.
 */
export function useAutoSavePosition(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  url: string,
  enabled = true
): void {
  const { savePosition, clearPosition, getPosition } = usePlaybackPosition()
  const initialPositionRef = useRef<number | null>(null)

  // Get initial position on mount
  useEffect(() => {
    if (enabled && url) {
      initialPositionRef.current = getPosition(url)
    }
  }, [enabled, url, getPosition])

  // Set initial position when video is ready
  useEffect(() => {
    const video = videoRef.current
    if (!video || !enabled || initialPositionRef.current === null) return

    const position = initialPositionRef.current
    if (position > 0) {
      const handleLoadedMetadata = () => {
        // Don't seek if near the end
        if (position < video.duration - 1) {
          video.currentTime = position
        }
      }

      if (video.readyState >= 1) {
        handleLoadedMetadata()
      } else {
        video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true })
      }
    }
  }, [videoRef, enabled])

  // Save position on timeupdate
  useEffect(() => {
    const video = videoRef.current
    if (!video || !enabled || !url) return

    const handleTimeUpdate = () => {
      savePosition(url, video.currentTime)
    }

    const handleEnded = () => {
      // Clear position when video ends (user watched to completion)
      clearPosition(url)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [videoRef, enabled, url, savePosition, clearPosition])
}
