/**
 * Infinite Carousel experience metadata.
 * Loaded eagerly for UI listings without loading full experience.
 */

import { defineExperienceMeta } from '../registry'

export const meta = defineExperienceMeta({
  id: 'infinite-carousel',
  name: 'Infinite Carousel',
  description: 'Vertical infinite scroll with momentum physics and snap-to-section.',
  icon: 'scroll',
  tags: ['carousel', 'infinite', 'momentum', 'physics', 'scroll'],
  category: 'physics',
})
