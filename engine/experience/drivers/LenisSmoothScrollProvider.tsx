'use client'

/**
 * LenisSmoothScrollProvider - Lenis smooth scroll integration.
 * Alternative to GSAP ScrollSmoother with a lighter, more natural feel.
 *
 * Architecture: Experience layer (motion/animation).
 * Configuration: ThemeSchema.smoothScroll (site-level, provider: 'lenis').
 *
 * Device handling:
 * - Touch devices: Disabled (native scroll is better)
 * - Mac trackpads: Reduced duration (native inertia already exists)
 * - Desktop mice: Full smoothing
 * - Reduced motion preference: Disabled
 *
 * Container-aware:
 * In contained mode (iframe/preview), uses Lenis wrapper option to target
 * the container element instead of window.
 */

import { useRef, useLayoutEffect, useEffect, useMemo, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { SmoothScrollConfig } from '../../schema'
import { useContainer } from '../../interface/ContainerContext'
import { useScrollLock } from './ScrollLockContext'
import { SmoothScrollContext } from './SmoothScrollContext'
import type { SmoothScrollContextValue } from './SmoothScrollContext'

// Register GSAP plugins (client-only)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/** Exponential easing — smooth deceleration, same as port-12 portfolio. */
const EXPONENTIAL_EASING = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))

interface LenisSmoothScrollProviderProps {
  config?: SmoothScrollConfig
  children: React.ReactNode
}

/** Default Lenis-specific values. */
const LENIS_DEFAULTS = {
  duration: 0.8,
  touchMultiplier: 1.5,
  wheelMultiplier: 1,
}

/**
 * Provides smooth scrolling via Lenis.
 * In contained mode, targets the container element via Lenis wrapper option.
 */
export function LenisSmoothScrollProvider({ config, children }: LenisSmoothScrollProviderProps): React.ReactNode {
  const lenisRef = useRef<Lenis | null>(null)
  const smoothValueRef = useRef<number>(0)
  const [isReady, setIsReady] = useState(false)

  // Get container context for contained mode support
  const { mode: containerMode, containerRef } = useContainer()
  const isContained = containerMode === 'contained'

  // Subscribe to generic scroll lock service
  const scrollLock = useScrollLock()
  const isScrollLocked = scrollLock?.isLocked ?? false

  // Merge config
  const enabledValue = config?.enabled ?? false
  const smoothValue = config?.smooth ?? 1.2
  const smoothMacValue = config?.smoothMac ?? 0.5
  const lenisConfig = config?.lenis ?? {}
  const duration = lenisConfig.duration ?? LENIS_DEFAULTS.duration
  const touchMultiplier = lenisConfig.touchMultiplier ?? LENIS_DEFAULTS.touchMultiplier
  const wheelMultiplier = lenisConfig.wheelMultiplier ?? LENIS_DEFAULTS.wheelMultiplier

  // Initialize Lenis
  useLayoutEffect(() => {
    if (!enabledValue) {
      setIsReady(true)
      return
    }

    // Device detection
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const isMac = /Mac|Macintosh/.test(navigator.userAgent) && !isTouchDevice
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Skip smooth scrolling for touch devices and reduced motion
    if (isTouchDevice || prefersReducedMotion) {
      smoothValueRef.current = 0
      setIsReady(true)
      return
    }

    // Compute device-aware duration
    // Mac trackpads: scale duration by smoothMac/smooth ratio (reduces smoothing)
    const deviceDuration = isMac
      ? duration * (smoothMacValue / smoothValue)
      : duration

    // Store smooth value for context
    smoothValueRef.current = isMac ? smoothMacValue : smoothValue

    // Build Lenis options
    const lenisOptions: ConstructorParameters<typeof Lenis>[0] = {
      duration: deviceDuration,
      easing: EXPONENTIAL_EASING,
      smoothWheel: true,
      touchMultiplier,
      wheelMultiplier,
      autoRaf: false, // We drive RAF via GSAP ticker
    }

    // Contained mode: target the container element
    if (isContained && containerRef?.current) {
      lenisOptions.wrapper = containerRef.current
      lenisOptions.content = containerRef.current.firstElementChild as HTMLElement

      // Configure ScrollTrigger for container-scoped scrolling
      ScrollTrigger.defaults({
        scroller: containerRef.current,
      })

      // Reset scroll position
      containerRef.current.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    } else {
      // Fullpage mode: Lenis uses window scroll (default, no wrapper option).
      // Lenis adds harmless CSS classes to document.documentElement —
      // these have no effect without importing lenis/dist/lenis.css.
      window.scrollTo(0, 0)

      // Ignore mobile URL bar resize events
      ScrollTrigger.config({
        ignoreMobileResize: true,
      })
    }

    // Force GPU acceleration
    gsap.config({ force3D: true })

    // Lag smoothing for slower devices (500ms threshold, fall back to ~30fps)
    gsap.ticker.lagSmoothing(500, 33)

    // Create Lenis instance
    const lenis = new Lenis(lenisOptions)

    // Start stopped if scroll is locked (e.g., during intro)
    if (isScrollLocked) {
      lenis.stop()
    }

    lenisRef.current = lenis

    // Sync Lenis scroll events with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis via GSAP ticker (single RAF loop, no double-pumping)
    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)

    // Handle anchor link clicks
    const scrollContainer = isContained ? containerRef?.current : document
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]')
      if (anchor) {
        const href = anchor.getAttribute('href')
        if (href?.startsWith('#')) {
          e.preventDefault()
          const scope = isContained && containerRef?.current
            ? containerRef.current
            : document
          const targetElement = scope.querySelector(href) as HTMLElement | null
          if (targetElement) {
            lenis.scrollTo(targetElement, { duration: deviceDuration })
          }
        }
      }
    }
    scrollContainer?.addEventListener('click', handleAnchorClick)

    // Handle orientation changes (mobile)
    let orientationTimeout: ReturnType<typeof setTimeout> | null = null
    let lastOrientation = window.screen?.orientation?.type || ''

    const refreshAfterOrientationChange = () => {
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

    setIsReady(true)

    // Cleanup
    return () => {
      scrollContainer?.removeEventListener('click', handleAnchorClick)
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('resize', handleResize)
      if (orientationTimeout) clearTimeout(orientationTimeout)
      gsap.ticker.remove(raf)

      // Clear scroller default if we set it
      if (isContained) {
        ScrollTrigger.defaults({ scroller: undefined })
      }

      lenis.destroy()
      lenisRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- containerRef is a stable ref
  }, [enabledValue, isContained, duration, smoothValue, smoothMacValue, touchMultiplier, wheelMultiplier])

  // Pause/unpause Lenis based on scroll lock state
  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return

    if (isScrollLocked) {
      lenis.stop()
    } else {
      lenis.start()
      // Refresh ScrollTrigger after unpause — overflow:hidden during intro
      // may cause stale content height measurements
      ScrollTrigger.refresh(true)
      requestAnimationFrame(() => {
        ScrollTrigger.refresh(true)
      })
    }
  }, [isScrollLocked])

  // Memoize context value
  const contextValue = useMemo<SmoothScrollContextValue>(() => ({
    getEngine: () => lenisRef.current,
    stop: () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
    scrollTo: (target, smooth = true) => {
      const lenis = lenisRef.current
      if (lenis) {
        if (typeof target === 'string') {
          const scope = isContained && containerRef?.current
            ? containerRef.current
            : document
          const element = scope.querySelector(target) as HTMLElement | null
          if (element) {
            lenis.scrollTo(element, {
              duration: smooth ? undefined : 0,
            })
          }
        } else {
          lenis.scrollTo(target, {
            duration: smooth ? undefined : 0,
          })
        }
      } else if (isContained && containerRef?.current) {
        // Fallback: native scroll if Lenis not active (touch/reduced motion)
        if (typeof target === 'string') {
          const element = containerRef.current.querySelector(target)
          element?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
        } else {
          target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
        }
      } else {
        // Fallback: native scroll in fullpage mode
        if (typeof target === 'string') {
          const element = document.querySelector(target)
          element?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
        } else {
          target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
        }
      }
    },
    getScroll: () => {
      if (lenisRef.current) {
        return lenisRef.current.scroll
      }
      if (isContained && containerRef?.current) {
        return containerRef.current.scrollTop
      }
      return window.scrollY || 0
    },
    getSmoothValue: () => smoothValueRef.current,
    isEnabled: () => enabledValue,
    // eslint-disable-next-line react-hooks/exhaustive-deps -- containerRef/lenisRef are stable refs
  }), [isReady, enabledValue, isContained])

  // If disabled or device doesn't support smooth scroll, render children directly
  if (!enabledValue) {
    return <>{children}</>
  }

  // Lenis doesn't need wrapper DOM — it works with native scroll
  return (
    <SmoothScrollContext.Provider value={contextValue}>
      {children}
    </SmoothScrollContext.Provider>
  )
}
