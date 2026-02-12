/**
 * Cover Scroll experience.
 * Any section marked `pinned: true` sticks at the viewport top (position: sticky)
 * while subsequent sections scroll over it. Supports multiple pinned sections.
 *
 * Forces Lenis smooth scroll provider — CSS sticky doesn't work inside
 * GSAP ScrollSmoother's transform context.
 *
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
    'Pinned sections stick at the viewport top while remaining sections scroll over them. Mark any section as pinned for the cover effect.',
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

  sectionInjections: {},

  presentation: {
    model: 'cover-scroll',
    // Lenis required: CSS position:sticky doesn't work inside GSAP ScrollSmoother's
    // transform context. Lenis uses native scroll with interpolation — sticky works.
    ownsPageScroll: false,
    smoothScrollOverride: { provider: 'lenis' },
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
