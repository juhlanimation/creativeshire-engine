/**
 * Cinematic Portfolio experience metadata.
 * Loaded eagerly for UI listings without loading full experience.
 */

import { defineCompositionMeta } from '../registry'

export const meta = defineCompositionMeta({
  id: 'cinematic-portfolio',
  name: 'Cinematic Portfolio',
  description:
    'Scroll-driven portfolio with color-shifting hero, fade-in sections, and hover interactions.',
  icon: 'film',
  tags: ['portfolio', 'cinematic', 'scroll-driven', 'hover', 'parallax'],
  category: 'scroll-driven',
})
