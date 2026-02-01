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
 */

import { useRef, createContext, useContext, useLayoutEffect, useMemo, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import type { SmoothScrollConfig } from '../schema'

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
 */
export function SmoothScrollProvider({ config, children }: SmoothScrollProviderProps): React.ReactNode {
  const smootherRef = useRef<ScrollSmoother | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const smoothValueRef = useRef<number>(0)
  const [isReady, setIsReady] = useState(false)

  // Merge config with defaults
  const settings = { ...DEFAULTS, ...config }

  useLayoutEffect(() => {
    // Skip if disabled
    if (!settings.enabled) {
      setIsReady(true)
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
    const smoothValue = prefersReducedMotion || isTouchDevice
      ? 0
      : isMac
        ? settings.smoothMac
        : settings.smooth

    // Store for context access
    smoothValueRef.current = smoothValue

    // Create ScrollSmoother
    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current!,
      content: contentRef.current!,
      smooth: smoothValue,
      effects: settings.effects,
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

    document.addEventListener('click', handleAnchorClick)

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
      document.removeEventListener('click', handleAnchorClick)
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('resize', handleResize)
      if (orientationTimeout) clearTimeout(orientationTimeout)
      if (!isTouchDevice && !isMac && !prefersReducedMotion) {
        ScrollTrigger.normalizeScroll(false)
      }
      smoother.kill()
      smootherRef.current = null
    }
  }, [settings.enabled, settings.smooth, settings.smoothMac, settings.effects])

  // Memoize context value
  const contextValue = useMemo<SmoothScrollContextValue>(() => ({
    getSmoother: () => smootherRef.current,
    stop: () => smootherRef.current?.paused(true),
    start: () => smootherRef.current?.paused(false),
    scrollTo: (target, smooth = true) => {
      smootherRef.current?.scrollTo(target, smooth)
    },
    getScroll: () => smootherRef.current?.scrollTop() || 0,
    getSmoothValue: () => smoothValueRef.current,
    isEnabled: () => settings.enabled,
  }), [isReady, settings.enabled])

  // If disabled, render children directly
  if (!settings.enabled) {
    return <>{children}</>
  }

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
