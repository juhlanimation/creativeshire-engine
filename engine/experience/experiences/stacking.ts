/**
 * Stacking experience - barebone fallback.
 * No animations. Sections stack vertically.
 */

import { createStore } from 'zustand'
import type { Experience, ExperienceState } from './types'
import { registerExperience } from './registry'

export const stackingExperience: Experience = {
  id: 'stacking',
  name: 'Simple Stack',
  description: 'No animations. Sections stack vertically.',

  provides: [],
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
  triggers: [],

  behaviourDefaults: {
    section: 'none',
  },
}

// Auto-register on module load
registerExperience(stackingExperience)
