/**
 * Behaviour registry.
 * Empty initially - behaviours are registered by feature modules.
 */

import type { Behaviour, BehaviourMeta, BehaviourCategory } from './types'

/**
 * Global behaviour registry.
 * Behaviours register themselves here on module load.
 */
const registry = new Map<string, Behaviour>()

/**
 * Register a behaviour in the global registry.
 * Idempotent - registering the same ID twice overwrites.
 *
 * @param behaviour - The behaviour to register
 */
export function registerBehaviour(behaviour: Behaviour): void {
  registry.set(behaviour.id, behaviour)
}

/**
 * Unregister a behaviour from the registry.
 * No-op if behaviour doesn't exist.
 *
 * @param behaviourId - The behaviour ID to remove
 */
export function unregisterBehaviour(behaviourId: string): void {
  registry.delete(behaviourId)
}

/**
 * Get a behaviour by ID.
 */
export function getBehaviour(id: string): Behaviour | undefined {
  return registry.get(id)
}

/**
 * Get all registered behaviour IDs.
 */
export function getBehaviourIds(): string[] {
  return Array.from(registry.keys())
}

/**
 * Get all behaviour metadata (without needing to know internals).
 */
export function getAllBehaviourMetas(): BehaviourMeta[] {
  return Array.from(registry.values())
    .filter((b): b is Behaviour & { name: string; description: string; category: BehaviourCategory } =>
      !!b.name && !!b.description && !!b.category
    )
    .map((b) => ({
      id: b.id,
      name: b.name,
      description: b.description,
      ...(b.icon && { icon: b.icon }),
      ...(b.tags && { tags: b.tags }),
      category: b.category,
      ...(b.settings && { settings: b.settings }),
    }))
}

/**
 * Get behaviours filtered by category.
 */
export function getBehavioursByCategory(category: BehaviourCategory): Behaviour[] {
  return Array.from(registry.values()).filter((b) => b.category === category)
}

/**
 * Helper function for defining type-safe behaviour metadata.
 */
export function defineBehaviourMeta<T>(meta: BehaviourMeta<T>): BehaviourMeta<T> {
  return meta
}

/**
 * @deprecated Use getBehaviour() instead. Exposed for backward compatibility with tests.
 */
export const behaviourRegistry: Record<string, Behaviour> = new Proxy(
  {} as Record<string, Behaviour>,
  {
    get(_target, prop: string) {
      return registry.get(prop)
    },
    has(_target, prop: string) {
      return registry.has(prop)
    },
    ownKeys() {
      return Array.from(registry.keys())
    },
    getOwnPropertyDescriptor(_target, prop: string) {
      const value = registry.get(prop)
      if (value) {
        return { value, configurable: true, enumerable: true, writable: true }
      }
      return undefined
    },
  }
)
