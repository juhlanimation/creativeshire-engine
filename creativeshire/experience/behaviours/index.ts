/**
 * Behaviours barrel export.
 *
 * IMPORTANT: All behaviour folders must be imported here for auto-registration.
 * Behaviours call registerBehaviour() on import, so missing imports = broken behaviours.
 */

// Auto-register behaviours by importing them
// Scroll-based triggers
import './scroll-fade'
import './scroll-fade-out'
import './scroll-background-slideshow'
import './scroll-indicator-fade'

// Hover-based triggers
import './hover-reveal'
import './contact-reveal'
import './floating-contact-cta'
import './project-card-hover'
import './gallery-thumbnail-expand'

// Visibility-based triggers
import './fade-in'

// Animation triggers
import './logo-marquee-animation'
import './hero-text-color-transition'

// Modal transitions
import './modal'
import './video-modal'

// Reveal patterns
import './reveal'

// Types
export type { Behaviour, BehaviourRegistry } from './types'

// Registry
export {
  behaviourRegistry,
  registerBehaviour,
  unregisterBehaviour,
} from './registry'

// Resolution
export { resolveBehaviour, resolveBehavioursWithDependencies } from './resolve'

// Components
export { BehaviourWrapper } from './BehaviourWrapper'
export type { BehaviourWrapperProps } from './BehaviourWrapper'
