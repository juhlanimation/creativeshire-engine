/**
 * Experience layer barrel export.
 *
 * Compositions control how sites behave and present content:
 * - Presentation model (stacking, slideshow, parallax, horizontal)
 * - Navigation (wheel, keyboard, swipe)
 * - Behaviours and effects
 */

// Compositions (context, registry, definitions)
export {
  ExperienceProvider,
  useExperience,
  // Canonical composition API
  getComposition,
  getCompositionAsync,
  preloadComposition,
  getCompositionIds,
  getAllCompositions,
  getAllCompositionMetas,
  registerComposition,
  registerLazyComposition,
  ensureCompositionsRegistered,
  simpleComposition,
  cinematicPortfolioComposition,
  slideshowComposition,
  infiniteCarouselComposition,
  coverScrollComposition,
  PresentationWrapper,
  InfiniteCarouselController,
  DEV_COMPOSITION_PARAM,
  getCompositionOverride,
  setCompositionOverride,
  // Deprecated aliases (kept for consumers)
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
  DEV_EXPERIENCE_PARAM,
  getExperienceOverride,
  setExperienceOverride,
} from './compositions'
export type { CompositionMeta, CompositionCategory } from './compositions'
/** @deprecated Use CompositionMeta */
export type { ExperienceMeta } from './compositions'
export type {
  Experience,
  ExperienceComposition,
  ExperienceContextValue,
  ExperienceProviderProps,
  BehaviourAssignment,
  PresentationModel,
  PresentationConfig,
  PresentationWrapperProps,
  NavigationInput,
  NavigationInputConfig,
  NavigationConfig,
  PageTransitionConfig,
  TransitionTask,
  ExperienceActions,
  ExperienceChrome,
  ExperienceConstraints,
} from './compositions'

export { createExperienceStore } from './compositions'

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
  ScrollLockProvider,
  useScrollLock,
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

// Timeline (discrete animation orchestration)
export { EffectTimeline, animateElement, prefersReducedMotion, createEffectTrack } from './timeline'
export type { Track, SequentialTrack, AnimateElementOptions } from './timeline'

// Effect primitives (shared across orchestrators)
export {
  effectRegistry,
  registerEffect,
  unregisterEffect,
  resolveEffect,
  getEffectIds,
  getAllEffects,
} from './timeline'
export type {
  EffectPrimitive,
  EffectRegistry,
  EffectContext,
  EffectOptions,
  GsapRealization,
  CssRealization,
} from './timeline'

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
  getTransitionOverride,
  setTransitionOverride,
  DEV_TRANSITION_PARAM,
  findTransitionConfigIdBySchemaConfig,
  getRegisteredTransitionConfig,
  getAllRegisteredTransitionMetas,
} from './transitions'
export type { PageTransition, PageTransitionMeta, PageTransitionCategory, TransitionConfigMeta } from './transitions'

// Behaviours (registry, types, resolution)
export {
  behaviourRegistry,
  registerBehaviour,
  unregisterBehaviour,
  getBehaviour,
  getBehaviourIds,
  getAllBehaviourMetas,
  getBehavioursByCategory,
  defineBehaviourMeta,
  resolveBehaviour,
  resolveBehavioursWithDependencies,
  BehaviourWrapper,
  ComposedBehaviourWrapper,
} from './behaviours'
export type {
  Behaviour,
  BehaviourMeta,
  BehaviourCategory,
  BehaviourWrapperProps,
  ComposedBehaviourWrapperProps,
  ComposedBehaviourEntry,
} from './behaviours'

// State types
export type {
  ExperienceState,
  NavigableExperienceState,
  InfiniteCarouselState,
  NavigationState,
} from './types'
