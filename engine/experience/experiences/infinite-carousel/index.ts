/**
 * Infinite Carousel experience - vertical infinite scroll with momentum physics.
 * Sections scroll continuously with snap-to-section behavior.
 */

import { createStore } from 'zustand'
import type { Experience, InfiniteCarouselState } from '../types'
import { InfiniteCarouselController } from '../InfiniteCarouselController'
import { meta } from './meta'

export const infiniteCarouselExperience: Experience = {
  id: 'infinite-carousel',
  settings: meta.settings,
  name: 'Infinite Carousel',
  description: 'Vertical infinite scroll with momentum physics and snap-to-section.',
  icon: 'scroll',
  tags: ['carousel', 'infinite', 'momentum', 'physics', 'scroll'],
  category: 'physics',

  provides: [
    'scrollProgress', 'velocity', 'activeSection', 'previousSection',
    'totalSections', 'isSnapping', 'snapTarget', 'phase', 'hasLooped',
    'isTransitioning', 'transitionProgress', 'transitionDirection', 'clipProgress',
    'pinnedSections',
  ],

  createStore: () =>
    createStore<InfiniteCarouselState>(() => ({
      // Base ExperienceState
      scrollProgress: 0,
      viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
      isScrolling: false,
      prefersReducedMotion: false,
      sectionVisibilities: {},
      cursorX: 0,
      cursorY: 0,
      // NavigationState
      activeSection: 0,
      previousSection: 0,
      totalSections: 0,
      isTransitioning: false,
      transitionProgress: 0,
      transitionDirection: null,
      lastInputType: null,
      isLocked: false,
      // InfiniteCarouselState specific
      velocity: 0,
      snapTarget: -1,
      isSnapping: false,
      phase: 'intro',
      hasLooped: false,
      sectionIds: [],
      clipProgress: 0,
      pinnedSections: [],
    })),

  triggers: [],  // MomentumDriver handles all input

  behaviourDefaults: {
    section: 'none',  // Sections positioned via CSS from driver
  },

  presentation: {
    model: 'infinite-carousel',
    ownsPageScroll: true,
    visibility: {
      maxVisible: 2,
      overlap: 0.5,
      stackDirection: 'forward',
    },
    transition: {
      behaviourId: 'none',
      duration: 0,
      easing: 'linear',
      interruptible: true,
    },
    layout: {
      fullViewport: true,
      overflow: 'hidden',
      gap: '0',
      direction: 'vertical',
    },
  },

  navigation: {
    inputs: [
      { type: 'scroll', enabled: true, options: { behavior: 'snap' } },
      { type: 'swipe', enabled: true, options: { direction: 'vertical', threshold: 30 } },
      { type: 'keyboard', enabled: true, options: { keys: ['ArrowUp', 'ArrowDown'] } },
    ],
    behavior: {
      loop: true,
      allowSkip: true,
      lockDuringTransition: false,
      debounce: 0,
    },
    activeSection: {
      strategy: 'scroll-position',
    },
    history: {
      updateHash: true,
      restoreFromHash: true,
      pushState: false,
    },
  },

  // No pageWrapper - the presentation wrapper handles layout
  // pageWrapper: undefined,

  experienceChrome: [],

  constraints: {
    fullViewportSections: true,
  },

  // Runtime controller for momentum physics and section transforms
  controller: InfiniteCarouselController,

  hideChrome: ['footer'],
}

