/**
 * Mode registry for the Experience layer.
 * Provides lookup and registration of experience modes.
 */

import type { Mode } from './types'

/** Registry of available modes by ID */
const modes = new Map<string, Mode>()

/**
 * Register a mode in the registry.
 * @param mode - Mode to register
 */
export function registerMode(mode: Mode): void {
  modes.set(mode.id, mode)
}

/**
 * Get a mode by ID.
 * @param id - Mode identifier
 * @returns Mode if found, undefined otherwise
 */
export function getMode(id: string): Mode | undefined {
  return modes.get(id)
}

/**
 * Get all registered mode IDs.
 * @returns Array of registered mode IDs
 */
export function getModeIds(): string[] {
  return Array.from(modes.keys())
}
