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
// Trigger-based behaviours
// ============================================

// Scroll-based triggers
import './scroll'

// Hover-based triggers
import './hover'

// Visibility-based triggers (IntersectionObserver)
import './visibility'

// Animation triggers (continuous/looping)
import './animation'

// Interaction triggers (click/tap toggle)
import './interaction'

// Video-based triggers (playback state, frame timing)
import './video'

// Intro sequence triggers (phase-based reveals)
import './intro'

// ============================================
// Types
// ============================================
export type { Behaviour, BehaviourMeta, BehaviourCategory } from './types'

// ============================================
// Registry
// ============================================
export {
  behaviourRegistry,
  registerBehaviour,
  unregisterBehaviour,
  getBehaviour,
  getBehaviourIds,
  getAllBehaviourMetas,
  getBehavioursByCategory,
  defineBehaviourMeta,
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
export { ComposedBehaviourWrapper } from './ComposedBehaviourWrapper'

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
  scrollReveal,
  scrollCoverProgress,
  scrollCollapse,
  scrollGlass,
} from './scroll'

// Hover behaviours
export { hoverReveal, hoverScale, hoverExpand } from './hover'

// Visibility behaviours
export { visibilityFadeIn, visibilityCenter } from './visibility'

// Animation behaviours
export { animationMarquee } from './animation'

// Interaction behaviours
export { interactionToggle } from './interaction'

// Video behaviours
export { videoFrame } from './video'

// Intro behaviours
export {
  introContentReveal,
  introTextReveal,
  introChromeReveal,
  introScrollIndicator,
} from './intro'
