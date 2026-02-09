/**
 * Behaviour resolution.
 * Resolves behaviour IDs to behaviour definitions from registry.
 *
 * Behaviour naming: by TRIGGER (scroll/fade, hover/reveal, visibility/fade-in)
 * NOT by effect or widget name.
 */

import { getBehaviour } from './registry'
import type { Behaviour } from './types'

/**
 * Resolve a behaviour ID to its definition.
 * Returns null for 'none', undefined, or unregistered behaviours.
 *
 * @param behaviourId - The behaviour ID to resolve (e.g., 'scroll/fade', 'hover/reveal')
 * @returns The behaviour definition or null if not found
 */
export function resolveBehaviour(
  behaviourId: string | null | undefined
): Behaviour | null {
  if (!behaviourId || behaviourId === 'none') {
    return null
  }

  return getBehaviour(behaviourId) ?? null
}

/**
 * Resolve multiple behaviour IDs including their dependencies.
 * Returns behaviours in dependency order (dependencies first).
 *
 * @param behaviourIds - The behaviour IDs to resolve
 * @returns Ordered array of behaviours with dependencies resolved
 */
export function resolveBehavioursWithDependencies(
  behaviourIds: (string | null | undefined)[]
): Behaviour[] {
  const resolved: Behaviour[] = []
  const seen = new Set<string>()

  function resolve(id: string): void {
    if (seen.has(id)) return
    seen.add(id)

    const behaviour = resolveBehaviour(id)
    if (!behaviour) return

    // Resolve dependencies first
    if (behaviour.requires) {
      for (const depId of behaviour.requires) {
        resolve(depId)
      }
    }

    resolved.push(behaviour)
  }

  for (const id of behaviourIds) {
    if (id) resolve(id)
  }

  return resolved
}
