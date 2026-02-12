/**
 * Cover Scroll experience metadata.
 * Loaded eagerly for UI listings without loading full experience.
 */

import { defineExperienceMeta } from '../registry'

export const meta = defineExperienceMeta({
  id: 'cover-scroll',
  name: 'Cover Scroll',
  description:
    'Pinned sections stick at the viewport top while remaining sections scroll over them. Mark any section as pinned for the cover effect.',
  icon: 'layers',
  tags: ['scroll-driven', 'cover', 'hero', 'backdrop'],
  category: 'scroll-driven',
})
