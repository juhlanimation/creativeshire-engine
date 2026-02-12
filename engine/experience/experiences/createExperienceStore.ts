/**
 * Auto-derives the experience store from the experience definition.
 * Store type is determined by the presentation model:
 * - Base: ExperienceState (default, cover-scroll, cinematic-portfolio)
 * - Slideshow: NavigableExperienceState (adds navigation fields)
 * - Infinite carousel: InfiniteCarouselState (adds momentum physics fields)
 *
 * Replaces manual `createStore` on Experience — the engine derives it.
 */

import { createStore, type StoreApi } from 'zustand'
import type {
  Experience,
  ExperienceState,
  NavigableExperienceState,
  InfiniteCarouselState,
} from './types'

/**
 * Create the Zustand store for an experience.
 * Derives the store shape from `experience.presentation.model`.
 */
export function createExperienceStore(experience: Experience): StoreApi<ExperienceState> {
  const model = experience.presentation?.model

  const baseState: ExperienceState = {
    scrollProgress: 0,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    isScrolling: false,
    prefersReducedMotion: false,
    sectionVisibilities: {},
    cursorX: 0,
    cursorY: 0,
  }

  if (model === 'infinite-carousel') {
    return createStore<InfiniteCarouselState>(() => ({
      ...baseState,
      // NavigationState
      activeSection: 0,
      previousSection: 0,
      totalSections: 0,
      isTransitioning: false,
      transitionProgress: 0,
      transitionDirection: null,
      lastInputType: null,
      isLocked: false,
      // InfiniteCarouselState
      velocity: 0,
      snapTarget: -1,
      isSnapping: false,
      phase: 'intro',
      hasLooped: false,
      sectionIds: [],
      clipProgress: 0,
      pinnedSections: [],
    })) as unknown as StoreApi<ExperienceState>
  }

  if (model === 'slideshow') {
    return createStore<NavigableExperienceState>(() => ({
      ...baseState,
      // NavigationState
      activeSection: 0,
      previousSection: 0,
      totalSections: 0,
      isTransitioning: false,
      transitionProgress: 0,
      transitionDirection: null,
      lastInputType: null,
      isLocked: false,
    })) as unknown as StoreApi<ExperienceState>
  }

  // Default: base ExperienceState (stacking, cover-scroll, etc.)
  return createStore<ExperienceState>(() => baseState)
}
