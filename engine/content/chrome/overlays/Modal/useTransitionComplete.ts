'use client'

/**
 * useTransitionComplete - Hook for detecting CSS transition completion.
 *
 * Listens to transitionend events on an element to detect when CSS transitions complete.
 * Used by modal system to fire callbacks after open/close animations finish.
 *
 * Architecture:
 * - Aligns with L2 CSS-variable-driven transitions
 * - Uses native transitionend events, not GSAP
 * - Supports reduced motion by firing immediately when transitions are instant
 */

import { useEffect, useRef, useCallback, useMemo } from 'react'

/**
 * Options for useTransitionComplete hook.
 */
export interface UseTransitionCompleteOptions {
  /** Ref to the element being transitioned */
  elementRef: React.RefObject<HTMLElement | null>
  /** CSS property to watch (e.g., 'clip-path', 'opacity', 'transform') */
  property: string
  /** Callback when transition completes */
  onComplete: () => void
  /** Whether to watch for transitions (enable/disable) */
  enabled?: boolean
}

/**
 * Hook that fires callback when CSS transition completes.
 * Uses transitionend event, respecting L1/L2 separation.
 *
 * @example
 * ```tsx
 * useTransitionComplete({
 *   elementRef: containerRef,
 *   property: 'clip-path',
 *   enabled: transitionPhase === 'opening',
 *   onComplete: () => setTransitionPhase('open'),
 * })
 * ```
 */
export function useTransitionComplete({
  elementRef,
  property,
  onComplete,
  enabled = true,
}: UseTransitionCompleteOptions): void {
  // Store callback in ref to avoid re-registering listener
  const callbackRef = useRef(onComplete)
  callbackRef.current = onComplete

  // Check for reduced motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (!enabled) return

    const element = elementRef.current
    if (!element) return

    // If reduced motion is preferred, transitions are instant
    // Fire callback immediately via requestAnimationFrame
    if (prefersReducedMotion) {
      const frameId = requestAnimationFrame(() => {
        callbackRef.current()
      })
      return () => cancelAnimationFrame(frameId)
    }

    const handleTransitionEnd = (e: TransitionEvent) => {
      // Only fire for the property we're watching and the exact element
      if (e.propertyName === property && e.target === element) {
        callbackRef.current()
      }
    }

    element.addEventListener('transitionend', handleTransitionEnd)

    return () => {
      element.removeEventListener('transitionend', handleTransitionEnd)
    }
  }, [elementRef, property, enabled, prefersReducedMotion])
}

/**
 * Options for useModalTransitionComplete hook.
 */
export interface UseModalTransitionCompleteOptions {
  /** Ref to the container element with transition */
  containerRef: React.RefObject<HTMLElement | null>
  /** Current transition phase */
  transitionPhase: 'closed' | 'opening' | 'open' | 'closing'
  /** CSS property to watch for completion */
  property?: string
  /** Called when opening transition completes */
  onOpenComplete?: () => void
  /** Called when closing transition completes */
  onCloseComplete?: () => void
  /** Function to update transition phase in store */
  setTransitionPhase: (phase: 'closed' | 'opening' | 'open' | 'closing') => void
}

/**
 * Specialized hook for modal transition lifecycle.
 * Handles both opening and closing transitions.
 *
 * @example
 * ```tsx
 * useModalTransitionComplete({
 *   containerRef,
 *   transitionPhase,
 *   property: 'clip-path', // or 'opacity' for fade
 *   setTransitionPhase: useModalStore.getState().setTransitionPhase,
 *   onOpenComplete: config?.onOpenComplete,
 *   onCloseComplete: () => {
 *     config?.onClose?.()
 *     previousFocusRef.current?.focus()
 *   },
 * })
 * ```
 */
export function useModalTransitionComplete({
  containerRef,
  transitionPhase,
  property = 'clip-path',
  onOpenComplete,
  onCloseComplete,
  setTransitionPhase,
}: UseModalTransitionCompleteOptions): void {
  // Handle opening -> open
  const handleOpenComplete = useCallback(() => {
    setTransitionPhase('open')
    onOpenComplete?.()
  }, [setTransitionPhase, onOpenComplete])

  // Handle closing -> closed
  const handleCloseComplete = useCallback(() => {
    setTransitionPhase('closed')
    onCloseComplete?.()
  }, [setTransitionPhase, onCloseComplete])

  // Watch for opening completion
  useTransitionComplete({
    elementRef: containerRef,
    property,
    enabled: transitionPhase === 'opening',
    onComplete: handleOpenComplete,
  })

  // Watch for closing completion
  useTransitionComplete({
    elementRef: containerRef,
    property,
    enabled: transitionPhase === 'closing',
    onComplete: handleCloseComplete,
  })
}

export default useTransitionComplete
