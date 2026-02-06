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
} from './registry'

// Types
export type { PageTransition, PageTransitionMeta, PageTransitionCategory } from './types'

// Transition metadata (lightweight, always loaded)
import { meta as fadeMeta } from './fade/meta'

// Re-export metas for direct access
export { fadeMeta }

// Lazy registration with dynamic imports
import { registerLazyPageTransition } from './registry'

registerLazyPageTransition(fadeMeta, () =>
  import('./fade').then((m) => m.fadePageTransition)
)

// Direct export for eager loading when needed
export { fadePageTransition } from './fade'

/**
 * Ensures all page transitions are registered.
 * Call at engine entry point to guarantee registration before lookups.
 */
export function ensurePageTransitionsRegistered(): void {
  // Lazy registrations already ran on import above.
  // This function exists so bundlers don't tree-shake them.
}
