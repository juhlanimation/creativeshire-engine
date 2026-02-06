/**
 * Test multipage preset site-level configuration.
 * Transition configuration for page navigation.
 */

import type { TransitionConfig } from '../../schema/transition'

/**
 * Transition configuration for test-multipage preset.
 * Uses fade transition for page navigations.
 */
export const transitionConfig: TransitionConfig = {
  id: 'fade',
}
