'use client'

/**
 * SlideIndicators - shows navigation dots for slideshow experience.
 * Reads activeSection from experience store, allows click navigation.
 */

import { useSyncExternalStore, useCallback } from 'react'
import type { StoreApi } from 'zustand'
import { useExperience } from '@/engine/experience'
import type { NavigableExperienceState } from '@/engine/experience/modes/types'
import './styles.css'

export interface SlideIndicatorsProps {
  /** Position: 'left' | 'right' | 'bottom' */
  position?: 'left' | 'right' | 'bottom'
  /** Visual style: 'dots' | 'lines' | 'numbers' */
  style?: 'dots' | 'lines' | 'numbers'
}

export function SlideIndicators({
  position = 'right',
  style = 'dots',
}: SlideIndicatorsProps) {
  const { store } = useExperience()
  // Cast to navigable store for slideshow experience
  const navStore = store as unknown as StoreApi<NavigableExperienceState>

  // Subscribe to navigation state
  const state = useSyncExternalStore(
    navStore.subscribe,
    () => navStore.getState(),
    () => navStore.getState()
  )

  // Check if store has navigation state
  const hasNavState = 'activeSection' in state && 'totalSections' in state
  if (!hasNavState || state.totalSections === 0) {
    return null
  }

  const { activeSection, totalSections } = state

  // Create indicator items
  const indicators = Array.from({ length: totalSections }, (_, i) => i)

  return (
    <nav
      className="slide-indicators"
      data-position={position}
      data-style={style}
      aria-label="Slide navigation"
    >
      {indicators.map((index) => (
        <SlideIndicatorItem
          key={index}
          index={index}
          isActive={index === activeSection}
          style={style}
          store={navStore}
        />
      ))}
    </nav>
  )
}

interface SlideIndicatorItemProps {
  index: number
  isActive: boolean
  style: 'dots' | 'lines' | 'numbers'
  store: StoreApi<NavigableExperienceState>
}

function SlideIndicatorItem({ index, isActive, style, store }: SlideIndicatorItemProps) {
  const handleClick = useCallback(() => {
    const state = store.getState()
    if (state.isLocked || state.isTransitioning) return

    store.setState({
      previousSection: state.activeSection,
      activeSection: index,
      transitionDirection: index > state.activeSection ? 'forward' : 'backward',
      lastInputType: 'click',
      isTransitioning: true,
    })
  }, [store, index])

  return (
    <button
      className="slide-indicator-item"
      data-active={isActive}
      onClick={handleClick}
      aria-label={`Go to slide ${index + 1}`}
      aria-current={isActive ? 'true' : undefined}
    >
      {style === 'numbers' ? index + 1 : null}
    </button>
  )
}

export default SlideIndicators
