/**
 * Effect primitive registry.
 * Effects register themselves here on module load.
 *
 * Pattern matches behaviour registry (experience/behaviours/registry.ts).
 */

import type { EffectPrimitive, EffectRegistry } from './types'

/**
 * Global effect registry.
 * Effects register themselves here on module load.
 */
export const effectRegistry: EffectRegistry = {}

/**
 * Register an effect primitive in the global registry.
 * Idempotent — registering the same ID twice overwrites.
 */
export function registerEffect(effect: EffectPrimitive): void {
  effectRegistry[effect.id] = effect
}

/**
 * Unregister an effect from the registry.
 * No-op if effect doesn't exist.
 */
export function unregisterEffect(effectId: string): void {
  delete effectRegistry[effectId]
}

/**
 * Resolve an effect ID to its definition.
 * Returns null for 'none', undefined, or unregistered effects.
 */
export function resolveEffect(
  effectId: string | null | undefined
): EffectPrimitive | null {
  if (!effectId || effectId === 'none') {
    return null
  }

  return effectRegistry[effectId] ?? null
}

/**
 * Get all registered effect IDs.
 */
export function getEffectIds(): string[] {
  return Object.keys(effectRegistry)
}

/**
 * Get all registered effects.
 */
export function getAllEffects(): EffectPrimitive[] {
  return Object.values(effectRegistry)
}
