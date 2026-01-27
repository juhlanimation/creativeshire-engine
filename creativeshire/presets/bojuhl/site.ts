/**
 * Bojuhl preset site-level defaults.
 * Experience mode and behaviour mappings.
 */

import type { PresetExperienceConfig } from '../types'

/**
 * Experience configuration for Bojuhl preset.
 * Uses stacking mode with scroll-based behaviours.
 */
export const experienceConfig: PresetExperienceConfig = {
  mode: 'stacking',
}

/**
 * Default behaviour mappings by widget type.
 */
export const behaviourDefaults: Record<string, string> = {
  HeroTitle: 'hero-text-color-transition',
  ScrollIndicator: 'scroll-indicator-fade',
  VideoThumbnail: 'project-card-hover',
  ProjectCard: 'project-card-hover',
  LogoMarquee: 'logo-marquee-animation',
}
