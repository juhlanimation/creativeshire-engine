'use client'

/**
 * NavigationInitializer - initializes section navigation based on experience config.
 * Renders nothing - just sets up event listeners via hooks.
 *
 * Self-contained: reads experience config and store from useExperience().
 * Discovers section count from DOM (presentation wrapper > [data-section-id]).
 */

import { useEffect } from 'react'
import type { StoreApi } from 'zustand'
import type {
  NavigationConfig,
  NavigableExperienceState,
} from '../experiences/types'
import { useExperience } from '../experiences/ExperienceProvider'
import { useContainer } from '../../interface/ContainerContext'
import { useWheelNavigation } from './useWheelNavigation'
import { useKeyboardNavigation } from './useKeyboardNavigation'
import { useSwipeNavigation } from './useSwipeNavigation'

export function NavigationInitializer(): null {
  const { experience, store: baseStore } = useExperience()
  const store = baseStore as StoreApi<NavigableExperienceState>
  const config = experience.navigation!

  // Get container context for contained mode support
  const { mode: containerMode, containerRef } = useContainer()

  // Discover section count from DOM and set on store
  useEffect(() => {
    const wrapper = document.querySelector<HTMLElement>('.presentation-wrapper')
    if (!wrapper) return

    const sections = wrapper.querySelectorAll('[data-section-id]')
    const totalSections = sections.length
    store.setState({ totalSections })
  }, [store])

  // Read totalSections from store for hash navigation
  const totalSections = store.getState().totalSections

  // Initialize hash-based navigation
  useEffect(() => {
    if (!config.history.restoreFromHash) return

    const hash = window.location.hash.slice(1)
    if (hash) {
      const current = store.getState().totalSections
      const index = parseInt(hash, 10)
      if (!isNaN(index) && index >= 0 && index < current) {
        store.setState({ activeSection: index })
      }
    }
  }, [config.history.restoreFromHash, store])

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
    containerMode,
    containerRef,
  })

  useSwipeNavigation({
    store,
    config,
    enabled: swipeEnabled,
    options: swipeOptions,
  })

  return null
}
