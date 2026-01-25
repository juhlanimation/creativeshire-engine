/**
 * Behaviours barrel export.
 */

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
