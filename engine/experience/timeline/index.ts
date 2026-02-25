/**
 * Timeline module - shared orchestration primitives.
 *
 * EffectTimeline orchestrates discrete animations (play → complete):
 * - Page transitions: play() for parallel exit/entry tracks
 * - Intro sequences: playSequential() for sequential steps with delays
 *
 * Effect primitives (shared across orchestrators):
 * - Define visual transformations once (wipe, expand, fade)
 * - GSAP and CSS realizations in one definition
 * - Registry-based: resolveEffect() / registerEffect()
 *
 * GSAP-powered reveal animations (wipe, expand, fade):
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

// Effect primitives (shared definitions)
export {
  effectRegistry,
  registerEffect,
  unregisterEffect,
  resolveEffect,
  getEffectIds,
  getAllEffects,
  wipeLeft,
  wipeRight,
  expand,
  fade,
  overlayFade,
} from './effects'

export type {
  EffectPrimitive,
  EffectRegistry,
  EffectContext,
  EffectOptions,
  GsapRealization,
  CssRealization,
  TweenVars,
} from './effects'

// Effect-to-track bridge
export { createEffectTrack } from './effect-track'

// GSAP-powered reveal component and hook
export { RevealTransition, useGsapReveal } from './gsap'
export type {
  RevealType,
  UseGsapRevealOptions,
  RevealTransitionProps,
} from './gsap'
