/**
 * Test multipage preset site-level configuration.
 * Experience configuration with page transitions enabled.
 */

import type { PresetExperienceConfig } from '../types'

/**
 * Experience configuration for test-multipage preset.
 * Uses simple-transitions experience for page fade transitions.
 */
export const experienceConfig: PresetExperienceConfig = {
  id: 'simple-transitions',
}

/**
 * Page transition configuration.
 * Applied via experience.pageTransition when rendered.
 */
export const pageTransitionConfig = {
  defaultExitDuration: 300,
  defaultEntryDuration: 300,
  timeout: 2000,
  respectReducedMotion: true,
}
