'use client'

/**
 * useSmoothModalScroll - GSAP-based smooth scrolling for modal containers.
 *
 * Uses the same smooth settings as the main site's ScrollSmoother.
 * Gets smooth value from SmoothScrollProvider context.
 */

import { useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { useSmoothScroll } from '@/engine/experience/SmoothScrollProvider'

/**
 * Apply GSAP smooth scrolling to a scrollable container.
 * Uses site-wide smooth scroll settings from context.
 */
export function useSmoothModalScroll(
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean = true
) {
  const smoothScroll = useSmoothScroll()

  useEffect(() => {
    if (!enabled) return
    const container = containerRef.current
    if (!container) return

    // Get smooth value from site settings (0 = disabled)
    const smoothValue = smoothScroll?.getSmoothValue() ?? 0
    if (smoothValue === 0) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Calculate duration based on smooth value (higher smooth = longer duration)
    const duration = smoothValue * 0.8

    // Track target scroll position
    let targetScroll = container.scrollTop
    let tween: gsap.core.Tween | null = null

    // Handle wheel events - added to document to intercept before normalizeScroll
    const handleWheel = (e: WheelEvent) => {
      // Only handle if the event target is inside our container
      const target = e.target as Node
      if (!container.contains(target)) {
        return
      }

      e.preventDefault()
      e.stopPropagation()

      // Update target scroll position
      const maxScroll = container.scrollHeight - container.clientHeight
      targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + e.deltaY))

      // Kill existing tween and create new one
      if (tween) {
        tween.kill()
      }

      tween = gsap.to(container, {
        scrollTop: targetScroll,
        duration,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    // Add to document with capture: true to intercept BEFORE normalizeScroll
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true })

    return () => {
      document.removeEventListener('wheel', handleWheel, { capture: true })
      if (tween) {
        tween.kill()
      }
    }
  }, [containerRef, enabled, smoothScroll])
}

export default useSmoothModalScroll
