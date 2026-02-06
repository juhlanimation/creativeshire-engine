/**
 * Experience layer barrel export.
 *
 * Experiences control how sites behave and present content:
 * - Presentation model (stacking, slideshow, parallax, horizontal)
 * - Navigation (wheel, keyboard, swipe)
 * - Behaviours and effects
 */

// Experiences (context, registry, definitions)
export {
  ExperienceProvider,
  useExperience,
  getExperience,
  getExperienceAsync,
  preloadExperience,
  getExperienceIds,
  getAllExperiences,
  getAllExperienceMetas,
  registerExperience,
  registerLazyExperience,
  ensureExperiencesRegistered,
  simpleExperience,
  cinematicPortfolioExperience,
  slideshowExperience,
  infiniteCarouselExperience,
  PresentationWrapper,
  InfiniteCarouselController,
} from './experiences'
export type { ExperienceMeta } from './experiences'
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
  MomentumDriver,
  useScrollFadeDriver,
  RevealTransition,
  useGsapReveal,
} from './drivers'
export type {
  UseScrollFadeDriverOptions,
  DriverConfig,
  ElementDriverProps,
  MomentumDriverConfig,
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

// Page transitions (registry, definitions)
export {
  getPageTransition,
  getPageTransitionAsync,
  getAllPageTransitionMetas,
  getPageTransitionIds,
  registerPageTransition,
  registerLazyPageTransition,
  ensurePageTransitionsRegistered,
  fadePageTransition,
} from './transitions'
export type { PageTransition, PageTransitionMeta, PageTransitionCategory } from './transitions'

// State types
export type {
  ExperienceState,
  NavigableExperienceState,
  InfiniteCarouselState,
  NavigationState,
  ExperienceTriggerConfig,
  BehaviourDefaults,
} from './types'
