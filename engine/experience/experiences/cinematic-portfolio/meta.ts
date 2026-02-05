/**
 * Cinematic Portfolio experience metadata.
 * Loaded eagerly for UI listings without loading full experience.
 */

import { defineExperienceMeta } from '../registry'

/**
 * Configurable settings for the Cinematic Portfolio experience.
 */
interface CinematicPortfolioSettings {
  enableColorShift: boolean
  enableSectionFade: boolean
  enableHoverEffects: boolean
  enableCursorTracking: boolean
}

export const meta = defineExperienceMeta<CinematicPortfolioSettings>({
  id: 'cinematic-portfolio',
  name: 'Cinematic Portfolio',
  description:
    'Scroll-driven portfolio with color-shifting hero, fade-in sections, and hover interactions.',
  icon: 'film',
  tags: ['portfolio', 'cinematic', 'scroll-driven', 'hover', 'parallax'],
  category: 'scroll-driven',
  settings: {
    enableColorShift: {
      type: 'toggle',
      label: 'Color Shift Effect',
      description: 'Enable hero color shifting on scroll',
      default: true,
      group: 'Effects',
    },
    enableSectionFade: {
      type: 'toggle',
      label: 'Section Fade-In',
      description: 'Enable sections fading in as they enter viewport',
      default: true,
      group: 'Effects',
    },
    enableHoverEffects: {
      type: 'toggle',
      label: 'Hover Effects',
      description: 'Enable scale and reveal effects on hover',
      default: true,
      group: 'Effects',
    },
    enableCursorTracking: {
      type: 'toggle',
      label: 'Cursor Tracking',
      description: 'Enable cursor position tracking for effects',
      default: true,
      group: 'Effects',
    },
  },
})
