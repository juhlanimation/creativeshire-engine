'use client'

/**
 * useVideoTime - watches video currentTime for intro triggers.
 * Queries for [data-intro-video] element and tracks its time.
 *
 * Resilient to the video element being recreated in the DOM
 * (e.g., portal switch from inline to pinned backdrop).
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

    let rafId: number | null = null
    let retryTimer: ReturnType<typeof setInterval> | null = null
    let currentVideo: HTMLVideoElement | null = null

    const updateTime = () => {
      if (!currentVideo) return
      const time = currentVideo.currentTime
      store.getState().setVideoTime(time)

      if (!hasTriggered.current && time >= targetTime) {
        hasTriggered.current = true
        onTargetReached?.()
      }

      // Continue polling while video is playing
      if (!currentVideo.paused && !currentVideo.ended) {
        rafId = requestAnimationFrame(updateTime)
      } else if (!hasTriggered.current) {
        // Video paused unexpectedly (e.g., DOM removal during portal switch)
        // Retry finding the new video element
        startRetry()
      }
    }

    const handlePlay = () => updateTime()

    const handleTimeUpdate = () => {
      if (!currentVideo) return
      store.getState().setVideoTime(currentVideo.currentTime)

      if (!hasTriggered.current && currentVideo.currentTime >= targetTime) {
        hasTriggered.current = true
        onTargetReached?.()
      }
    }

    function attachToVideo(video: HTMLVideoElement) {
      // Detach from previous video if different
      if (currentVideo && currentVideo !== video) {
        currentVideo.removeEventListener('play', handlePlay)
        currentVideo.removeEventListener('timeupdate', handleTimeUpdate)
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
      }

      currentVideo = video
      video.addEventListener('play', handlePlay)
      video.addEventListener('timeupdate', handleTimeUpdate)

      // Start tracking immediately if already playing
      if (!video.paused) {
        updateTime()
      }
    }

    function startRetry() {
      if (retryTimer || hasTriggered.current) return
      retryTimer = setInterval(() => {
        const video = document.querySelector<HTMLVideoElement>(selector)
        if (video && video !== currentVideo) {
          clearInterval(retryTimer!)
          retryTimer = null
          attachToVideo(video)
        }
      }, 100)
    }

    // Initial query
    const video = document.querySelector<HTMLVideoElement>(selector)
    if (video) {
      attachToVideo(video)
    } else {
      startRetry()
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      if (retryTimer) clearInterval(retryTimer)
      if (currentVideo) {
        currentVideo.removeEventListener('play', handlePlay)
        currentVideo.removeEventListener('timeupdate', handleTimeUpdate)
      }
    }
  }, [store, selector, targetTime, onTargetReached])
}
