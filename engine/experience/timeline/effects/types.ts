/**
 * Effect primitive types.
 *
 * An EffectPrimitive defines a visual transformation once. Multiple orchestrators
 * (GSAP reveals, CSS page transitions, intro sequences) consume the same definition,
 * choosing GSAP or CSS realization as needed.
 *
 * Evolved from gsap/transitions/types.ts. Key renames:
 * - Transition → EffectPrimitive
 * - TransitionContext → EffectContext (container → target)
 * - TransitionOptions → EffectOptions
 */

import type gsap from 'gsap'

/**
 * GSAP tween variables (subset of gsap.TweenVars).
 * Defines animatable properties for effects.
 */
export type TweenVars = {
  [key: string]: unknown
  opacity?: number
  visibility?: 'visible' | 'hidden' | 'inherit'
  clipPath?: string
  transform?: string
  scale?: number
  x?: number | string
  y?: number | string
}

/**
 * Context provided to effect functions.
 * Contains element references and computed values at animation time.
 */
export interface EffectContext {
  /** The target element being animated */
  target: HTMLElement
  /** Optional content element for sequenced animations */
  content?: HTMLElement
  /** Viewport dimensions at time of animation */
  viewport: { width: number; height: number }
  /** For expand: source element bounds */
  sourceRect?: DOMRect | null
}

/**
 * Options passed to effect functions.
 * Merged from effect defaults + user-provided options.
 */
export interface EffectOptions {
  /** Animation duration in seconds */
  duration: number
  /** GSAP easing function */
  ease: string
  /** Whether to sequence content fade after main animation */
  sequenceContentFade: boolean
  /** Content fade duration in seconds (if sequenceContentFade is true) */
  contentFadeDuration: number
  /** For expand: source element bounds */
  sourceRect?: DOMRect | null
}

/**
 * GSAP realization — how the effect animates with GSAP.
 */
export interface GsapRealization {
  /**
   * Get initial state for the element (hidden).
   * Called before animation starts to set hidden state.
   */
  getInitialState: (context: EffectContext, options: EffectOptions) => TweenVars

  /**
   * Get final state for the element (revealed).
   */
  getFinalState: (context: EffectContext, options: EffectOptions) => TweenVars

  /**
   * Optional: Build custom timeline for complex animations.
   * If provided, overrides default initial → final interpolation.
   */
  buildTimeline?: (
    timeline: gsap.core.Timeline,
    context: EffectContext,
    options: EffectOptions
  ) => void
}

/**
 * CSS realization — how the effect animates with CSS classes.
 */
export interface CssRealization {
  /** CSS class for forward animation (e.g., fade-in, wipe-enter) */
  forwardClass: string
  /** CSS class for reverse animation (optional) */
  reverseClass?: string
  /** data-effect attribute value (optional, for attribute-based targeting) */
  effect?: string
}

/**
 * Effect primitive definition.
 * Defines a visual transformation that can be realized via GSAP or CSS.
 */
export interface EffectPrimitive {
  /** Unique effect identifier (e.g., 'wipe-left', 'expand', 'fade') */
  id: string
  /** Human-readable name for UI display */
  name: string
  /** Default options for this effect */
  defaults: { duration: number; ease: string }

  /** GSAP realization (timeline-based animations) */
  gsap?: GsapRealization

  /** CSS realization (class-based animations) */
  css?: CssRealization
}

/**
 * Effect registry type.
 * Maps effect IDs to effect definitions.
 */
export type EffectRegistry = Record<string, EffectPrimitive>
