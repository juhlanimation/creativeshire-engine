/**
 * Experience layer barrel export.
 *
 * Experiences control how sites behave and present content:
 * - Presentation model (stacking, slideshow, parallax, horizontal)
 * - Navigation (wheel, keyboard, swipe)
 * - Behaviours and effects
 * - Page transitions
 */

// Experiences (context, registry, definitions)
export {
  ExperienceProvider,
  useExperience,
  getExperience,
  getExperienceIds,
  getAllExperiences,
  registerExperience,
  stackingExperience,
  cinematicPortfolioExperience,
  slideshowExperience,
  PresentationWrapper,
} from './experiences'
export type {
  Experience,
  ExperienceContextValue,
  ExperienceProviderProps,
  PresentationModel,
  PresentationConfig,
  PresentationWrapperProps,
  NavigationInput,
  NavigationInputConfig,
  NavigationConfig,
  PageTransitionConfig,
  TransitionTask,
  ExperienceActions,
  PageWrapper,
  ExperienceChrome,
  ExperienceConstraints,
} from './experiences'

// Triggers (write browser events to store)
export {
  TriggerInitializer,
  useScrollProgress,
  useIntersection,
  usePrefersReducedMotion,
  useViewport,
  useCursorPosition,
} from './triggers'
export type { TriggerConfig, TriggerProps, TriggerInitializerProps } from './triggers'

// Drivers (apply CSS vars at 60fps, bypass React)
export {
  SmoothScrollProvider,
  useSmoothScroll,
  useSmoothScrollContainer,
  ScrollDriver,
  useScrollFadeDriver,
  RevealTransition,
  useGsapReveal,
} from './drivers'
export type {
  UseScrollFadeDriverOptions,
  DriverConfig,
  ElementDriverProps,
  RevealType,
  UseGsapRevealOptions,
  RevealTransitionProps,
  SmoothScrollContainerConfig,
  SmoothScrollContainerReturn,
  BoundaryDirection,
} from './drivers'

// Navigation (page transitions, section navigation)
export {
  TransitionProvider,
  useTransition,
  useTransitionPhase,
  useTransitionOptional,
  useExitTask,
  useEntryTask,
  TransitionStack,
  executeStack,
  createTask,
  NavigationInitializer,
} from './navigation'
export type {
  TransitionContextValue,
  TransitionPhase,
  TransitionProviderProps,
  UseExitTaskOptions,
  UseEntryTaskOptions,
} from './navigation'

// Lifecycle (section-level pause/resume for navigable experiences)
export { SectionLifecycleProvider, useSectionLifecycle } from './lifecycle'
export type {
  SectionLifecycleContextValue,
  SectionLifecycleProviderProps,
} from './lifecycle'

// Legacy type exports for backward compatibility
export type {
  ExperienceState,
  ExperienceTriggerConfig,
  BehaviourDefaults,
  Mode,
} from './types'
