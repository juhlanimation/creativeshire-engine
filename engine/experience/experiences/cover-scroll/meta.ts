/**
 * Cover Scroll experience metadata.
 * Loaded eagerly for UI listings without loading full experience.
 */

import { defineExperienceMeta } from '../registry'

export const meta = defineExperienceMeta({
  id: 'cover-scroll',
  name: 'Cover Scroll',
  description:
    'First section stays fixed as backdrop while remaining sections scroll over it. Ideal for video heroes with content overlay.',
  icon: 'layers',
  tags: ['scroll-driven', 'cover', 'hero', 'backdrop'],
  category: 'scroll-driven',
})
