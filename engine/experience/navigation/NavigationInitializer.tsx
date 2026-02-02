'use client'

/**
 * NavigationInitializer - initializes section navigation based on experience config.
 * Renders nothing - just sets up event listeners via hooks.
 */

import { useEffect } from 'react'
import type { StoreApi } from 'zustand'
import type { NavigationConfig, NavigationInputOptions } from '../experiences/types'
import type { NavigableExperienceState } from '../modes/types'
import { useWheelNavigation } from './useWheelNavigation'
import { useKeyboardNavigation } from './useKeyboardNavigation'
import { useSwipeNavigation } from './useSwipeNavigation'

export interface NavigationInitializerProps {
  store: StoreApi<NavigableExperienceState>
  config: NavigationConfig
  /** Total sections on the page (set on mount) */
  totalSections: number
}

export function NavigationInitializer({
  store,
  config,
  totalSections,
}: NavigationInitializerProps): null {
  // Initialize total sections count on mount
  useEffect(() => {
    store.setState({ totalSections })
  }, [store, totalSections])

  // Initialize hash-based navigation
  useEffect(() => {
    if (!config.history.restoreFromHash) return

    const hash = window.location.hash.slice(1)
    if (hash) {
      const index = parseInt(hash, 10)
      if (!isNaN(index) && index >= 0 && index < totalSections) {
        store.setState({ activeSection: index })
      }
    }
  }, [config.history.restoreFromHash, store, totalSections])

  // Update hash when activeSection changes
  useEffect(() => {
    if (!config.history.updateHash) return

    const unsubscribe = store.subscribe((state, prevState) => {
      if (state.activeSection !== prevState.activeSection) {
        const newHash = `#${state.activeSection}`
        if (config.history.pushState) {
          window.history.pushState(null, '', newHash)
        } else {
          window.history.replaceState(null, '', newHash)
        }
      }
    })

    return unsubscribe
  }, [config.history.updateHash, config.history.pushState, store])

  // Reset isTransitioning after transition completes
  // This allows navigation to work again after the CSS transition finishes
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const unsubscribe = store.subscribe((state, prevState) => {
      // When transition starts, schedule reset
      if (state.isTransitioning && !prevState.isTransitioning) {
        // Clear any pending timeout
        if (timeoutId) clearTimeout(timeoutId)

        // Reset after transition duration (700ms covers most transitions + buffer)
        // TODO: Get actual duration from presentation config
        timeoutId = setTimeout(() => {
          store.setState({
            isTransitioning: false,
            transitionProgress: 0,
          })
        }, 700)
      }
    })

    return () => {
      unsubscribe()
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [store])

  // Check which inputs are enabled
  const wheelEnabled = config.inputs.some((i) => i.type === 'wheel' && i.enabled)
  const keyboardEnabled = config.inputs.some((i) => i.type === 'keyboard' && i.enabled)
  const swipeEnabled = config.inputs.some((i) => i.type === 'swipe' && i.enabled)

  // Get options for each input type
  const wheelOptions = config.inputs.find((i) => i.type === 'wheel')?.options
  const keyboardOptions = config.inputs.find((i) => i.type === 'keyboard')?.options
  const swipeOptions = config.inputs.find((i) => i.type === 'swipe')?.options

  // Initialize hooks conditionally
  useWheelNavigation({
    store,
    config,
    enabled: wheelEnabled,
    options: wheelOptions,
  })

  useKeyboardNavigation({
    store,
    config,
    enabled: keyboardEnabled,
    options: keyboardOptions,
  })

  useSwipeNavigation({
    store,
    config,
    enabled: swipeEnabled,
    options: swipeOptions,
  })

  return null
}
