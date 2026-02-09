'use client'

/**
 * SmoothScrollProvider - GSAP ScrollSmoother integration.
 * Provides butter-smooth scrolling with device-aware behavior.
 *
 * Architecture: Experience layer (motion/animation).
 * Configuration: ThemeSchema.smoothScroll (site-level).
 *
 * Device handling:
 * - Touch devices: Disabled (native scroll is better)
 * - Mac trackpads: Reduced smoothing (native inertia already exists)
 * - Desktop mice: Full smoothing
 * - Reduced motion preference: Disabled
 *
 * Container-aware:
 * In contained mode (iframe/preview), uses CSS scroll-behavior for smooth scrolling
 * instead of ScrollSmoother, which is designed for page-level scrolling.
 */

import { useRef, createContext, useContext, useLayoutEffect, useMemo, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import type { SmoothScrollConfig } from '../../schema'
import { useContainer } from '../../interface/ContainerContext'

// Register GSAP plugins (client-only)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin)
}

/**
 * Context value for smooth scroll access.
 */
interface SmoothScrollContextValue {
  /** Get the ScrollSmoother instance */
  getSmoother: () => ScrollSmoother | null
  /** Pause smooth scrolling */
  stop: () => void
  /** Resume smooth scrolling */
  start: () => void
  /** Scroll to target element or position */
  scrollTo: (target: string | HTMLElement, smooth?: boolean) => void
  /** Get current scroll position */
  getScroll: () => number
  /** Get the active smooth value (accounts for device type) */
  getSmoothValue: () => number
  /** Whether smooth scrolling is enabled */
  isEnabled: () => boolean
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null)

/**
 * Hook to access smooth scroll controls.
 */
export function useSmoothScroll(): SmoothScrollContextValue | null {
  return useContext(SmoothScrollContext)
}

interface SmoothScrollProviderProps {
  config?: SmoothScrollConfig
  children: React.ReactNode
}

/**
 * Default smooth scroll values matching bojuhl.com.
 */
const DEFAULTS: Required<SmoothScrollConfig> = {
  enabled: true,
  smooth: 1.2,
  smoothMac: 0.5,
  effects: true,
}

/**
 * Provides smooth scrolling via GSAP ScrollSmoother.
 * In contained mode, uses CSS scroll-behavior instead.
 */
export function SmoothScrollProvider({ config, children }: SmoothScrollProviderProps): React.ReactNode {
  const smootherRef = useRef<ScrollSmoother | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const smoothValueRef = useRef<number>(0)
  const [isReady, setIsReady] = useState(false)

  // Get container context for contained mode support
  const { mode: containerMode, containerRef } = useContainer()
  const isContained = containerMode === 'contained'

  // Merge config with defaults
  const settings = { ...DEFAULTS, ...config }

  // Extract stable primitive values for deps (avoid undefined in dep arrays)
  const smoothValue = settings.smooth ?? DEFAULTS.smooth
  const smoothMacValue = settings.smoothMac ?? DEFAULTS.smoothMac
  const effectsValue = settings.effects ?? DEFAULTS.effects
  const enabledValue = settings.enabled ?? DEFAULTS.enabled

  // Contained mode: Use wheel interpolation for smooth scrolling
  // CSS scroll-behavior only affects programmatic scrolling, not wheel input.
  // This implements proper smooth scrolling via wheel event interception + lerp.
  useLayoutEffect(() => {
    if (!isContained || !enabledValue) return

    const container = containerRef?.current
    if (!container) return

    // Smooth scroll state
    let targetScroll = container.scrollTop
    let currentScroll = container.scrollTop
    let rafId: number | null = null
    let isScrolling = false

    // Smoothing factor (0-1, lower = smoother but slower)
    const smoothFactor = 0.1 + (1 - Math.min(smoothValue, 2) / 2) * 0.1

    // Lerp function for smooth interpolation
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor

    // Animation loop
    const animate = () => {
      if (!container) return

      // Calculate difference
      const diff = targetScroll - currentScroll

      // If close enough, snap to target
      if (Math.abs(diff) < 0.5) {
        currentScroll = targetScroll
        container.scrollTop = currentScroll
        isScrolling = false
        rafId = null
        return
      }

      // Interpolate scroll position
      currentScroll = lerp(currentScroll, targetScroll, smoothFactor)
      container.scrollTop = currentScroll

      // Continue animation
      rafId = requestAnimationFrame(animate)
    }

    // Wheel event handler
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      // Update target scroll position
      const maxScroll = container.scrollHeight - container.clientHeight
      targetScroll = Math.max(0, Math.min(targetScroll + e.deltaY, maxScroll))

      // Start animation if not already running
      if (!isScrolling) {
        isScrolling = true
        rafId = requestAnimationFrame(animate)
      }
    }

    // Sync current scroll on manual scroll (e.g., scrollbar drag)
    const handleScroll = () => {
      if (!isScrolling) {
        currentScroll = container.scrollTop
        targetScroll = container.scrollTop
      }
    }

    // Reset scroll position on effect setup
    container.scrollTo({ top: 0, behavior: 'instant' })
    currentScroll = 0
    targetScroll = 0

    // Store smooth value for context
    smoothValueRef.current = smoothValue

    // Handle anchor link clicks within container
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]')
      if (anchor) {
        const href = anchor.getAttribute('href')
        if (href?.startsWith('#')) {
          e.preventDefault()
          // Scope querySelector to container
          const targetElement = container.querySelector(href) as HTMLElement | null
          if (targetElement) {
            // Calculate target scroll position
            const containerRect = container.getBoundingClientRect()
            const targetRect = targetElement.getBoundingClientRect()
            const targetScrollTop = container.scrollTop + (targetRect.top - containerRect.top)
            const maxScroll = container.scrollHeight - container.clientHeight
            targetScroll = Math.max(0, Math.min(targetScrollTop, maxScroll))
            // Start animation if not already running
            if (!isScrolling) {
              isScrolling = true
              rafId = requestAnimationFrame(animate)
            }
          }
        }
      }
    }

    // Add event listeners
    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('scroll', handleScroll, { passive: true })
    container.addEventListener('click', handleAnchorClick)

    // Safe: one-time signal that setup is complete
    setIsReady(true)

    return () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('scroll', handleScroll)
      container.removeEventListener('click', handleAnchorClick)
      if (rafId) cancelAnimationFrame(rafId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- containerRef is a stable ref
  }, [isContained, enabledValue, smoothValue])

  // Fullpage mode: Use GSAP ScrollSmoother
  useLayoutEffect(() => {
    // Skip if contained mode or disabled
    if (isContained || !enabledValue) {
      // Safe: one-time signal when disabled (no setup needed)
      if (!isContained) setIsReady(true)
      return
    }

    // Reset scroll position
    window.scrollTo(0, 0)

    // Device detection
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const isMac = /Mac|Macintosh/.test(navigator.userAgent) && !isTouchDevice
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Normalize scroll on non-Mac desktop (Mac trackpads have native inertia)
    if (!isTouchDevice && !isMac && !prefersReducedMotion) {
      ScrollTrigger.normalizeScroll(true)
    }

    // Ignore mobile URL bar resize events
    ScrollTrigger.config({
      ignoreMobileResize: true,
    })

    // Force GPU acceleration
    gsap.config({
      force3D: true,
    })

    // Lag smoothing for slower devices (500ms threshold, fall back to ~30fps)
    gsap.ticker.lagSmoothing(500, 33)

    // Determine smooth value based on device
    const deviceSmoothValue = prefersReducedMotion || isTouchDevice
      ? 0
      : isMac
        ? smoothMacValue
        : smoothValue

    // Store for context access
    smoothValueRef.current = deviceSmoothValue

    // Create ScrollSmoother
    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current!,
      content: contentRef.current!,
      smooth: deviceSmoothValue,
      effects: effectsValue,
      smoothTouch: false, // Never smooth touch input
    })

    smootherRef.current = smoother
    setIsReady(true)

    // Handle anchor link clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]')
      if (anchor) {
        const href = anchor.getAttribute('href')
        if (href?.startsWith('#')) {
          e.preventDefault()
          const targetElement = document.querySelector(href) as HTMLElement | null
          if (targetElement) {
            smoother.scrollTo(targetElement, true, 'top top')
          }
        }
      }
    }

    // Add click listener to wrapper for anchor navigation
    // Scoped to wrapper element instead of document for iframe support
    const wrapper = wrapperRef.current
    wrapper?.addEventListener('click', handleAnchorClick)

    // Handle orientation changes
    let orientationTimeout: ReturnType<typeof setTimeout> | null = null
    let lastOrientation = window.screen?.orientation?.type || ''

    const refreshAfterOrientationChange = () => {
      smoother.refresh()
      ScrollTrigger.refresh(true)
      ScrollTrigger.update()
    }

    const handleOrientationChange = () => {
      if (orientationTimeout) clearTimeout(orientationTimeout)
      setTimeout(refreshAfterOrientationChange, 50)
      setTimeout(refreshAfterOrientationChange, 150)
      orientationTimeout = setTimeout(refreshAfterOrientationChange, 250)
    }

    const handleResize = () => {
      if (!isTouchDevice) return
      const currentOrientation = window.screen?.orientation?.type || ''
      if (currentOrientation !== lastOrientation) {
        lastOrientation = currentOrientation
        if (orientationTimeout) clearTimeout(orientationTimeout)
        setTimeout(refreshAfterOrientationChange, 50)
        orientationTimeout = setTimeout(refreshAfterOrientationChange, 200)
      }
    }

    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      wrapper?.removeEventListener('click', handleAnchorClick)
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('resize', handleResize)
      if (orientationTimeout) clearTimeout(orientationTimeout)
      if (!isTouchDevice && !isMac && !prefersReducedMotion) {
        ScrollTrigger.normalizeScroll(false)
      }
      smoother.kill()
      smootherRef.current = null
    }
  }, [isContained, enabledValue, smoothValue, smoothMacValue, effectsValue])

  // Memoize context value
  // Note: React compiler can't optimize closures over refs, but code is correct
  const contextValue = useMemo<SmoothScrollContextValue>(() => ({
    getSmoother: () => smootherRef.current,
    stop: () => smootherRef.current?.paused(true),
    start: () => smootherRef.current?.paused(false),
    scrollTo: (target, smooth = true) => {
      if (isContained && containerRef?.current) {
        // Contained mode: use native scrollIntoView or scroll to position
        if (typeof target === 'string') {
          const element = containerRef.current.querySelector(target)
          element?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
        } else {
          target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
        }
      } else {
        // Fullpage mode: use ScrollSmoother
        smootherRef.current?.scrollTo(target, smooth)
      }
    },
    getScroll: () => {
      if (isContained && containerRef?.current) {
        return containerRef.current.scrollTop
      }
      return smootherRef.current?.scrollTop() || 0
    },
    getSmoothValue: () => smoothValueRef.current,
    isEnabled: () => enabledValue,
    // eslint-disable-next-line react-hooks/exhaustive-deps -- containerRef/smootherRef are stable refs
  }), [isReady, enabledValue, isContained])

  // If disabled, render children directly
  if (!enabledValue) {
    return <>{children}</>
  }

  // Contained mode: render children without ScrollSmoother wrapper
  if (isContained) {
    return (
      <SmoothScrollContext.Provider value={contextValue}>
        {children}
      </SmoothScrollContext.Provider>
    )
  }

  // Fullpage mode: render with ScrollSmoother wrapper
  return (
    <SmoothScrollContext.Provider value={contextValue}>
      <div id="smooth-wrapper" ref={wrapperRef}>
        <div id="smooth-content" ref={contentRef} style={{ isolation: 'isolate' }}>
          {children}
        </div>
      </div>
    </SmoothScrollContext.Provider>
  )
}
