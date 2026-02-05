/**
 * Simple experience - barebone fallback.
 * No animations. Sections stack vertically. For testing layout.
 */

import { createStore } from 'zustand'
import type { Experience, ExperienceState } from '../types'
import { registerExperience } from '../registry'

export const simpleExperience: Experience = {
  id: 'simple',
  name: 'Simple',
  description: 'No animations. Sections stack vertically. For testing layout.',
  icon: 'layout',
  tags: ['simple', 'static', 'testing'],
  category: 'simple',

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

  // Bare mode: ignore ALL behaviours including schema-level ones
  bareMode: true,
}

// Auto-register on module load
registerExperience(simpleExperience)
