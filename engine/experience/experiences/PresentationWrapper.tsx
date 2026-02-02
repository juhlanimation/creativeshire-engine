'use client'

import './presentation.css'

/**
 * PresentationWrapper - applies presentation CSS variables from experience config.
 *
 * Sets CSS custom properties that behaviours and CSS can consume:
 * - --presentation-model: 'stacking' | 'slideshow' | 'parallax' | 'horizontal'
 * - --max-visible: number of sections visible at once
 * - --section-overlap: overlap ratio (0-1)
 * - --transition-duration: ms
 * - --transition-easing: easing function
 * - --layout-direction: 'vertical' | 'horizontal'
 * - --layout-gap: gap value
 * - --section-min-height: '100vh' if fullViewport
 * - --section-overflow: overflow value
 *
 * From store (reactive):
 * - --active-section: current section index
 * - --previous-section: previous section index
 * - --transition-progress: 0-1
 * - --is-transitioning: 0 | 1
 * - --transition-direction: 'forward' | 'backward' | ''
 */

import {
  useEffect,
  useMemo,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from 'react'
import type { StoreApi } from 'zustand'
import type { PresentationConfig } from './types'
import type { NavigableExperienceState, ExperienceState } from '../modes/types'

export interface PresentationWrapperProps {
  /** Presentation configuration from experience */
  config?: PresentationConfig
  /** Experience store for reactive state */
  store: StoreApi<ExperienceState>
  /** Children to wrap */
  children: ReactNode
}

/**
 * Check if store has navigation state (NavigableExperienceState)
 */
function hasNavigationState(
  state: ExperienceState
): state is NavigableExperienceState {
  return 'activeSection' in state && typeof state.activeSection === 'number'
}

export function PresentationWrapper({
  config,
  store,
  children,
}: PresentationWrapperProps) {
  // Smooth scrolling for sections is now handled by SectionRenderer
  // using useSmoothScrollContainer hook with enabled: isSlideshow && isActive

  // Subscribe to store for reactive CSS variables
  const state = useSyncExternalStore(
    store.subscribe,
    () => store.getState(),
    () => store.getState()
  )

  // Build static CSS properties from config
  const staticStyles = useMemo((): CSSProperties => {
    if (!config) return {}

    return {
      '--presentation-model': config.model,
      '--max-visible': config.visibility.maxVisible,
      '--section-overlap': config.visibility.overlap,
      '--stack-direction': config.visibility.stackDirection,
      '--transition-duration': `${config.transition.duration}ms`,
      '--transition-easing': config.transition.easing,
      '--layout-direction': config.layout.direction,
      '--layout-gap': config.layout.gap,
      '--section-min-height': config.layout.fullViewport ? '100vh' : 'auto',
      '--section-overflow': config.layout.overflow,
    } as CSSProperties
  }, [config])

  // Build reactive CSS properties from store state
  const reactiveStyles = useMemo((): CSSProperties => {
    if (!hasNavigationState(state)) return {}

    return {
      '--active-section': state.activeSection,
      '--previous-section': state.previousSection,
      '--total-sections': state.totalSections,
      '--transition-progress': state.transitionProgress,
      '--is-transitioning': state.isTransitioning ? 1 : 0,
      '--transition-direction': state.transitionDirection ?? '',
      '--is-locked': state.isLocked ? 1 : 0,
    } as CSSProperties
  }, [state])

  // Combine styles
  const combinedStyles = useMemo(
    () => ({ ...staticStyles, ...reactiveStyles }),
    [staticStyles, reactiveStyles]
  )

  // Fix React Suspense boundary hidden attribute (Next.js streaming SSR)
  useEffect(() => {
    // Only needed for slideshow mode where visibility matters
    if (config?.model !== 'slideshow') return

    // Remove hidden attribute from Suspense boundaries that block visibility
    const suspenseBoundaries = document.querySelectorAll('body > [id^="S:"]')
    suspenseBoundaries.forEach(el => {
      if (el.hasAttribute('hidden')) {
        el.removeAttribute('hidden')
      }
    })
  }, [config?.model])

  // If no config, just render children without wrapper
  if (!config) {
    return <>{children}</>
  }

  return (
    <div
      className="presentation-wrapper"
      style={combinedStyles}
      data-presentation={config.model}
    >
      {children}
    </div>
  )
}

export default PresentationWrapper
