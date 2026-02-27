/**
 * Simple experience - barebone fallback.
 * No animations. Sections stack vertically. For testing layout.
 */

import type { ExperienceComposition } from '../types'

export const simpleComposition: ExperienceComposition = {
  id: 'simple',
  name: 'Simple',
  description: 'No animations. Sections stack vertically. For testing layout.',
  icon: 'layout',
  tags: ['simple', 'static', 'testing'],
  category: 'simple',

  sectionBehaviours: {},

  // Bare mode: ignore ALL behaviours including schema-level ones
  bareMode: true,
}

