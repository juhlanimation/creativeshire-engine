'use client'

/**
 * useKeyboardNavigation - keyboard events trigger section navigation.
 *
 * Default keys: ArrowUp/ArrowDown, PageUp/PageDown, Home/End
 * Supports custom keys via options.
 *
 * @example
 * ```tsx
 * useKeyboardNavigation({
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

export interface KeyboardNavigationOptions {
  /** Zustand store with navigation state */
  store: StoreApi<NavigableExperienceState>
  /** Navigation configuration */
  config: NavigationConfig
  /** Whether keyboard navigation is enabled (default: true) */
  enabled?: boolean
  /** Override options (takes precedence over config.inputs options) */
  options?: NavigationInputOptions
}

/** Default keys for navigation */
const DEFAULT_KEYS = {
  previous: ['ArrowUp', 'PageUp'],
  next: ['ArrowDown', 'PageDown'],
  first: ['Home'],
  last: ['End'],
}

/**
 * Hook that listens to keyboard events and triggers section navigation.
 */
export function useKeyboardNavigation(hookOptions: KeyboardNavigationOptions): void {
  const { store, config, enabled = true, options: overrideOptions } = hookOptions

  // Find keyboard input config
  const keyboardInput = config.inputs.find((i) => i.type === 'keyboard')
  const isKeyboardEnabled = enabled && keyboardInput?.enabled

  // Ref for debounce
  const lastNavigationTime = useRef(0)

  useEffect(() => {
    if (!isKeyboardEnabled) return
    if (typeof window === 'undefined') return

    // Use override options if provided, otherwise use config options
    const inputOptions = overrideOptions ?? keyboardInput?.options ?? {}
    const customKeys = inputOptions.keys ?? []
    const allowRepeat = inputOptions.repeat ?? false

    // Build key sets - custom keys override defaults if provided
    const previousKeys = customKeys.length > 0
      ? customKeys.filter((k) => k.toLowerCase().includes('up') || k.toLowerCase().includes('left'))
      : DEFAULT_KEYS.previous
    const nextKeys = customKeys.length > 0
      ? customKeys.filter((k) => k.toLowerCase().includes('down') || k.toLowerCase().includes('right'))
      : DEFAULT_KEYS.next
    const firstKeys = DEFAULT_KEYS.first
    const lastKeys = DEFAULT_KEYS.last

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
     * Keydown event handler.
     */
    function handleKeydown(event: KeyboardEvent): void {
      // Ignore if repeat and repeat is disabled
      if (event.repeat && !allowRepeat) return

      // Ignore if in input/textarea/contenteditable
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      const state = store.getState()
      let targetIndex: number | null = null

      // Check which key was pressed
      if (previousKeys.includes(event.key)) {
        targetIndex = state.activeSection - 1
        event.preventDefault()
      } else if (nextKeys.includes(event.key)) {
        targetIndex = state.activeSection + 1
        event.preventDefault()
      } else if (firstKeys.includes(event.key) && config.behavior.allowSkip) {
        targetIndex = 0
        event.preventDefault()
      } else if (lastKeys.includes(event.key) && config.behavior.allowSkip) {
        targetIndex = state.totalSections - 1
        event.preventDefault()
      }

      // Navigate if target determined
      if (targetIndex !== null) {
        navigate(targetIndex, 'keyboard')
      }
    }

    // Add listener
    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [isKeyboardEnabled, keyboardInput, config, store, overrideOptions])
}

export default useKeyboardNavigation
