'use client'

/**
 * useSmoothScrollContainer - GSAP-based smooth scrolling for any container.
 *
 * Unified hook that provides butter-smooth scrolling to any scrollable element.
 * Uses GSAP tweening for smooth interpolation (same approach as ScrollSmoother).
 *
 * Architecture: Experience layer (L2 - motion/animation).
 *
 * Features:
 * - GSAP tween-based smooth scrolling with power2.out easing
 * - Device-aware (Mac trackpad, touch, reduced motion)
 * - Inherits smooth values from SmoothScrollProvider context (if available)
 * - Boundary callbacks for navigation coordination
 * - Works on any scrollable container
 * - Zero overhead when disabled (early exit, no listeners)
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const containerRef = useRef<HTMLDivElement>(null)
 *
 *   useSmoothScrollContainer(containerRef, {
 *     enabled: true,
 *     onBoundary: (dir, delta) => console.log('Hit', dir),
 *   })
 *
 *   return <div ref={containerRef} style={{ overflow: 'auto' }}>...</div>
 * }
 * ```
 */

import { useEffect, useRef, useCallback, type RefObject } from 'react'
import { gsap } from 'gsap'
import { useSmoothScroll } from './SmoothScrollProvider'

// =============================================================================
// Types
// =============================================================================

export type BoundaryDirection = 'top' | 'bottom'

export interface SmoothScrollContainerConfig {
  /** Whether smooth scrolling is enabled. Default: true */
  enabled?: boolean
  /**
   * Smoothing factor (higher = slower/smoother). Default: 1.2
   * If not provided, inherits from SmoothScrollProvider context.
   */
  smooth?: number
  /**
   * Smoothing factor for Mac trackpads. Default: 0.5
   * If not provided, inherits from SmoothScrollProvider context.
   */
  smoothMac?: number
  /**
   * Callback when scroll reaches a boundary.
   * Called BEFORE passthrough, useful for logging or state updates.
   */
  onBoundary?: (direction: BoundaryDirection, delta: number) => void
  /**
   * Callback when wheel event is passed through (not consumed).
   * Called when at boundary or container not scrollable.
   * Return true to prevent default, false to let event propagate.
   */
  onPassthrough?: (event: WheelEvent, direction: BoundaryDirection) => boolean | void
}

export interface SmoothScrollContainerReturn {
  /** Scroll to a specific position */
  scrollTo: (position: number, instant?: boolean) => void
  /** Get current interpolated scroll position */
  getScroll: () => number
  /** Get target scroll position (where it's heading) */
  getTargetScroll: () => number
  /** Check if currently at a boundary */
  isAtBoundary: (direction: BoundaryDirection) => boolean
  /** Whether currently animating */
  isScrolling: () => boolean
  /** Stop smooth scrolling (snap to target) */
  stop: () => void
}

// =============================================================================
// Defaults
// =============================================================================

const DEFAULTS = {
  enabled: true,
  smooth: 1.2,
  smoothMac: 0.5,
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Apply GSAP smooth scrolling to any scrollable container.
 *
 * @param containerRef - Ref to the scrollable container element
 * @param config - Configuration options
 * @returns Control methods for the smooth scroll
 */
export function useSmoothScrollContainer(
  containerRef: RefObject<HTMLElement | null>,
  config?: SmoothScrollContainerConfig
): SmoothScrollContainerReturn {
  const {
    enabled = DEFAULTS.enabled,
    smooth: smoothOverride,
    smoothMac: smoothMacOverride,
    onBoundary,
    onPassthrough,
  } = config ?? {}

  // Try to get smooth values from page-level provider
  const smoothScrollContext = useSmoothScroll()

  // Refs for scroll state
  const targetScrollRef = useRef(0)
  const currentScrollRef = useRef(0)
  const isScrollingRef = useRef(false)
  const smoothValueRef = useRef(DEFAULTS.smooth)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  /**
   * Determine effective smooth value based on device and config.
   */
  const getEffectiveSmoothValue = useCallback((): number => {
    // Check device conditions
    const isTouchDevice =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    const isMac =
      typeof navigator !== 'undefined' &&
      /Mac|Macintosh/.test(navigator.userAgent) &&
      !isTouchDevice
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Disabled for touch or reduced motion
    if (isTouchDevice || prefersReducedMotion) {
      return 0
    }

    // Use overrides if provided
    if (isMac && smoothMacOverride !== undefined) {
      return smoothMacOverride
    }
    if (!isMac && smoothOverride !== undefined) {
      return smoothOverride
    }

    // Fall back to context values
    if (smoothScrollContext) {
      return smoothScrollContext.getSmoothValue()
    }

    // Fall back to defaults
    return isMac ? DEFAULTS.smoothMac : DEFAULTS.smooth
  }, [smoothOverride, smoothMacOverride, smoothScrollContext])

  /**
   * Check if at a boundary.
   */
  const isAtBoundary = useCallback(
    (direction: BoundaryDirection): boolean => {
      const container = containerRef.current
      if (!container) return true

      const { scrollHeight, clientHeight } = container
      const maxScroll = scrollHeight - clientHeight

      // Not scrollable at all
      if (maxScroll <= 0) return true

      if (direction === 'top') {
        return targetScrollRef.current <= 1
      } else {
        return targetScrollRef.current >= maxScroll - 1
      }
    },
    [containerRef]
  )

  /**
   * Scroll to position.
   */
  const scrollTo = useCallback(
    (position: number, instant = false) => {
      const container = containerRef.current
      if (!container) return

      const maxScroll = container.scrollHeight - container.clientHeight
      const clamped = Math.max(0, Math.min(position, maxScroll))

      if (instant || smoothValueRef.current === 0) {
        container.scrollTop = clamped
        currentScrollRef.current = clamped
        targetScrollRef.current = clamped
        isScrollingRef.current = false
      } else {
        targetScrollRef.current = clamped
        isScrollingRef.current = true
      }
    },
    [containerRef]
  )

  /**
   * Stop scrolling (snap to target).
   */
  const stop = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    container.scrollTop = targetScrollRef.current
    currentScrollRef.current = targetScrollRef.current
    isScrollingRef.current = false
  }, [containerRef])

  // Main effect
  useEffect(() => {
    if (!enabled) return

    const container = containerRef.current
    if (!container) return

    // Calculate smooth value (returns 0 for touch devices and reduced motion)
    const smoothValue = getEffectiveSmoothValue()
    smoothValueRef.current = smoothValue

    // Skip entirely for touch devices / reduced motion
    // Native scroll is better on these devices
    if (smoothValue === 0) return

    // Sync with actual scroll position
    currentScrollRef.current = container.scrollTop
    targetScrollRef.current = container.scrollTop

    // Calculate tween duration based on smooth value (higher = longer duration)
    const tweenDuration = smoothValue * 0.8

    /**
     * Wheel event handler - attached directly to container for reliable interception.
     */
    const handleWheel = (event: WheelEvent) => {
      // Check if container is scrollable (has scrollbar)
      const maxScroll = container.scrollHeight - container.clientHeight
      const hasScroll = maxScroll > 0

      if (!hasScroll) {
        // Not scrollable - pass through to parent/navigation
        const direction: BoundaryDirection = event.deltaY > 0 ? 'bottom' : 'top'
        const shouldPrevent = onPassthrough?.(event, direction)
        if (shouldPrevent) {
          event.preventDefault()
        }
        return
      }

      // Sync if not currently scrolling
      if (!isScrollingRef.current) {
        currentScrollRef.current = container.scrollTop
        targetScrollRef.current = container.scrollTop
      }

      const scrollingDown = event.deltaY > 0
      const scrollingUp = event.deltaY < 0

      // Calculate new target
      const newTarget = targetScrollRef.current + event.deltaY

      // Check boundaries - only trigger when scroll WOULD go out of bounds
      const wouldGoPastTop = newTarget < 0
      const wouldGoPastBottom = newTarget > maxScroll
      const atTop = wouldGoPastTop && scrollingUp
      const atBottom = wouldGoPastBottom && scrollingDown

      if (atTop || atBottom) {
        // At boundary - notify and pass through
        const direction: BoundaryDirection = atTop ? 'top' : 'bottom'
        onBoundary?.(direction, event.deltaY)

        const shouldPrevent = onPassthrough?.(event, direction)
        if (shouldPrevent) {
          event.preventDefault()
        }
        return
      }

      // Within scrollable range - consume the event and smooth scroll
      event.preventDefault()
      event.stopPropagation()

      // Update target (clamped)
      targetScrollRef.current = Math.max(0, Math.min(newTarget, maxScroll))
      isScrollingRef.current = true

      // Kill existing tween and create new one (same approach as ScrollSmoother)
      if (tweenRef.current) {
        tweenRef.current.kill()
      }

      tweenRef.current = gsap.to(container, {
        scrollTop: targetScrollRef.current,
        duration: tweenDuration,
        ease: 'power2.out',
        overwrite: true,
        onUpdate: () => {
          currentScrollRef.current = container.scrollTop
        },
        onComplete: () => {
          isScrollingRef.current = false
          currentScrollRef.current = container.scrollTop
        },
      })
    }

    // Attach wheel listener directly to container (capture phase for priority)
    container.addEventListener('wheel', handleWheel, { passive: false, capture: true })

    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill()
        tweenRef.current = null
      }
      container.removeEventListener('wheel', handleWheel, { capture: true })
      isScrollingRef.current = false
    }
  }, [enabled, containerRef, getEffectiveSmoothValue, onBoundary, onPassthrough])

  return {
    scrollTo,
    getScroll: () => currentScrollRef.current,
    getTargetScroll: () => targetScrollRef.current,
    isAtBoundary,
    isScrolling: () => isScrollingRef.current,
    stop,
  }
}

export default useSmoothScrollContainer
