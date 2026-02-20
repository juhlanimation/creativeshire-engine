/**
 * Slideshow experience metadata.
 * Loaded eagerly for UI listings without loading full experience.
 */

import { defineExperienceMeta } from '../registry'

export const meta = defineExperienceMeta({
  id: 'slideshow',
  name: 'Slideshow',
  description: 'Full-screen slides with navigation. Sections become slides.',
  icon: 'presentation',
  tags: ['slides', 'fullscreen', 'navigation', 'presentation'],
  category: 'presentation',
})
