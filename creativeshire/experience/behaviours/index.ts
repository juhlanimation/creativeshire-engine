/**
 * Behaviours barrel export.
 */

// Auto-register behaviours by importing them
import './contact-reveal'
import './scroll-fade'
import './scroll-fade-out'
import './modal'
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
