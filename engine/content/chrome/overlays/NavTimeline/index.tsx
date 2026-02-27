'use client'

/**
 * NavTimeline - vertical timeline showing scroll progress between sections.
 * Reads scrollProgress from experience store, animates pointer and labels.
 */

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { gsap } from 'gsap'
import type { StoreApi } from 'zustand'
import { useExperience } from '../../../../experience'
import type { InfiniteCarouselState } from '../../../../experience/compositions/types'
import type { NavTimelineProps } from './types'

// =============================================================================
// Easing utilities for smooth animations
// =============================================================================

const EASE_BLEND = 0.6

function blendedEaseIn(t: number): number {
  const eased = t * t
  return t * (1 - EASE_BLEND) + eased * EASE_BLEND
}

function blendedEaseOut(t: number): number {
  const eased = 1 - (1 - t) * (1 - t)
  return t * (1 - EASE_BLEND) + eased * EASE_BLEND
}

/**
 * Apply blended ease-in to a value within the first 40% of progress.
 * Creates smooth "takeoff" - reduced speed at 0%, normal by 40%.
 */
function easedCurrentT(t: number): number {
  const easeEndT = 0.4
  if (t < easeEndT) {
    const localT = t / easeEndT
    return blendedEaseIn(localT) * easeEndT
  }
  return t
}

/**
 * Apply blended ease-out to a value within the last 40% of progress.
 * Creates smooth "landing" - slows down as it approaches 100%.
 */
function easedNextT(t: number): number {
  const easeStartT = 0.6
  if (t > easeStartT) {
    const localT = (t - easeStartT) / (1 - easeStartT)
    return easeStartT + blendedEaseOut(localT) * (1 - easeStartT)
  }
  return t
}

/**
 * Linear interpolate between two hex colors.
 */
function lerpColor(color1: string, color2: string, t: number): string {
  // Parse hex colors
  const hex1 = color1.replace('#', '')
  const hex2 = color2.replace('#', '')

  const r1 = parseInt(hex1.slice(0, 2), 16)
  const g1 = parseInt(hex1.slice(2, 4), 16)
  const b1 = parseInt(hex1.slice(4, 6), 16)

  const r2 = parseInt(hex2.slice(0, 2), 16)
  const g2 = parseInt(hex2.slice(2, 4), 16)
  const b2 = parseInt(hex2.slice(4, 6), 16)

  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// =============================================================================
// Component
// =============================================================================

export function NavTimeline({
  show = true,
  position = 'center',
  showArrows = true,
  autohide = false,
  autohideDelay = 2000,
  currentLabel = '',
  nextLabel = '',
  currentNumber,
  nextNumber,
  currentColor = '#ffffff',
  nextColor = '#ffffff',
  alignment = 'left',
  showTopArrow,
  showBottomArrow,
  onAnimationComplete,
}: NavTimelineProps) {
  const { experience, store } = useExperience()

  // Cast to infinite carousel store for scrollProgress access
  const carouselStore = store as unknown as StoreApi<InfiniteCarouselState>

  // Subscribe to store state
  const state = useSyncExternalStore(
    carouselStore.subscribe,
    () => carouselStore.getState(),
    () => carouselStore.getState()
  )

  // Check if store has required state
  const hasCarouselState = 'scrollProgress' in state && 'totalSections' in state
  const scrollProgress = hasCarouselState ? state.scrollProgress : 0
  const totalSections = hasCarouselState ? state.totalSections : 0
  const sectionIds = hasCarouselState && 'sectionIds' in state ? state.sectionIds : []
  const hasLooped = hasCarouselState && 'hasLooped' in state ? state.hasLooped : false
  // Use clipProgress for animation - this is 0 during internal scroll of tall sections
  const clipProgress = hasCarouselState && 'clipProgress' in state ? state.clipProgress : 0

  // Calculate current/next indices
  const currentIndex = Math.floor(scrollProgress)
  const nextIndex = totalSections > 0 ? (currentIndex + 1) % totalSections : 0
  // Use clipProgress for pointer animation (not raw progressInSection)
  // This ensures NavTimeline doesn't animate during internal scroll of tall sections
  const progressInSection = clipProgress

  // Derive arrow visibility from scrollability
  const loops = experience.navigation?.behavior?.loop ?? false
  const canScrollUp = loops ? (hasLooped || currentIndex > 0) : currentIndex > 0
  const canScrollDown = loops ? true : currentIndex < totalSections - 1

  // Props override derived values when explicitly provided
  const effectiveShowTop = showTopArrow ?? canScrollUp
  const effectiveShowBottom = showBottomArrow ?? canScrollDown

  // Derive labels from section IDs (props can override)
  // First section shows "scroll to explore" until user loops
  const derivedCurrentLabel =
    currentIndex === 0 && !hasLooped
      ? 'scroll to explore'
      : sectionIds[currentIndex] ?? ''
  const derivedNextLabel = sectionIds[nextIndex] ?? ''

  // Use props if provided, otherwise use derived labels
  const effectiveCurrentLabel = currentLabel || derivedCurrentLabel
  const effectiveNextLabel = nextLabel || derivedNextLabel

  // Refs for animated elements
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const topArrowRef = useRef<HTMLDivElement>(null)
  const bottomArrowRef = useRef<HTMLDivElement>(null)
  const currentPointerRef = useRef<HTMLDivElement>(null)
  const nextPointerRef = useRef<HTMLDivElement>(null)
  const currentLabelRef = useRef<HTMLDivElement>(null)
  const nextLabelRef = useRef<HTMLDivElement>(null)
  const labelContainerRef = useRef<HTMLDivElement>(null)
  const currentNumberRef = useRef<HTMLDivElement>(null)
  const nextNumberRef = useRef<HTMLDivElement>(null)
  const numberContainerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const hasRevealedRef = useRef(false)

  // Autohide animation state
  const autohideTweenRef = useRef<gsap.core.Tween | null>(null)
  const lastProgressRef = useRef(scrollProgress)
  const prevAutohideRef = useRef(autohide)

  // Autohide logic: on scroll -> 100% opacity, then fade to 0% over autohideDelay
  useEffect(() => {
    if (!autohide || !show || !containerRef.current) {
      // Not autohiding - ensure full opacity and clear any fade
      if (autohideTweenRef.current) {
        autohideTweenRef.current.kill()
        autohideTweenRef.current = null
      }
      if (containerRef.current) {
        gsap.set(containerRef.current, { opacity: 1 })
      }
      lastProgressRef.current = scrollProgress
      prevAutohideRef.current = autohide
      return
    }

    // Check if autohide just became enabled
    const autohideJustEnabled = autohide && !prevAutohideRef.current
    prevAutohideRef.current = autohide

    // Detect scroll input by checking if progress changed
    const progressDelta = Math.abs(scrollProgress - lastProgressRef.current)
    const hasScrolled = progressDelta > 0.001
    lastProgressRef.current = scrollProgress

    if (hasScrolled || autohideJustEnabled) {
      // Scroll detected - instantly go to 100% and start fresh fade
      if (autohideTweenRef.current) {
        autohideTweenRef.current.kill()
      }
      gsap.set(containerRef.current, { opacity: 1 })
      autohideTweenRef.current = gsap.to(containerRef.current, {
        opacity: 0,
        duration: autohideDelay / 1000,
        ease: 'none',
        onComplete: () => {
          autohideTweenRef.current = null
        },
      })
    }
  }, [autohide, show, scrollProgress, autohideDelay])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autohideTweenRef.current) {
        autohideTweenRef.current.kill()
      }
    }
  }, [])

  // Initial reveal animation
  useEffect(() => {
    if (
      !lineRef.current ||
      !topArrowRef.current ||
      !bottomArrowRef.current ||
      !currentPointerRef.current ||
      !labelContainerRef.current ||
      !currentLabelRef.current
    )
      return

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    if (show) {
      hasRevealedRef.current = false
      const tl = gsap.timeline({
        onComplete: () => {
          hasRevealedRef.current = true
          onAnimationComplete?.()
        },
      })

      // Reset initial states
      gsap.set(lineRef.current, {
        scaleY: 0,
        opacity: 1,
        backgroundColor: currentColor,
      })
      gsap.set([topArrowRef.current, bottomArrowRef.current], {
        scale: 0,
        opacity: 0,
        color: currentColor,
      })
      gsap.set(currentPointerRef.current, {
        scale: 0,
        opacity: 0,
        y: 0,
        backgroundColor: currentColor,
      })
      gsap.set(labelContainerRef.current, {
        x: alignment === 'left' ? 10 : -10,
        opacity: 0,
      })
      gsap.set(currentLabelRef.current, {
        color: currentColor,
      })
      // Number container animates from opposite side of label
      if (numberContainerRef.current) {
        gsap.set(numberContainerRef.current, {
          x: alignment === 'left' ? -10 : 10,
          opacity: 0,
        })
      }
      if (currentNumberRef.current) {
        gsap.set(currentNumberRef.current, {
          color: currentColor,
        })
      }

      // Phase 1: Line unfolds from center
      tl.to(lineRef.current, {
        scaleY: 1,
        duration: 0.8,
        ease: 'power3.out',
      })

      // Phase 2: Arrows animate out from ends
      if (showArrows && effectiveShowTop) {
        tl.to(
          topArrowRef.current,
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: 'back.out(1.7)',
          },
          '-=0.1'
        )
      }

      if (showArrows && effectiveShowBottom) {
        tl.to(
          bottomArrowRef.current,
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: 'back.out(1.7)',
          },
          effectiveShowTop ? '-=0.3' : '-=0.1'
        )
      }

      // Phase 3: Pointer pops in
      tl.to(
        currentPointerRef.current,
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: 'back.out(2)',
        },
        '-=0.1'
      )

      // Phase 4: Label slides in
      tl.to(
        labelContainerRef.current,
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        },
        '-=0.15'
      )

      // Phase 4b: Number slides in from opposite side
      if (numberContainerRef.current) {
        tl.to(
          numberContainerRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
          },
          '-=0.4'
        )
      }

      timelineRef.current = tl
    } else {
      // Hide animation
      gsap.to(
        [
          lineRef.current,
          topArrowRef.current,
          bottomArrowRef.current,
          currentPointerRef.current,
          labelContainerRef.current,
          numberContainerRef.current,
        ].filter(Boolean),
        {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        }
      )
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, onAnimationComplete])

  // Handle top arrow visibility changes (only after reveal completes)
  useEffect(() => {
    if (!show || !topArrowRef.current || !showArrows) return
    // Skip during reveal — the reveal timeline animates the arrow itself
    if (!hasRevealedRef.current) return

    gsap.to(topArrowRef.current, {
      scale: effectiveShowTop ? 1 : 0,
      opacity: effectiveShowTop ? 1 : 0,
      duration: 0.6,
      ease: 'power2.out',
    })
  }, [effectiveShowTop, show, showArrows])

  // Handle bottom arrow visibility changes (only after reveal completes)
  useEffect(() => {
    if (!show || !bottomArrowRef.current || !showArrows) return
    if (!hasRevealedRef.current) return

    gsap.to(bottomArrowRef.current, {
      scale: effectiveShowBottom ? 1 : 0,
      opacity: effectiveShowBottom ? 1 : 0,
      duration: 0.6,
      ease: 'power2.out',
    })
  }, [effectiveShowBottom, show, showArrows])

  // Progress-driven animation for pointer and labels
  useEffect(() => {
    if (!show) return
    if (
      !currentPointerRef.current ||
      !nextPointerRef.current ||
      !currentLabelRef.current ||
      !nextLabelRef.current
    )
      return
    if (!lineRef.current || !topArrowRef.current || !bottomArrowRef.current)
      return

    const maxOffset = 50 // Max Y offset in pixels

    // Current pointer animation (0-50% progress)
    let currentY: number, currentScale: number, currentOpacity: number

    if (progressInSection <= 0.5) {
      const rawT = progressInSection / 0.5
      const t = easedCurrentT(rawT)
      currentY = -t * maxOffset
      currentScale = 1 - t
      currentOpacity = 1 - t
    } else {
      currentY = -maxOffset
      currentScale = 0
      currentOpacity = 0
    }

    // Next pointer animation (50-100% progress)
    let nextY: number, nextScale: number, nextOpacity: number

    if (progressInSection < 0.5) {
      nextY = maxOffset
      nextScale = 0
      nextOpacity = 0
    } else {
      const rawT = (progressInSection - 0.5) / 0.5
      const t = easedNextT(rawT)
      nextY = maxOffset * (1 - t)
      nextScale = t
      nextOpacity = t
    }

    // Interpolate line color
    const interpolatedColor = lerpColor(currentColor, nextColor, progressInSection)

    // Apply to current pointer
    gsap.set(currentPointerRef.current, {
      y: currentY,
      scale: Math.max(0, currentScale),
      opacity: Math.max(0, currentOpacity),
      backgroundColor: currentColor,
    })

    // Apply to current label
    gsap.set(currentLabelRef.current, {
      y: currentY,
      opacity: Math.max(0, currentOpacity),
      color: currentColor,
    })

    // Apply to next pointer
    gsap.set(nextPointerRef.current, {
      y: nextY,
      scale: Math.max(0.2, nextScale),
      opacity: Math.max(0, nextOpacity),
      backgroundColor: nextColor,
    })

    // Apply to next label
    gsap.set(nextLabelRef.current, {
      y: nextY,
      opacity: Math.max(0, nextOpacity),
      color: nextColor,
    })

    // Apply to current number
    if (currentNumberRef.current) {
      gsap.set(currentNumberRef.current, {
        y: currentY,
        opacity: Math.max(0, currentOpacity),
        color: currentColor,
      })
    }

    // Apply to next number
    if (nextNumberRef.current) {
      gsap.set(nextNumberRef.current, {
        y: nextY,
        opacity: Math.max(0, nextOpacity),
        color: nextColor,
      })
    }

    // Apply interpolated color to line and arrows
    gsap.set(lineRef.current, {
      backgroundColor: interpolatedColor,
    })

    gsap.set([topArrowRef.current, bottomArrowRef.current], {
      color: interpolatedColor,
    })
  }, [progressInSection, show, currentColor, nextColor])

  // Don't render if no carousel state
  if (!hasCarouselState || totalSections === 0) {
    return null
  }

  // Determine which side labels and numbers go on
  const labelSide = alignment
  const numberSide = alignment === 'left' ? 'right' : 'left'

  return (
    <div
      ref={containerRef}
      className="nav-timeline"
      data-position={position}
    >
      {/* Container for the line and arrows - 12.5vh height */}
      <div className="nav-timeline-container">
        {/* Line + Arrows spine */}
        <div className="nav-timeline-spine">
          {/* Top Arrow */}
          {showArrows && (
            <div
              ref={topArrowRef}
              className="nav-timeline-arrow nav-timeline-arrow--top"
              style={{ opacity: 0 }}
            >
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M6 0L12 8H0L6 0Z" fill="currentColor" />
              </svg>
            </div>
          )}

          {/* Vertical Line */}
          <div
            ref={lineRef}
            className="nav-timeline-line"
            style={{ opacity: 0, transform: 'scaleY(0)' }}
          />

          {/* Bottom Arrow */}
          {showArrows && (
            <div
              ref={bottomArrowRef}
              className="nav-timeline-arrow nav-timeline-arrow--bottom"
              style={{ opacity: 0 }}
            >
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M6 8L0 0H12L6 8Z" fill="currentColor" />
              </svg>
            </div>
          )}
        </div>

        {/* Current Pointer (dot) */}
        <div className="nav-timeline-pointer-wrapper">
          <div className="nav-timeline-pointer-inner">
            <div
              ref={currentPointerRef}
              className="nav-timeline-pointer"
              style={{ opacity: 0 }}
            />
          </div>
        </div>

        {/* Next Pointer (dot) */}
        <div className="nav-timeline-pointer-wrapper">
          <div className="nav-timeline-pointer-inner">
            <div
              ref={nextPointerRef}
              className="nav-timeline-pointer"
              style={{ opacity: 0 }}
            />
          </div>
        </div>

        {/* Current label */}
        <div
          ref={labelContainerRef}
          className="nav-timeline-label-wrapper"
          data-side={labelSide}
          style={{ opacity: 0 }}
        >
          <div className="nav-timeline-label-inner">
            <div
              ref={currentLabelRef}
              className="nav-timeline-label"
              data-align={labelSide}
            >
              {effectiveCurrentLabel}
            </div>
          </div>
        </div>

        {/* Next label */}
        <div
          className="nav-timeline-label-wrapper"
          data-side={labelSide}
        >
          <div className="nav-timeline-label-inner">
            <div
              ref={nextLabelRef}
              className="nav-timeline-label"
              data-align={labelSide}
              style={{ opacity: 0 }}
            >
              {effectiveNextLabel}
            </div>
          </div>
        </div>

        {/* Current number (opposite side of label) */}
        <div
          ref={numberContainerRef}
          className="nav-timeline-number-wrapper"
          data-side={numberSide}
          style={{ opacity: 0 }}
        >
          <div className="nav-timeline-number-inner">
            <div
              ref={currentNumberRef}
              className="nav-timeline-number"
              data-align={numberSide}
            >
              {currentNumber ?? ''}
            </div>
          </div>
        </div>

        {/* Next number (opposite side of label) */}
        <div
          className="nav-timeline-number-wrapper"
          data-side={numberSide}
        >
          <div className="nav-timeline-number-inner">
            <div
              ref={nextNumberRef}
              className="nav-timeline-number"
              data-align={numberSide}
              style={{ opacity: 0 }}
            >
              {nextNumber ?? ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavTimeline
