/**
 * Bojuhl preset site-level defaults.
 * Experience configuration.
 *
 * Behaviour defaults now live in the Experience definition:
 * @see engine/experience/experiences/cinematic-portfolio.ts
 */

import type { PresetExperienceConfig } from '../types'

/**
 * Experience configuration for Bojuhl preset.
 * Uses cinematic-portfolio experience with scroll-driven behaviours.
 */
export const experienceConfig: PresetExperienceConfig = {
  id: 'cinematic-portfolio',
}
