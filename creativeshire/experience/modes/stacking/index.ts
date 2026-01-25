/**
 * Stacking mode - static layout with no animation.
 * Sections stack vertically without scroll-driven effects.
 */

import { createStore } from 'zustand'
import type { Mode, ExperienceState } from '../types'

/**
 * Stacking mode configuration.
 * Provides no animation defaults - sections render as static stack.
 */
export const stackingMode: Mode = {
  id: 'stacking',
  defaults: {
    section: 'none',
    widget: 'none',
  },
  createStore: () =>
    createStore<ExperienceState>(() => ({
      scrollProgress: 0,
      viewportHeight: 0,
      isScrolling: false,
    })),
}
