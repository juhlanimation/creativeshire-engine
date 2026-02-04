'use client'

/**
 * useWheelNavigation - wheel events trigger section navigation.
 *
 * Accumulates wheel delta until snapThreshold is reached, then navigates.
 * Respects debounce and lockDuringTransition settings.
 *
 * Container-aware:
 * In contained mode, listens to wheel events on the container element
 * and queries sections within the container.
 *
 * @example
 * ```tsx
 * useWheelNavigation({
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
import { useContainer } from '../../interface/ContainerContext'

export interface WheelNavigationOptions {
  /** Zustand store with navigation state */
  store: StoreApi<NavigableExperienceState>
  /** Navigation configuration */
  config: NavigationConfig
  /** Whether wheel navigation is enabled (default: true) */
  enabled?: boolean
  /** Override options (takes precedence over config.inputs options) */
  options?: NavigationInputOptions
}

/**
 * Hook that listens to wheel events and triggers section navigation.
 * Accumulates delta until threshold, then navigates forward/backward.
 */
export function useWheelNavigation(hookOptions: WheelNavigationOptions): void {
  const { store, config, enabled = true, options: overrideOptions } = hookOptions

  // Get container context for contained mode
  const { mode: containerMode, containerRef } = useContainer()

  // Find wheel input config
  const wheelInput = config.inputs.find((i) => i.type === 'wheel')
  const isWheelEnabled = enabled && wheelInput?.enabled

  // Refs for accumulated delta and debounce
  const accumulatedDelta = useRef(0)
  const lastNavigationTime = useRef(0)

  useEffect(() => {
    if (!isWheelEnabled) return
    if (typeof window === 'undefined') return

    // Determine event target based on container mode
    const isContained = containerMode === 'contained' && containerRef?.current
    const eventTarget = isContained ? containerRef.current : window
    const queryRoot = isContained ? containerRef.current : document

    // Use override options if provided, otherwise use config options
    const inputOptions = overrideOptions ?? wheelInput?.options ?? {}
    const snapThreshold = inputOptions.snapThreshold ?? 50
    const wheelSensitivity = inputOptions.wheelSensitivity ?? 1

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

      // Reset accumulated delta after navigation
      accumulatedDelta.current = 0
    }

    /**
     * Check if an element can scroll in a given direction.
     */
    function canScrollInDirection(element: HTMLElement, direction: 'up' | 'down'): boolean {
      const { scrollTop, scrollHeight, clientHeight } = element
      const isScrollable = scrollHeight > clientHeight

      if (!isScrollable) return false

      if (direction === 'up') {
        return scrollTop > 1 // Can scroll up if not at top
      } else {
        return scrollTop + clientHeight < scrollHeight - 1 // Can scroll down if not at bottom
      }
    }

    /**
     * Find if any scrollable element in the active section can scroll in the given direction.
     * Checks the section element and all its descendants.
     */
    function canSectionScroll(sectionElement: Element | null, direction: 'up' | 'down'): boolean {
      if (!sectionElement) return false

      // Check the section element itself
      if (canScrollInDirection(sectionElement as HTMLElement, direction)) {
        return true
      }

      // Check all descendants that might be scrollable
      const scrollableElements = sectionElement.querySelectorAll('*')
      for (const el of scrollableElements) {
        const style = window.getComputedStyle(el)
        const overflowY = style.overflowY
        // Check if element has overflow that allows scrolling
        if (overflowY === 'auto' || overflowY === 'scroll') {
          if (canScrollInDirection(el as HTMLElement, direction)) {
            return true
          }
        }
      }

      return false
    }

    /**
     * Wheel event handler with scroll-then-snap behavior.
     * Allows natural scrolling within sections, only navigates at boundaries.
     */
    function handleWheel(event: WheelEvent): void {
      // Skip if event was already handled (e.g., by smooth scroll container)
      if (event.defaultPrevented) return

      const state = store.getState()

      // Find the active section element (within container or document)
      const activeSection = queryRoot?.querySelector(
        `[data-section-id][data-active="true"]`
      )

      const scrollingDown = event.deltaY > 0
      const scrollingUp = event.deltaY < 0
      const scrollDirection = scrollingDown ? 'down' : 'up'

      // Check if the section (or any element within it) can scroll in this direction
      if (canSectionScroll(activeSection ?? null, scrollDirection)) {
        // Let natural scroll happen - don't prevent default, don't navigate
        return
      }

      // Section cannot scroll in this direction (at boundary or not scrollable)
      // Navigate to next/prev slide
      event.preventDefault()

      // Accumulate delta with sensitivity
      accumulatedDelta.current += event.deltaY * wheelSensitivity

      // Check if threshold reached
      if (Math.abs(accumulatedDelta.current) >= snapThreshold) {
        const direction = accumulatedDelta.current > 0 ? 1 : -1
        const targetIndex = state.activeSection + direction

        navigate(targetIndex, 'wheel')
      }
    }

    // Add listener (passive: false to allow preventDefault at boundaries)
    eventTarget?.addEventListener('wheel', handleWheel as EventListener, { passive: false })

    return () => {
      eventTarget?.removeEventListener('wheel', handleWheel as EventListener)
    }
  }, [isWheelEnabled, wheelInput, config, store, overrideOptions, containerMode, containerRef])
}

export default useWheelNavigation
