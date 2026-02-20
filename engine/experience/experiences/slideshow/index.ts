/**
 * Slideshow experience - full-screen slides with navigation.
 * Sections become slides. One visible at a time.
 */

import type { Experience } from '../types'
import { NavigationInitializer } from '../../navigation/NavigationInitializer'

export const slideshowExperience: Experience = {
  id: 'slideshow',
  name: 'Slideshow',
  description: 'Full-screen slides with navigation. Sections become slides.',
  icon: 'presentation',
  tags: ['slides', 'fullscreen', 'navigation', 'presentation'],
  category: 'presentation',

  sectionBehaviours: {
    '*': [{ behaviour: 'slide/item' }],
  },

  // Presentation config - uses scroll-snap for crisp section stops
  presentation: {
    model: 'slideshow',
    ownsPageScroll: true,
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

  // Scroll-snap + ScrollSmoother handles layout — no extra wrapper needed

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

  // Runtime controller for navigation input handling
  controller: NavigationInitializer,

  // Hide footer in slideshow mode (full-screen sections don't need it)
  hideChrome: ['footer'],
}

