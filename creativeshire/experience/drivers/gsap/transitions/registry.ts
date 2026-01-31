/**
 * Transition registry.
 * Transitions register themselves here on module load.
 *
 * Pattern matches behaviour registry (experience/behaviours/registry.ts).
 */

import type { Transition, TransitionRegistry } from './types'

/**
 * Global transition registry.
 * Transitions register themselves here on module load.
 */
export const transitionRegistry: TransitionRegistry = {}

/**
 * Register a transition in the global registry.
 * Idempotent - registering the same ID twice overwrites.
 *
 * @param transition - The transition to register
 */
export function registerTransition(transition: Transition): void {
  transitionRegistry[transition.id] = transition
}

/**
 * Unregister a transition from the registry.
 * No-op if transition doesn't exist.
 *
 * @param transitionId - The transition ID to remove
 */
export function unregisterTransition(transitionId: string): void {
  delete transitionRegistry[transitionId]
}
