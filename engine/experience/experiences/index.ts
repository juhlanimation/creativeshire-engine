/**
 * Experiences - defines how sites behave and present content.
 *
 * An experience combines:
 * - Presentation model (stacking, slideshow, parallax, horizontal)
 * - Navigation configuration (wheel, keyboard, swipe)
 * - Behaviour defaults for sections/widgets
 * - Chrome (indicators, navigation UI)
 * - Page transitions
 */

// Context provider
export { ExperienceProvider, useExperience } from './ExperienceProvider'

// Registry
export {
  registerExperience,
  getExperience,
  getExperienceIds,
  getAllExperiences,
} from './registry'

// Built-in experiences (auto-register on import)
export { stackingExperience } from './stacking'
export { cinematicPortfolioExperience } from './cinematic-portfolio'
export { slideshowExperience } from './slideshow'

// Presentation wrapper (applies experience presentation config)
export { PresentationWrapper } from './PresentationWrapper'
export type { PresentationWrapperProps } from './PresentationWrapper'

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
