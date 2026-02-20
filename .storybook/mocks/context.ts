/**
 * Mock context values for Storybook stories.
 * Provides minimal mocks for engine providers.
 */

import { createStore } from 'zustand'
import type {
  Experience,
  ExperienceState,
  InfiniteCarouselState,
  NavigableExperienceState,
} from '../../engine/experience/experiences/types'

/**
 * Bare experience — bareMode disables all behaviours.
 * Widgets render with their L1 content, no L2 animations.
 */
export const bareExperience: Experience = {
  id: 'storybook-bare',
  name: 'Storybook Bare',
  description: 'Bare mode for isolated widget preview',
  sectionBehaviours: {},
  bareMode: true,
}

/**
 * Noop experience store — provides default state, never updated.
 */
export function createNoopStore() {
  return createStore<ExperienceState>(() => ({
    scrollProgress: 0,
    viewportHeight: 800,
    isScrolling: false,
    prefersReducedMotion: false,
    sectionVisibilities: {},
    cursorX: 0,
    cursorY: 0,
  }))
}

/** Store with InfiniteCarouselState for FixedCard/NavTimeline stories */
export function createCarouselStore(overrides?: Partial<InfiniteCarouselState>) {
  return createStore<InfiniteCarouselState>(() => ({
    scrollProgress: 0,
    viewportHeight: 800,
    isScrolling: false,
    prefersReducedMotion: false,
    sectionVisibilities: {},
    cursorX: 0,
    cursorY: 0,
    activeSection: 0,
    previousSection: 0,
    totalSections: 4,
    isTransitioning: false,
    transitionProgress: 0,
    transitionDirection: null,
    lastInputType: null,
    isLocked: false,
    velocity: 0,
    snapTarget: -1,
    isSnapping: false,
    phase: 'ready',
    hasLooped: false,
    sectionIds: ['intro', 'work', 'about', 'contact'],
    clipProgress: 0,
    pinnedSections: [],
    ...overrides,
  }))
}

/** Store with NavigableExperienceState for SlideIndicators stories */
export function createNavigableStore(overrides?: Partial<NavigableExperienceState>) {
  return createStore<NavigableExperienceState>(() => ({
    scrollProgress: 0,
    viewportHeight: 800,
    isScrolling: false,
    prefersReducedMotion: false,
    sectionVisibilities: {},
    cursorX: 0,
    cursorY: 0,
    activeSection: 0,
    previousSection: 0,
    totalSections: 5,
    isTransitioning: false,
    transitionProgress: 0,
    transitionDirection: null,
    lastInputType: null,
    isLocked: false,
    ...overrides,
  }))
}
