/**
 * Experiences - defines how sites behave and present content.
 *
 * An experience combines:
 * - Presentation model (stacking, slideshow, parallax, horizontal)
 * - Navigation configuration (wheel, keyboard, swipe)
 * - Behaviour defaults for sections/widgets
 * - Chrome (indicators, navigation UI)
 *
 * Experiences are registered lazily - metadata loads immediately,
 * full experience code loads on first use.
 */

// Context provider
export { ExperienceProvider, useExperience } from './ExperienceProvider'

// Registry (with lazy loading support)
export {
  registerExperience,
  registerLazyExperience,
  getExperience,
  getExperienceAsync,
  preloadExperience,
  getExperienceIds,
  getAllExperiences,
  getAllExperienceMetas,
  type ExperienceMeta,
} from './registry'

// Experience metadata (lightweight, always loaded)
import { meta as simpleMeta } from './simple/meta'
import { meta as cinematicPortfolioMeta } from './cinematic-portfolio/meta'
import { meta as slideshowMeta } from './slideshow/meta'
import { meta as infiniteCarouselMeta } from './infinite-carousel/meta'

// Re-export metas for direct access
export { simpleMeta, cinematicPortfolioMeta, slideshowMeta, infiniteCarouselMeta }

// Lazy registration with dynamic imports
import { registerLazyExperience } from './registry'

registerLazyExperience(simpleMeta, () =>
  import('./simple').then((m) => m.simpleExperience)
)
registerLazyExperience(cinematicPortfolioMeta, () =>
  import('./cinematic-portfolio').then((m) => m.cinematicPortfolioExperience)
)
registerLazyExperience(slideshowMeta, () =>
  import('./slideshow').then((m) => m.slideshowExperience)
)
registerLazyExperience(infiniteCarouselMeta, () =>
  import('./infinite-carousel').then((m) => m.infiniteCarouselExperience)
)

// Direct exports (eagerly imports the experience)
// Use getExperienceAsync() for lazy loading in new code
export { simpleExperience } from './simple'
export { cinematicPortfolioExperience } from './cinematic-portfolio'
export { slideshowExperience } from './slideshow'
export { infiniteCarouselExperience } from './infinite-carousel'

/**
 * Ensures all experiences are registered.
 * Call at engine entry point to guarantee registration before lookups.
 * Lazy registration happens on module load, this function prevents tree-shaking.
 */
export function ensureExperiencesRegistered(): void {
  // Lazy registrations already ran on import above.
  // This function exists so bundlers don't tree-shake them.
}

// Presentation wrapper (applies experience presentation config)
export { PresentationWrapper } from './PresentationWrapper'
export type { PresentationWrapperProps } from './PresentationWrapper'

// Infinite carousel controller (initializes MomentumDriver, positions sections)
export { InfiniteCarouselController } from './InfiniteCarouselController'

// Types
export type {
  Experience,
  ExperienceContextValue,
  ExperienceProviderProps,
  PresentationModel,
  PresentationConfig,
  NavigationInput,
  NavigationInputConfig,
  NavigationInputOptions,
  NavigationConfig,
  PageTransitionConfig,
  TransitionTask,
  ExperienceActions,
  PageWrapper,
  ExperienceChrome,
  ExperienceConstraints,
} from './types'
