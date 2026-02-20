/**
 * Timeline module - shared orchestration primitives.
 *
 * EffectTimeline orchestrates discrete animations (play → complete):
 * - Page transitions: play() for parallel exit/entry tracks
 * - Intro sequences: playSequential() for sequential steps with delays
 *
 * GSAP-powered reveal transitions (wipe, expand, fade):
 * - Modal/overlay animations
 * - Reversible open/close timelines
 *
 * This is DISCRETE animation (event-triggered, finite duration).
 * For CONTINUOUS animation (scroll, hover → CSS vars at 60fps), see drivers/.
 */

// Promise-based timeline orchestration
export { EffectTimeline, type Track, type SequentialTrack } from './EffectTimeline'

// CSS class-based animation helper
export {
  animateElement,
  prefersReducedMotion,
  type AnimateElementOptions,
} from './animateElement'

// GSAP-powered reveal transitions
export {
  // Registry
  transitionRegistry,
  registerTransition,
  unregisterTransition,
  // Resolution
  resolveTransition,
  getTransitionIds,
  // Individual transitions
  wipeLeft,
  wipeRight,
  expand,
  fade,
} from './gsap'

export type {
  Transition,
  TransitionRegistry,
  TransitionContext,
  TransitionOptions,
  TransitionCssConfig,
} from './gsap'

// GSAP-powered reveal component and hook
export { RevealTransition, useGsapReveal } from './gsap'
export type {
  RevealType,
  UseGsapRevealOptions,
  RevealTransitionProps,
} from './gsap'
