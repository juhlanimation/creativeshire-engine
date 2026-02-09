/**
 * Intro patterns barrel export.
 * Patterns self-register eagerly via registerIntroPattern() in their index files.
 * Re-exports ensure modules load and registration runs.
 */

// Pattern metadata (lightweight, always loaded)
import { meta as videoGateMeta } from './video-gate/meta'
import { meta as timedMeta } from './timed/meta'
import { meta as scrollRevealMeta } from './scroll-reveal/meta'
import { meta as sequenceTimedMeta } from './sequence-timed/meta'

// Re-export metas for direct access
export { videoGateMeta, timedMeta, scrollRevealMeta, sequenceTimedMeta }

// Eagerly import and re-export patterns (triggers self-registration)
export { videoGatePattern } from './video-gate'
export { timedPattern } from './timed'
export { scrollRevealPattern } from './scroll-reveal'
export { sequenceTimedPattern } from './sequence-timed'

/**
 * Ensure all patterns are registered.
 * Call this at app startup to guarantee registration.
 */
export function ensureIntroPatternsRegistered(): void {
  // Eager registrations already ran on import above.
  // This function exists so bundlers don't tree-shake them.
}
