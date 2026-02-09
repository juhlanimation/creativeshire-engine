/**
 * Page transitions barrel export.
 * Transitions control page exit/entry animations.
 *
 * Transitions are registered lazily - metadata loads immediately,
 * full transition code loads on first use.
 */

// Registry
export {
  definePageTransitionMeta,
  registerPageTransition,
  registerLazyPageTransition,
  getPageTransition,
  getPageTransitionAsync,
  preloadPageTransition,
  getAllPageTransitionMetas,
  getPageTransitionIds,
  registerTransitionConfig,
  getRegisteredTransitionConfig,
  getAllRegisteredTransitionMetas,
  getTransitionOverride,
  setTransitionOverride,
  DEV_TRANSITION_PARAM,
  findTransitionConfigIdBySchemaConfig,
} from './registry'
export type { TransitionConfigMeta } from './registry'

// Types
export type { PageTransition, PageTransitionMeta, PageTransitionCategory } from './types'

// Transition metadata (lightweight, always loaded)
import { meta as fadeMeta } from './fade/meta'

// Re-export metas for direct access
export { fadeMeta }

// Eager export — triggers registerPageTransition() in fade/index.ts
export { fadePageTransition } from './fade'

// Compiled transition configs
import { ensureTransitionConfigsRegistered } from './configs'
export { ensureTransitionConfigsRegistered }

/**
 * Ensures all page transitions are registered.
 * Call at engine entry point to guarantee registration before lookups.
 */
export function ensurePageTransitionsRegistered(): void {
  // Lazy registrations already ran on import above.
  // This function exists so bundlers don't tree-shake them.
  ensureTransitionConfigsRegistered()
}
