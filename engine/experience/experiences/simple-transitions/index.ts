/**
 * Simple with transitions experience.
 * Basic layout with page fade transitions enabled.
 * For testing multi-page navigation and transitions.
 */

import { createStore } from 'zustand'
import type { Experience, ExperienceState } from '../types'
import { registerExperience } from '../registry'

export const simpleTransitionsExperience: Experience = {
  id: 'simple-transitions',
  name: 'Simple + Transitions',
  description: 'Simple layout with page fade transitions. For testing multi-page navigation.',
  icon: 'transition',
  tags: ['simple', 'transitions', 'fade', 'multi-page'],
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

  // Page transitions: fade out/in when navigating
  pageTransition: {
    defaultExitDuration: 600,
    defaultEntryDuration: 600,
    timeout: 2000,
    respectReducedMotion: true,
  },
}

// Auto-register on module load
registerExperience(simpleTransitionsExperience)
