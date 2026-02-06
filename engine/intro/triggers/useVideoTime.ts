'use client'

/**
 * useVideoTime - watches video currentTime for intro triggers.
 * Queries for [data-intro-video] element and tracks its time.
 */

import { useEffect, useRef } from 'react'
import type { StoreApi } from 'zustand'
import type { IntroStore } from '../IntroContext'

export interface UseVideoTimeOptions {
  /** CSS selector for the video element (default: [data-intro-video]) */
  selector?: string
  /** Target time in seconds to trigger completion */
  targetTime: number
  /** Callback when target time is reached */
  onTargetReached?: () => void
}

/**
 * Hook that monitors video currentTime and updates intro store.
 */
export function useVideoTime(
  store: StoreApi<IntroStore>,
  options: UseVideoTimeOptions
): void {
  const { selector = '[data-intro-video]', targetTime, onTargetReached } = options
  const hasTriggered = useRef(false)

  useEffect(() => {
    if (typeof document === 'undefined') return

    const video = document.querySelector<HTMLVideoElement>(selector)
    if (!video) {
      console.warn(`[Intro] Video element not found: ${selector}`)
      return
    }

    let rafId: number | null = null

    const updateTime = () => {
      const currentTime = video.currentTime
      store.getState().setVideoTime(currentTime)

      // Check if target time reached
      if (!hasTriggered.current && currentTime >= targetTime) {
        hasTriggered.current = true
        onTargetReached?.()
      }

      // Continue polling while video is playing
      if (!video.paused && !video.ended) {
        rafId = requestAnimationFrame(updateTime)
      }
    }

    // Start tracking on play
    const handlePlay = () => {
      updateTime()
    }

    // Update on timeupdate as fallback
    const handleTimeUpdate = () => {
      store.getState().setVideoTime(video.currentTime)

      if (!hasTriggered.current && video.currentTime >= targetTime) {
        hasTriggered.current = true
        onTargetReached?.()
      }
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('timeupdate', handleTimeUpdate)

    // Initial check if video already playing
    if (!video.paused) {
      updateTime()
    }

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [store, selector, targetTime, onTargetReached])
}
