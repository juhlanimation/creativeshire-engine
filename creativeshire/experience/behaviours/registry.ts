/**
 * Behaviour registry.
 * Empty initially - behaviours are registered by feature modules.
 */

import type { Behaviour, BehaviourRegistry } from './types'

/**
 * Global behaviour registry.
 * Behaviours register themselves here on module load.
 */
export const behaviourRegistry: BehaviourRegistry = {}

/**
 * Register a behaviour in the global registry.
 * Idempotent - registering the same ID twice overwrites.
 *
 * @param behaviour - The behaviour to register
 */
export function registerBehaviour(behaviour: Behaviour): void {
  behaviourRegistry[behaviour.id] = behaviour
}

/**
 * Unregister a behaviour from the registry.
 * No-op if behaviour doesn't exist.
 *
 * @param behaviourId - The behaviour ID to remove
 */
export function unregisterBehaviour(behaviourId: string): void {
  delete behaviourRegistry[behaviourId]
}
