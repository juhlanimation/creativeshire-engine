/**
 * Infinite Carousel experience - vertical infinite scroll with momentum physics.
 * Sections scroll continuously with snap-to-section behavior.
 */

import type { Experience } from '../types'
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

  sectionBehaviours: {},

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

  // Presentation wrapper handles layout — no extra wrapper needed

  experienceChrome: [],

  constraints: {
    fullViewportSections: true,
  },

  // Runtime controller for momentum physics and section transforms
  controller: InfiniteCarouselController,

  hideChrome: ['footer'],
}

