/**
 * Stacking mode - static layout with no animation.
 * Sections stack vertically without scroll-driven effects.
 */

import { createStore } from 'zustand'
import type { Mode, ExperienceState } from '../types'

/**
 * Stacking mode configuration.
 * Provides no animation defaults - sections render as static stack.
 * This is the simplest mode with no scroll-driven effects.
 */
export const stackingMode: Mode = {
  id: 'stacking',
  name: 'Stacking',
  description: 'Static layout with no animation. Sections stack vertically without scroll-driven effects.',
  provides: [],
  triggers: [],
  defaults: {
    section: 'none',
  },
  createStore: () =>
    createStore<ExperienceState>(() => ({
      scrollProgress: 0,
      viewportHeight: 0,
      isScrolling: false,
      prefersReducedMotion: false,
      sectionVisibilities: {},
      cursorX: 0,
      cursorY: 0,
    })),
}
