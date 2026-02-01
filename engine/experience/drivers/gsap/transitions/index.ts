/**
 * Transitions barrel export.
 *
 * IMPORTANT: All transition files must be imported here for auto-registration.
 * Transitions call registerTransition() on import, so missing imports = unregistered transitions.
 */

// ============================================
// Transition implementations (auto-register on import)
// ============================================
import './wipe-left'
import './wipe-right'
import './expand'
import './fade'

// ============================================
// Types
// ============================================
export type {
  Transition,
  TransitionRegistry,
  TransitionContext,
  TransitionOptions,
  TransitionCssConfig,
} from './types'

// ============================================
// Registry
// ============================================
export {
  transitionRegistry,
  registerTransition,
  unregisterTransition,
} from './registry'

// ============================================
// Resolution
// ============================================
export { resolveTransition, getTransitionIds } from './resolve'

// ============================================
// Re-exports for explicit imports (optional)
// ============================================
export { default as wipeLeft } from './wipe-left'
export { default as wipeRight } from './wipe-right'
export { default as expand } from './expand'
export { default as fade } from './fade'
