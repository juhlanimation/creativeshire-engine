/**
 * Cinematic Portfolio experience.
 * Scroll-driven portfolio with color-shifting hero, fade-in sections, and hover interactions.
 * This experience captures exactly what the bojuhl preset does.
 */

import type { Experience } from '../types'
import { meta } from './meta'

export const cinematicPortfolioExperience: Experience = {
  id: 'cinematic-portfolio',
  settings: meta.settings,
  name: 'Cinematic Portfolio',
  description:
    'Scroll-driven portfolio with color-shifting hero, fade-in sections, and hover interactions.',
  icon: 'film',
  tags: ['portfolio', 'cinematic', 'scroll-driven', 'hover', 'parallax'],
  category: 'scroll-driven',

  sectionInjections: {
    About: { behaviour: 'scroll/fade' },
  },

  widgetBehaviourDefaults: {
    HeroTitle: 'scroll/color-shift',
    ScrollIndicator: 'scroll/progress',
    VideoThumbnail: 'hover/scale',
    ProjectCard: 'hover/scale',
    LogoMarquee: 'animation/marquee',
    FloatingContact: 'hover/reveal',
  },
}

