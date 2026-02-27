/**
 * Compositions - defines how sites behave and present content.
 *
 * A composition combines:
 * - Presentation model (stacking, slideshow, parallax, horizontal)
 * - Navigation configuration (wheel, keyboard, swipe)
 * - Behaviour defaults for sections/widgets
 * - Chrome (indicators, navigation UI)
 *
 * Compositions are registered lazily - metadata loads immediately,
 * full composition code loads on first use.
 */

// Context provider
export { ExperienceProvider, useExperience } from './ExperienceProvider'

// Registry (with lazy loading support)
export {
  registerComposition,
  registerLazyComposition,
  getComposition,
  getCompositionAsync,
  preloadComposition,
  getCompositionIds,
  getAllCompositions,
  getAllCompositionMetas,
  DEV_COMPOSITION_PARAM,
  getCompositionOverride,
  setCompositionOverride,
  defineCompositionMeta,
  type CompositionMeta,
  type CompositionCategory,
  // Deprecated aliases
  registerExperience,
  registerLazyExperience,
  getExperience,
  getExperienceAsync,
  preloadExperience,
  getExperienceIds,
  getAllExperiences,
  getAllExperienceMetas,
  DEV_EXPERIENCE_PARAM,
  getExperienceOverride,
  setExperienceOverride,
  defineExperienceMeta,
  type ExperienceMeta,
  type ExperienceCategory,
} from './registry'

// Composition metadata (lightweight, always loaded)
import { meta as simpleMeta } from './simple/meta'
import { meta as cinematicPortfolioMeta } from './cinematic-portfolio/meta'
import { meta as slideshowMeta } from './slideshow/meta'
import { meta as infiniteCarouselMeta } from './infinite-carousel/meta'
import { meta as coverScrollMeta } from './cover-scroll/meta'

// Re-export metas for direct access
export { simpleMeta, cinematicPortfolioMeta, slideshowMeta, infiniteCarouselMeta, coverScrollMeta }

// Lazy registration with dynamic imports
import { registerLazyComposition, registerComposition } from './registry'

registerLazyComposition(simpleMeta, () =>
  import('./simple').then((m) => m.simpleComposition)
)
registerLazyComposition(cinematicPortfolioMeta, () =>
  import('./cinematic-portfolio').then((m) => m.cinematicPortfolioComposition)
)
registerLazyComposition(slideshowMeta, () =>
  import('./slideshow').then((m) => m.slideshowComposition)
)
// infinite-carousel is eagerly registered below (same reason as cover-scroll)

// Direct exports (eagerly imports the composition)
// Use getCompositionAsync() for lazy loading in new code
export { simpleComposition } from './simple'
export { cinematicPortfolioComposition } from './cinematic-portfolio'
export { slideshowComposition } from './slideshow'
export { infiniteCarouselComposition } from './infinite-carousel'
export { coverScrollComposition } from './cover-scroll'

// Deprecated aliases for backward compatibility
export { simpleComposition as simpleExperience } from './simple'
export { cinematicPortfolioComposition as cinematicPortfolioExperience } from './cinematic-portfolio'
export { slideshowComposition as slideshowExperience } from './slideshow'
export { infiniteCarouselComposition as infiniteCarouselExperience } from './infinite-carousel'
export { coverScrollComposition as coverScrollExperience } from './cover-scroll'

// Eager registration for cover-scroll and infinite-carousel — must resolve synchronously
// via getComposition() because presets use them as default compositions. Lazy loading would
// cause a transient fallback to simpleComposition (bareMode: true), breaking intro triggers.
import { coverScrollComposition } from './cover-scroll'
import { infiniteCarouselComposition } from './infinite-carousel'
registerComposition(coverScrollComposition)
registerComposition(infiniteCarouselComposition)

/**
 * Ensures all compositions are registered.
 * Call at engine entry point to guarantee registration before lookups.
 * Lazy registration happens on module load, this function prevents tree-shaking.
 */
export function ensureCompositionsRegistered(): void {
  // Lazy registrations already ran on import above.
  // This function exists so bundlers don't tree-shake them.
}

/** @deprecated Use ensureCompositionsRegistered */
export const ensureExperiencesRegistered = ensureCompositionsRegistered

// Presentation wrapper (applies composition presentation config)
export { PresentationWrapper } from './PresentationWrapper'
export type { PresentationWrapperProps } from './PresentationWrapper'

// Infinite carousel controller (initializes MomentumDriver, positions sections)
export { InfiniteCarouselController } from './InfiniteCarouselController'

// Auto-derived store
export { createExperienceStore } from './createExperienceStore'

// Types
export type {
  Experience,
  ExperienceComposition,
  ExperienceContextValue,
  ExperienceProviderProps,
  BehaviourAssignment,
  PresentationModel,
  PresentationConfig,
  NavigationInput,
  NavigationInputConfig,
  NavigationInputOptions,
  NavigationConfig,
  PageTransitionConfig,
  TransitionTask,
  ExperienceActions,
  ExperienceChrome,
  ExperienceConstraints,
} from './types'
