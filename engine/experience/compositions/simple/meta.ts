/**
 * Simple experience metadata.
 * Loaded eagerly for UI listings without loading full experience.
 */

import { defineCompositionMeta } from '../registry'

export const meta = defineCompositionMeta({
  id: 'simple',
  name: 'Simple',
  description: 'No animations. Sections stack vertically. For testing layout.',
  icon: 'layout',
  tags: ['simple', 'static', 'testing'],
  category: 'simple',
  // No settings - this is a bare-bones fallback experience
})
