/**
 * GSAP-powered timeline effects.
 *
 * These are React components and hooks that use GSAP for discrete animations
 * that require timeline control, sequencing, and reversal.
 *
 * Unlike CSS-based behaviours that compute CSS variables, these provide
 * direct GSAP control for:
 * - Modal/overlay reveal animations
 * - Sequenced animations (wipe -> then content fade)
 * - Element-to-fullscreen expand animations
 * - Timeline reversal for close animations
 *
 * Effects are registry-based. To add a new effect:
 * 1. Create a file in ../effects/ (e.g., slide-up.ts)
 * 2. Import it in ../effects/index.ts
 * 3. Use it anywhere: type="slide-up"
 */

// Effect primitives (import first for registration)
export {
  // Registry
  effectRegistry,
  registerEffect,
  unregisterEffect,
  // Resolution
  resolveEffect,
  getEffectIds,
  getAllEffects,
  // Individual effects (for explicit imports)
  wipeLeft,
  wipeRight,
  expand,
  fade,
  overlayFade,
} from '../effects'

export type {
  EffectPrimitive,
  EffectRegistry,
  EffectContext,
  EffectOptions,
  GsapRealization,
  CssRealization,
  TweenVars,
} from '../effects'

// GSAP-powered reveal component and hook
export { RevealTransition } from './reveal-transition'
export type {
  RevealType,
  UseGsapRevealOptions,
  RevealTransitionProps,
} from './reveal-transition'

export { useGsapReveal } from './use-gsap-reveal'
