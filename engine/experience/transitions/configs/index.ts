/**
 * Compiled transition config definitions barrel export.
 * Imports trigger registration at module level.
 */

import './default-fade'

/**
 * Ensure all compiled transition configs are registered.
 * Call at engine entry point to guarantee registration before lookups.
 */
export function ensureTransitionConfigsRegistered(): void {
  // Registrations already ran on import above.
  // This function exists so bundlers don't tree-shake them.
}
