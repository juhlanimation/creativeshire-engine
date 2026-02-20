/**
 * Navigation module - page transitions and section navigation.
 *
 * Page transitions:
 * - TransitionProvider: Context for exit/entry stacks
 * - useExitTask: Register exit animation
 * - useEntryTask: Register entry animation
 * - TransitionStack: Stack manager (internal)
 *
 * Section navigation (to be added):
 * - useWheelNavigation
 * - useKeyboardNavigation
 * - useSwipeNavigation
 * - NavigationInitializer
 */

// Page transitions
export {
  TransitionProvider,
  useTransition,
  useTransitionPhase,
  useTransitionOptional,
  type TransitionContextValue,
  type TransitionPhase,
  type TransitionProviderProps,
} from './TransitionProvider'

export { useExitTask, type UseExitTaskOptions } from './useExitTask'
export { useEntryTask, type UseEntryTaskOptions } from './useEntryTask'
export { PageTransitionWrapper, type PageTransitionWrapperProps } from './PageTransitionWrapper'
export {
  PageTransitionProvider,
  usePageTransition,
  usePageTransitionRequired,
  type PageTransitionContextValue,
  type PageTransitionProviderProps,
} from './PageTransitionContext'

// Internal utilities (for advanced use)
export { TransitionStack, executeStack, createTask } from './TransitionStack'
export { EffectTimeline, type Track } from '../timeline/EffectTimeline'
export {
  animateElement,
  prefersReducedMotion,
  type AnimateElementOptions,
} from '../timeline/animateElement'

// Section navigation hooks
export { useWheelNavigation, type WheelNavigationOptions } from './useWheelNavigation'
export { useKeyboardNavigation, type KeyboardNavigationOptions } from './useKeyboardNavigation'
export { useSwipeNavigation, type SwipeNavigationOptions } from './useSwipeNavigation'
export { useExperienceActions } from './useExperienceActions'

// Section navigation component (wire-up)
export { NavigationInitializer } from './NavigationInitializer'
