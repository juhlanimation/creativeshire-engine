/**
 * Cover Scroll experience.
 * First section stays fixed as a backdrop while remaining sections scroll over it.
 * Behaviours (like scroll/cover-progress) work normally — no bareMode.
 */

import { createStore } from 'zustand'
import type { Experience, ExperienceState } from '../types'
import { meta } from './meta'

export const coverScrollExperience: Experience = {
  id: 'cover-scroll',
  settings: meta.settings,
  name: 'Cover Scroll',
  description:
    'First section stays fixed as backdrop while remaining sections scroll over it. Ideal for video heroes with content overlay.',
  icon: 'layers',
  tags: ['scroll-driven', 'cover', 'hero', 'backdrop'],
  category: 'scroll-driven',

  provides: ['scrollProgress', 'sectionVisibilities'],
  createStore: () =>
    createStore<ExperienceState>(() => ({
      scrollProgress: 0,
      viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
      isScrolling: false,
      prefersReducedMotion: false,
      sectionVisibilities: {},
      cursorX: 0,
      cursorY: 0,
    })),
  triggers: [
    { type: 'scroll-progress', target: 'scrollProgress' },
    { type: 'intersection', target: 'sectionVisibilities' },
  ],

  behaviourDefaults: {
    section: 'none',
  },

  presentation: {
    model: 'cover-scroll',
    // Keep ScrollSmoother active for smooth scrolling.
    // Pinned sections portal to a fixed backdrop layer.
    ownsPageScroll: false,
    visibility: {
      maxVisible: Infinity,
      overlap: 0,
      stackDirection: 'forward',
    },
    transition: {
      behaviourId: 'none',
      duration: 0,
      easing: 'linear',
      interruptible: true,
    },
    layout: {
      fullViewport: false,
      overflow: 'visible',
      gap: '0',
      direction: 'vertical',
    },
  },
}
