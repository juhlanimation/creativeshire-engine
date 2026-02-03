'use client'

/**
 * useVisibilityPlayback - pauses video when scrolled out of view.
 *
 * This is a COMPONENT-SPECIFIC hook, NOT an L2 experience hook because:
 * 1. It doesn't write to a Zustand store (L2 triggers do)
 * 2. It doesn't set CSS variables (L2 behaviours do)
 * 3. It directly controls the video element imperatively
 *
 * Per the architecture, composites with complex state CAN have colocated hooks
 * when those hooks are component-specific. This hook is tightly coupled to
 * the Video widget's playback management and has no general-purpose use.
 *
 * Uses IntersectionObserver to detect when video leaves viewport,
 * then imperatively controls play/pause for performance.
 *
 * LIFECYCLE-AWARE: In navigable experiences (where SectionLifecycleProvider exists),
 * this hook responds immediately to lifecycle.isActive instead of relying on
 * IntersectionObserver. This provides instant pause/resume on section transitions.
 */

import { useEffect, type RefObject } from 'react'
import { useSectionLifecycle } from '../../../../experience'

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
  const lifecycle = useSectionLifecycle()

  useEffect(() => {
    if (!enabled) return
    const video = videoRef.current
    if (!video) return

    // If in navigable experience (lifecycle context available),
    // use lifecycle.isActive instead of IntersectionObserver
    if (lifecycle) {
      if (lifecycle.isActive) {
        video.play().catch(() => {
          // Autoplay may be blocked by browser - silent fail
        })
      } else {
        video.pause()
      }
      return // Skip IO setup - lifecycle handles visibility
    }

    // Normal mode (stacking): use IntersectionObserver
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
  }, [videoRef, enabled, threshold, lifecycle?.isActive])
}
