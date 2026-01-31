/**
 * GSAP-powered animation drivers.
 *
 * These are React components and hooks that use GSAP for complex animations
 * that require timeline control, sequencing, and reversal.
 *
 * Unlike CSS-based behaviours that compute CSS variables, these provide
 * direct GSAP control for:
 * - Modal/overlay reveal transitions
 * - Sequenced animations (wipe -> then content fade)
 * - Element-to-fullscreen expand animations
 * - Timeline reversal for close animations
 *
 * Transitions are now registry-based. To add a new transition:
 * 1. Create a file in ./transitions/ (e.g., slide-up.ts)
 * 2. Import it in ./transitions/index.ts
 * 3. Use it anywhere: type="slide-up"
 */

// Transitions (import first for registration)
export {
  // Registry
  transitionRegistry,
  registerTransition,
  unregisterTransition,
  // Resolution
  resolveTransition,
  getTransitionIds,
  // Individual transitions (for explicit imports)
  wipeLeft,
  wipeRight,
  expand,
  fade,
} from './transitions'

export type {
  Transition,
  TransitionRegistry,
  TransitionContext,
  TransitionOptions,
  TransitionCssConfig,
} from './transitions'

// GSAP-powered reveal component and hook
export { RevealTransition } from './reveal-transition'
export type {
  RevealType,
  UseGsapRevealOptions,
  RevealTransitionProps,
} from './reveal-transition'

export { useGsapReveal } from './use-gsap-reveal'
