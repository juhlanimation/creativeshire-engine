'use client'

/**
 * PageTransitionContext - shares exit timeline between Link and PageTransitionWrapper.
 *
 * Components register exit animations on the shared timeline.
 * Link plays the timeline before navigation, waits for all tracks to complete.
 *
 * Flow:
 * 1. PageTransitionWrapper registers its exit track on mount
 * 2. User clicks Link
 * 3. Link calls getExitTimeline().play()
 * 4. All registered tracks execute in parallel
 * 5. Promise.all waits for ALL tracks to complete
 * 6. Link navigates to new page
 * 7. New page mounts, entry animation plays
 */

import {
  createContext,
  useContext,
  useRef,
  useState,
  useMemo,
  type ReactNode,
} from 'react'
import { EffectTimeline } from '../timeline/EffectTimeline'

// =============================================================================
// Types
// =============================================================================

export interface PageTransitionContextValue {
  /** Get the exit timeline - tracks added here play before navigation */
  getExitTimeline: () => EffectTimeline

  /** Signal that a transition is starting (updates isTransitioning) */
  startTransition: () => void

  /** Signal that transition has completed (e.g., after navigation) */
  endTransition: () => void

  /** Whether currently in a transition */
  isTransitioning: boolean

  /** Transition duration in ms (from config) */
  duration: number
}

export interface PageTransitionProviderProps {
  /** Child components */
  children: ReactNode
  /** Transition duration in ms (default: 400) */
  duration?: number
  /** Whether transitions are enabled (default: true) */
  enabled?: boolean
}

// =============================================================================
// Context
// =============================================================================

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null)

// =============================================================================
// Provider
// =============================================================================

export function PageTransitionProvider({
  children,
  duration = 400,
  enabled = true,
}: PageTransitionProviderProps) {
  // Single timeline instance for the lifetime of this provider
  const exitTimelineRef = useRef(new EffectTimeline())

  const [isTransitioning, setIsTransitioning] = useState(false)

  const value = useMemo<PageTransitionContextValue>(
    () => ({
      getExitTimeline: () => exitTimelineRef.current,
      startTransition: () => setIsTransitioning(true),
      endTransition: () => setIsTransitioning(false),
      isTransitioning,
      duration,
    }),
    [isTransitioning, duration]
  )

  // If disabled, render children without context
  // This allows components to gracefully handle missing context
  if (!enabled) {
    return <>{children}</>
  }

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
    </PageTransitionContext.Provider>
  )
}

// =============================================================================
// Hooks
// =============================================================================

/**
 * Access page transition context.
 * Returns null if not within PageTransitionProvider (graceful fallback).
 */
export function usePageTransition(): PageTransitionContextValue | null {
  return useContext(PageTransitionContext)
}

/**
 * Access page transition context with required check.
 * Throws if not within PageTransitionProvider.
 */
export function usePageTransitionRequired(): PageTransitionContextValue {
  const context = useContext(PageTransitionContext)
  if (!context) {
    throw new Error(
      'usePageTransitionRequired must be used within PageTransitionProvider'
    )
  }
  return context
}
