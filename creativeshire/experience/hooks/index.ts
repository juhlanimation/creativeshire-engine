/**
 * Experience hooks barrel.
 * L2 hooks for imperative control (video playback, transitions, etc.)
 */

export { useVisibilityPlayback } from './useVisibilityPlayback'
export { useScrollFadeBehaviour } from './useScrollFadeBehaviour'
export { useScrollIndicatorFade } from './useScrollIndicatorFade'
export {
  useTransitionComplete,
  useModalTransitionComplete,
} from './useTransitionComplete'
export type {
  UseTransitionCompleteOptions,
  UseModalTransitionCompleteOptions,
} from './useTransitionComplete'

// GSAP reveal transitions
export { useGsapReveal } from './useGsapReveal'
export type { RevealType, UseGsapRevealOptions } from './useGsapReveal'
