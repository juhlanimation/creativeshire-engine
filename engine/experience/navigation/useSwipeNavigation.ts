'use client'

/**
 * useSwipeNavigation - touch swipe events trigger section navigation.
 *
 * Tracks touchstart/touchmove/touchend to detect swipe gestures.
 * Navigates if swipe distance exceeds threshold within maxDuration.
 *
 * @example
 * ```tsx
 * useSwipeNavigation({
 *   store,
 *   config,
 *   enabled: true,
 * })
 * ```
 */

import { useEffect, useRef } from 'react'
import type { StoreApi } from 'zustand'
import type {
  NavigableExperienceState,
  NavigationConfig,
  NavigationInput,
  NavigationInputOptions,
} from '../experiences/types'

export interface SwipeNavigationOptions {
  /** Zustand store with navigation state */
  store: StoreApi<NavigableExperienceState>
  /** Navigation configuration */
  config: NavigationConfig
  /** Whether swipe navigation is enabled (default: true) */
  enabled?: boolean
  /** Override options (takes precedence over config.inputs options) */
  options?: NavigationInputOptions
}

/** Touch start data */
interface TouchStart {
  x: number
  y: number
  time: number
}

/**
 * Hook that listens to touch events and triggers section navigation on swipe.
 */
export function useSwipeNavigation(hookOptions: SwipeNavigationOptions): void {
  const { store, config, enabled = true, options: overrideOptions } = hookOptions

  // Find swipe input config
  const swipeInput = config.inputs.find((i) => i.type === 'swipe')
  const isSwipeEnabled = enabled && swipeInput?.enabled

  // Refs for touch tracking and debounce
  const touchStart = useRef<TouchStart | null>(null)
  const lastNavigationTime = useRef(0)

  useEffect(() => {
    if (!isSwipeEnabled) return
    if (typeof window === 'undefined') return

    // Use override options if provided, otherwise use config options
    const inputOptions = overrideOptions ?? swipeInput?.options ?? {}
    const direction = inputOptions.direction ?? 'vertical'
    const threshold = inputOptions.threshold ?? 50
    const maxDuration = inputOptions.maxDuration ?? 300

    /**
     * Navigate to target section with guards.
     */
    function navigate(targetIndex: number, inputType: NavigationInput): void {
      const state = store.getState()

      // Guard: navigation locked
      if (state.isLocked) return

      // Guard: transitioning and lock enabled
      if (config.behavior.lockDuringTransition && state.isTransitioning) return

      // Guard: debounce
      const now = Date.now()
      if (now - lastNavigationTime.current < config.behavior.debounce) return

      // Bounds check with optional loop
      let bounded: number
      if (config.behavior.loop) {
        bounded = (targetIndex + state.totalSections) % state.totalSections
      } else {
        bounded = Math.max(0, Math.min(targetIndex, state.totalSections - 1))
      }

      // Guard: same section
      if (bounded === state.activeSection) return

      // Update navigation time
      lastNavigationTime.current = now

      // Update state
      store.setState({
        previousSection: state.activeSection,
        activeSection: bounded,
        transitionDirection: bounded > state.activeSection ? 'forward' : 'backward',
        lastInputType: inputType,
        isTransitioning: true,
      })
    }

    /**
     * Touch start handler - record start position and time.
     */
    function handleTouchStart(event: TouchEvent): void {
      if (event.touches.length !== 1) return

      const touch = event.touches[0]
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      }
    }

    /**
     * Touch end handler - check if swipe meets criteria.
     */
    function handleTouchEnd(event: TouchEvent): void {
      if (!touchStart.current) return
      if (event.changedTouches.length !== 1) return

      const touch = event.changedTouches[0]
      const endTime = Date.now()
      const duration = endTime - touchStart.current.time

      // Check duration limit
      if (duration > maxDuration) {
        touchStart.current = null
        return
      }

      const deltaX = touch.clientX - touchStart.current.x
      const deltaY = touch.clientY - touchStart.current.y

      // Determine swipe direction and magnitude
      let swipeDirection: 'forward' | 'backward' | null = null

      if (direction === 'vertical' || direction === 'both') {
        // Vertical swipe: swipe up = forward, swipe down = backward
        if (Math.abs(deltaY) >= threshold && Math.abs(deltaY) > Math.abs(deltaX)) {
          swipeDirection = deltaY < 0 ? 'forward' : 'backward'
        }
      }

      if (direction === 'horizontal' || direction === 'both') {
        // Horizontal swipe: swipe left = forward, swipe right = backward
        if (Math.abs(deltaX) >= threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
          swipeDirection = deltaX < 0 ? 'forward' : 'backward'
        }
      }

      // Navigate if swipe detected
      if (swipeDirection) {
        const state = store.getState()
        const targetIndex = state.activeSection + (swipeDirection === 'forward' ? 1 : -1)
        navigate(targetIndex, 'swipe')

        // Prevent default scrolling on successful swipe
        // Note: Can't preventDefault in passive listener, but the navigation
        // will lock the state which effectively prevents double-navigation
      }

      // Clear touch start
      touchStart.current = null
    }

    /**
     * Touch cancel handler - reset tracking.
     */
    function handleTouchCancel(): void {
      touchStart.current = null
    }

    // Add listeners
    // Use passive: false only for touchmove if we need preventDefault
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    document.addEventListener('touchcancel', handleTouchCancel, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('touchcancel', handleTouchCancel)
    }
  }, [isSwipeEnabled, swipeInput, config, store, overrideOptions])
}

export default useSwipeNavigation
