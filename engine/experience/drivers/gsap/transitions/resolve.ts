/**
 * Transition resolution.
 * Looks up transitions by ID from the registry.
 */

import { transitionRegistry } from './registry'
import type { Transition } from './types'

/**
 * Resolve a transition ID to its definition.
 * Returns null for 'none', undefined, or unregistered transitions.
 *
 * @param transitionId - The transition ID to resolve (e.g., 'wipe-left', 'expand')
 * @returns The transition definition or null if not found
 */
export function resolveTransition(
  transitionId: string | null | undefined
): Transition | null {
  if (!transitionId || transitionId === 'none') {
    return null
  }

  return transitionRegistry[transitionId] ?? null
}

/**
 * Get all registered transition IDs.
 * Useful for UI components that need to list available transitions.
 *
 * @returns Array of registered transition IDs
 */
export function getTransitionIds(): string[] {
  return Object.keys(transitionRegistry)
}
