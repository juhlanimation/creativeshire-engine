'use client'

/**
 * PageTransitionWrapper - wraps page content for fade-to-black transitions.
 *
 * Uses a black overlay for transitions (easier to debug than opacity fade):
 * - Entry: Black overlay fades OUT to reveal content
 * - Exit: Black overlay fades IN to cover content before navigation
 *
 * Uses the EffectTimeline system for reliable animation orchestration:
 * - Exit track registered on shared timeline
 * - TransitionLink plays timeline before navigation
 * - Uses animationend events for reliable completion detection
 *
 * @example
 * ```tsx
 * <PageTransitionProvider>
 *   <PageTransitionWrapper>
 *     <PageRenderer page={page} />
 *   </PageTransitionWrapper>
 * </PageTransitionProvider>
 * ```
 */

import { type ReactNode, type CSSProperties, useRef, useEffect } from 'react'
import { usePageTransition } from './PageTransitionContext'
import { animateElement } from './animateElement'
import './page-transition.css'

// =============================================================================
// Types
// =============================================================================

export interface PageTransitionWrapperProps {
  /** Child content to wrap */
  children: ReactNode
  /** Whether transitions are enabled (default: true) */
  enabled?: boolean
  /** Transition duration in milliseconds (default: 400) */
  duration?: number
  /** Additional className for the wrapper */
  className?: string
  /** Additional styles for the wrapper */
  style?: CSSProperties
}

// =============================================================================
// Constants
// =============================================================================

const EXIT_CLASS = 'page-transition--exiting'
const ENTRY_CLASS = 'page-transition--entering'
const TRACK_ID = 'page-fade-out'

// =============================================================================
// Component
// =============================================================================

/**
 * Wraps page content with fade transition support.
 *
 * Entry: Automatically fades in via CSS animation on mount.
 * Exit: Registers track on exitTimeline; plays when TransitionLink is clicked.
 */
export function PageTransitionWrapper({
  children,
  enabled = true,
  duration = 400,
  className,
  style,
}: PageTransitionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)
  const transitionContext = usePageTransition()

  // Register exit track on timeline
  useEffect(() => {
    if (!enabled || !transitionContext) return

    const { exitTimeline } = transitionContext
    const animationDuration = duration + 100 // Add buffer for safety

    // Register our exit animation as a track
    exitTimeline.addTrack(TRACK_ID, () =>
      animateElement(ref.current, {
        className: EXIT_CLASS,
        timeout: animationDuration,
      })
    )

    // Cleanup: remove track when unmounting
    return () => {
      exitTimeline.removeTrack(TRACK_ID)
    }
  }, [enabled, transitionContext, duration])

  // Play entry animation on mount - wait for content to be painted first
  useEffect(() => {
    if (!enabled || !ref.current) return

    const element = ref.current

    // Double requestAnimationFrame ensures content is painted before we reveal it:
    // 1st RAF: schedules before next paint
    // 2nd RAF: schedules after that paint completes
    // By the time 2nd RAF fires, the page content has been rendered and painted
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Add entry class to trigger fade-in
        // Keep class after animation so `forwards` maintains overlay at opacity 0
        animateElement(element, {
          className: ENTRY_CLASS,
          timeout: duration + 100,
          removeClassOnComplete: false,
        })
      })
    })
  }, [enabled, duration])

  const wrapperStyle: CSSProperties = {
    '--page-transition-duration': `${duration}ms`,
    ...style,
  } as CSSProperties

  const classNames = ['page-transition', enabled && 'page-transition--enabled', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={ref} className={classNames} style={wrapperStyle} data-page-transition>
      {/* Black overlay for fade-to-black transitions */}
      {enabled && <div className="page-transition__overlay" />}
      {children}
    </div>
  )
}

export default PageTransitionWrapper
