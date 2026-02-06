/**
 * Intro patterns barrel export.
 * Registers all patterns lazily on import.
 */

import { registerLazyIntroPattern } from '../registry'

// Pattern metadata (lightweight, always loaded)
import { meta as videoGateMeta } from './video-gate/meta'
import { meta as timedMeta } from './timed/meta'
import { meta as scrollRevealMeta } from './scroll-reveal/meta'
import { meta as sequenceTimedMeta } from './sequence-timed/meta'

// Re-export metas for direct access
export { videoGateMeta, timedMeta, scrollRevealMeta, sequenceTimedMeta }

// Lazy registration with dynamic imports
registerLazyIntroPattern(videoGateMeta, () =>
  import('./video-gate').then((m) => m.videoGatePattern)
)
registerLazyIntroPattern(timedMeta, () =>
  import('./timed').then((m) => m.timedPattern)
)
registerLazyIntroPattern(scrollRevealMeta, () =>
  import('./scroll-reveal').then((m) => m.scrollRevealPattern)
)
registerLazyIntroPattern(sequenceTimedMeta, () =>
  import('./sequence-timed').then((m) => m.sequenceTimedPattern)
)

// Direct exports for backward compatibility (eagerly imports the pattern)
export { videoGatePattern } from './video-gate'
export { timedPattern } from './timed'
export { scrollRevealPattern } from './scroll-reveal'
export { sequenceTimedPattern } from './sequence-timed'

/**
 * Ensure all patterns are registered.
 * Call this at app startup to guarantee registration.
 */
export function ensureIntroPatternsRegistered(): void {
  // Lazy registrations already ran on import above.
  // This function exists so bundlers don't tree-shake them.
}
