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
 * Uses trigger-based behaviour names (scroll/, hover/, animation/).
 */
export const behaviourDefaults: Record<string, string> = {
  HeroTitle: 'scroll/color-shift',
  ScrollIndicator: 'scroll/progress',
  VideoThumbnail: 'hover/scale',
  ProjectCard: 'hover/scale',
  LogoMarquee: 'animation/marquee',
}
