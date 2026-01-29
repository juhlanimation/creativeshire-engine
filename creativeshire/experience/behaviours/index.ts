/**
 * Behaviours barrel export.
 *
 * IMPORTANT: All behaviour folders must be imported here for auto-registration.
 * Behaviours call registerBehaviour() on import, so missing imports = broken behaviours.
 *
 * NAMING CONVENTION: Behaviours are named by TRIGGER (scroll, hover, visibility),
 * NOT by effect (fade, scale) or widget (project-card, contact).
 */

// ============================================
// Trigger-based behaviours (NEW structure)
// ============================================

// Scroll-based triggers
import './scroll'

// Hover-based triggers
import './hover'

// Visibility-based triggers (IntersectionObserver)
import './visibility'

// Animation triggers (continuous/looping)
import './animation'

// ============================================
// Specialized behaviours (keep as-is)
// ============================================

// Reveal patterns (well-structured)
import './reveal'

// ============================================
// Types
// ============================================
export type { Behaviour, BehaviourRegistry } from './types'

// ============================================
// Registry
// ============================================
export {
  behaviourRegistry,
  registerBehaviour,
  unregisterBehaviour,
} from './registry'

// ============================================
// Resolution
// ============================================
export { resolveBehaviour, resolveBehavioursWithDependencies } from './resolve'

// ============================================
// Components
// ============================================
export { BehaviourWrapper } from './BehaviourWrapper'
export type { BehaviourWrapperProps } from './BehaviourWrapper'

// ============================================
// Re-exports for explicit imports
// ============================================

// Scroll behaviours (for 60fps driver, use useScrollFadeDriver from drivers/)
export {
  scrollFade,
  scrollFadeOut,
  scrollProgress,
  scrollColorShift,
  scrollImageCycle,
} from './scroll'

// Hover behaviours
export { hoverReveal, hoverScale, hoverExpand } from './hover'

// Visibility behaviours
export { visibilityFadeIn } from './visibility'

// Animation behaviours
export { animationMarquee } from './animation'
