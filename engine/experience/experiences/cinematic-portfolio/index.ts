/**
 * Cinematic Portfolio experience.
 * Scroll-driven portfolio with color-shifting hero, fade-in sections, and hover interactions.
 * This experience captures exactly what the noir preset does.
 */

import type { Experience } from '../types'

export const cinematicPortfolioExperience: Experience = {
  id: 'cinematic-portfolio',
  name: 'Cinematic Portfolio',
  description:
    'Scroll-driven portfolio with color-shifting hero, fade-in sections, and hover interactions.',
  icon: 'film',
  tags: ['portfolio', 'cinematic', 'scroll-driven', 'hover', 'parallax'],
  category: 'scroll-driven',

  sectionBehaviours: {
    About: [{ behaviour: 'scroll/fade' }],
  },
}

