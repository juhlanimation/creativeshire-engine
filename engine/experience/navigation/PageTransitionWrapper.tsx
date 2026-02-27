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
 * - Link plays timeline before navigation
 * - Uses animationend events for reliable completion detection
 *
 * Supports effect primitives: when exitEffect/entryEffect are set,
 * uses createEffectTrack() instead of hardcoded CSS classes.
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

import { type ReactNode, type CSSProperties, useRef, useEffect, useLayoutEffect } from 'react'
import { usePageTransition } from './PageTransitionContext'
import { animateElement } from '../timeline/animateElement'
import { createEffectTrack } from '../timeline/effect-track'
import { resolveEffect } from '../timeline/primitives/registry'

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
  /** Page identifier — retriggers entry animation when it changes */
  pageId?: string
  /** Additional className for the wrapper */
  className?: string
  /** Additional styles for the wrapper */
  style?: CSSProperties
  /** Effect primitive ID for exit animation (overrides default CSS class) */
  exitEffect?: string
  /** Effect primitive ID for entry animation (overrides default CSS class) */
  entryEffect?: string
  /** Which realization to use for effect primitives (default: 'css') */
  effectMode?: 'gsap' | 'css'
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
 * Exit: Registers track on exit timeline; plays when Link is clicked.
 */
export function PageTransitionWrapper({
  children,
  enabled = true,
  duration = 400,
  pageId,
  className,
  style,
  exitEffect,
  entryEffect,
  effectMode = 'css',
}: PageTransitionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)
  const transitionContext = usePageTransition()

  // Resolve exit/entry effects to determine actual CSS classes
  const resolvedExitEffect = exitEffect ? resolveEffect(exitEffect) : null
  const resolvedEntryEffect = entryEffect ? resolveEffect(entryEffect) : null

  // Determine CSS classes: effect primitive CSS class overrides defaults
  const exitClass = resolvedExitEffect?.css?.forwardClass ?? EXIT_CLASS
  const entryClass = resolvedEntryEffect?.css?.reverseClass ?? resolvedEntryEffect?.css?.forwardClass ?? ENTRY_CLASS

  // Register exit track on timeline
  useEffect(() => {
    if (!enabled || !transitionContext) return

    const exitTimeline = transitionContext.getExitTimeline()
    const animationDuration = duration + 100 // Add buffer for safety

    // Register our exit animation as a track.
    // --exiting wins over --entering via CSS source order, so the exit
    // animation plays from 0→1 even while --entering fill holds at 0.
    // removeClassOnComplete: false keeps --exiting after animation so the
    // overlay stays opaque during navigation (prevents blink from --entering
    // fill snapping back to 0).
    exitTimeline.addTrack(TRACK_ID, () => {
      // If exit effect is set and GSAP mode requested, use createEffectTrack
      if (exitEffect && effectMode === 'gsap' && ref.current) {
        return createEffectTrack(exitEffect, {
          target: ref.current,
          viewport: { width: window.innerWidth, height: window.innerHeight },
        }, {
          duration: duration / 1000,
        }, 'gsap')()
      }

      // Default: CSS class-based animation
      const overlay = ref.current?.querySelector('.page-transition__overlay') as HTMLElement | null

      return animateElement(ref.current, {
        className: exitClass,
        timeout: animationDuration,
        removeClassOnComplete: false,
        animationTarget: overlay,
      })
    })

    // Cleanup: remove track when unmounting
    return () => {
      exitTimeline.removeTrack(TRACK_ID)
    }
  }, [enabled, transitionContext, duration, exitEffect, effectMode, exitClass])

  // Play entry animation on mount and when page changes.
  // pageId triggers re-entry without remounting the wrapper, so the exit
  // animation runs to completion on the same element before we reveal.
  //
  // useLayoutEffect (not useEffect) so stale classes are cleared synchronously
  // before the browser paints. Without this, there's a single-frame blink where
  // the old --entering fill (opacity 0) is visible with new page content.
  useLayoutEffect(() => {
    if (!enabled || !ref.current) return

    const element = ref.current
    const overlay = element.querySelector('.page-transition__overlay') as HTMLElement | null

    // Clear stale transition classes from previous page.
    // After exit: --exiting fill holds opacity 1. Removing it + --entering
    // falls back to --enabled base (opacity 1). No visual change.
    // Runs before paint → no blink.
    element.classList.remove(exitClass, entryClass)

    // Double requestAnimationFrame ensures content is painted before we reveal it:
    // 1st RAF: schedules before next paint
    // 2nd RAF: schedules after that paint completes
    // By the time 2nd RAF fires, the page content has been rendered and painted
    let raf2: number

    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        // If entry effect is set and GSAP mode requested, use createEffectTrack
        if (entryEffect && effectMode === 'gsap' && element) {
          createEffectTrack(entryEffect, {
            target: element,
            viewport: { width: window.innerWidth, height: window.innerHeight },
          }, {
            duration: duration / 1000,
          }, 'gsap')()
          return
        }

        // Default: CSS class-based animation
        animateElement(element, {
          className: entryClass,
          timeout: duration + 100,
          removeClassOnComplete: false,
          animationTarget: overlay,
        })
      })
    })

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [enabled, duration, pageId, entryEffect, effectMode, exitClass, entryClass])

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
