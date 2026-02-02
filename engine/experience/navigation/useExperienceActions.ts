'use client'

/**
 * useExperienceActions - programmatic navigation control.
 *
 * Returns typed actions for controlling section navigation.
 * Used by chrome components, navigation indicators, and external controls.
 *
 * @example
 * ```tsx
 * const actions = useExperienceActions(store, config)
 *
 * // Navigate to specific section
 * actions.goToSection(2)
 *
 * // Next/previous
 * actions.nextSection()
 * actions.previousSection()
 *
 * // Lock during modal, etc.
 * actions.setNavigationLock(true)
 * ```
 */

import { useCallback, useMemo } from 'react'
import type { StoreApi } from 'zustand'
import type {
  NavigableExperienceState,
  NavigationConfig,
  ExperienceActions,
} from '../experiences/types'

/**
 * Hook that returns programmatic navigation actions.
 * Actions respect debounce and lock settings from config.
 */
export function useExperienceActions(
  store: StoreApi<NavigableExperienceState>,
  config: NavigationConfig
): ExperienceActions {
  /**
   * Navigate to a specific section by index.
   * Respects bounds, loop, and lock settings.
   */
  const goToSection = useCallback(
    (index: number): void => {
      const state = store.getState()

      // Guard: navigation locked
      if (state.isLocked) return

      // Guard: transitioning and lock enabled
      if (config.behavior.lockDuringTransition && state.isTransitioning) return

      // Guard: skip not allowed and target is not adjacent
      if (!config.behavior.allowSkip) {
        const distance = Math.abs(index - state.activeSection)
        if (distance > 1) {
          // Navigate to adjacent section in the target direction
          index = state.activeSection + (index > state.activeSection ? 1 : -1)
        }
      }

      // Bounds check with optional loop
      let bounded: number
      if (config.behavior.loop) {
        bounded = ((index % state.totalSections) + state.totalSections) % state.totalSections
      } else {
        bounded = Math.max(0, Math.min(index, state.totalSections - 1))
      }

      // Guard: same section
      if (bounded === state.activeSection) return

      // Update state
      store.setState({
        previousSection: state.activeSection,
        activeSection: bounded,
        transitionDirection: bounded > state.activeSection ? 'forward' : 'backward',
        lastInputType: 'programmatic',
        isTransitioning: true,
      })
    },
    [store, config]
  )

  /**
   * Navigate to the next section.
   */
  const nextSection = useCallback((): void => {
    const state = store.getState()
    goToSection(state.activeSection + 1)
  }, [store, goToSection])

  /**
   * Navigate to the previous section.
   */
  const previousSection = useCallback((): void => {
    const state = store.getState()
    goToSection(state.activeSection - 1)
  }, [store, goToSection])

  /**
   * Lock or unlock navigation.
   * Used during modals, animations, or other blocking interactions.
   */
  const setNavigationLock = useCallback(
    (locked: boolean): void => {
      store.setState({ isLocked: locked })
    },
    [store]
  )

  // Memoize the actions object
  const actions = useMemo<ExperienceActions>(
    () => ({
      goToSection,
      nextSection,
      previousSection,
      setNavigationLock,
    }),
    [goToSection, nextSection, previousSection, setNavigationLock]
  )

  return actions
}

export default useExperienceActions
