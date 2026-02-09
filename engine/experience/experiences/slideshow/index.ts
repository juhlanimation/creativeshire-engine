/**
 * Slideshow experience - full-screen slides with navigation.
 * Sections become slides. One visible at a time.
 */

import { createStore } from 'zustand'
import type { Experience, NavigableExperienceState } from '../types'
import { meta } from './meta'

export const slideshowExperience: Experience = {
  id: 'slideshow',
  settings: meta.settings,
  name: 'Slideshow',
  description: 'Full-screen slides with navigation. Sections become slides.',
  icon: 'presentation',
  tags: ['slides', 'fullscreen', 'navigation', 'presentation'],
  category: 'presentation',

  provides: [
    'activeSection', 'previousSection', 'totalSections',
    'isTransitioning', 'transitionProgress', 'transitionDirection',
    'lastInputType', 'isLocked',
  ],

  createStore: () =>
    createStore<NavigableExperienceState>(() => ({
      // Base ExperienceState
      scrollProgress: 0,
      viewportHeight: 0,
      isScrolling: false,
      prefersReducedMotion: false,
      sectionVisibilities: {},
      cursorX: 0,
      cursorY: 0,
      // Navigation state
      activeSection: 0,
      previousSection: 0,
      totalSections: 0,
      isTransitioning: false,
      transitionProgress: 0,
      transitionDirection: null,
      lastInputType: null,
      isLocked: false,
    })),

  triggers: [],  // Navigation handled by NavigationInitializer now

  behaviourDefaults: {
    section: 'slide/item',
  },

  // Presentation config - uses scroll-snap for crisp section stops
  presentation: {
    model: 'slideshow',
    visibility: {
      maxVisible: 1,  // Used by indicators
      overlap: 0,
      stackDirection: 'forward',
    },
    transition: {
      behaviourId: 'transition/fade',
      duration: 600,
      easing: 'ease-out',
      interruptible: false,
    },
    layout: {
      fullViewport: true,
      overflow: 'visible', // Normal scroll - not locked
      gap: '0',
      direction: 'vertical',
    },
  },

  // Navigation config - slideshow uses manual section navigation
  navigation: {
    inputs: [
      { type: 'wheel', enabled: true, options: { snapThreshold: 50, wheelSensitivity: 1 } },
      { type: 'keyboard', enabled: true, options: { keys: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'] } },
      { type: 'swipe', enabled: true, options: { direction: 'vertical', threshold: 50 } },
    ],
    behavior: {
      loop: false,
      allowSkip: true,
      lockDuringTransition: true,
      debounce: 300,
    },
    activeSection: {
      strategy: 'manual',
    },
    history: {
      updateHash: true,
      restoreFromHash: true,
      pushState: false,
    },
  },

  // No pageWrapper needed - scroll-snap + ScrollSmoother handles everything
  // pageWrapper: undefined

  // Slide indicators show active section (based on scroll position)
  experienceChrome: [
    {
      type: 'SlideIndicators',
      position: 'overlay',
      props: {
        position: 'right',
        style: 'dots',
      },
    },
  ],

  // Constraints for full-viewport sections
  constraints: {
    fullViewportSections: true,
  },

  // Hide footer in slideshow mode (full-screen sections don't need it)
  hideChrome: ['footer'],
}

