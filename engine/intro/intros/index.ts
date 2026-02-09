/**
 * Compiled intro definitions barrel export.
 * Imports trigger registration at module level.
 */

import './cinematic-text-mask'

/**
 * Ensure all compiled intros are registered.
 * Call at engine entry point to guarantee registration before lookups.
 */
export function ensureIntrosRegistered(): void {
  // Registrations already ran on import above.
  // This function exists so bundlers don't tree-shake them.
}
