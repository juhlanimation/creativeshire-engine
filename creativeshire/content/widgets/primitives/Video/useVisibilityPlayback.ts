'use client'

/**
 * useVisibilityPlayback - pauses video when scrolled out of view.
 * L2 Experience hook - handles visibility observation.
 *
 * Uses IntersectionObserver to detect when video leaves viewport,
 * then imperatively controls play/pause for performance.
 */

import { useEffect, type RefObject } from 'react'

/**
 * Pauses video when scrolled out of view, resumes when visible.
 *
 * @param videoRef - Reference to the video element
 * @param enabled - Whether visibility-based playback is enabled (default: true)
 * @param threshold - Visibility threshold to trigger pause (default: 0.1 = 10%)
 */
export function useVisibilityPlayback(
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled: boolean = true,
  threshold: number = 0.1
): void {
  useEffect(() => {
    if (!enabled) return
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Autoplay may be blocked by browser - silent fail
          })
        } else {
          video.pause()
        }
      },
      { threshold }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [videoRef, enabled, threshold])
}
