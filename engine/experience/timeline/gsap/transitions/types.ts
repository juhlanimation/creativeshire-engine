/**
 * Transition types for the decoupled transition registry.
 *
 * Transitions define enter/exit animations for containers (modals, drawers, etc).
 * Each transition specifies how to animate from hidden to revealed state.
 *
 * Two modes supported:
 * - GSAP: Full timeline control for complex animations (wipe, expand)
 * - CSS: Simple class/effect-based transitions (fade, slide)
 */

import type gsap from 'gsap'

/**
 * GSAP tween variables (subset of gsap.TweenVars).
 * Defines animatable properties for transitions.
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
 * Context provided to transition functions.
 * Contains element references and computed values at animation time.
 */
export interface TransitionContext {
  /** The container element being animated */
  container: HTMLElement
  /** Optional content element for sequenced animations */
  content?: HTMLElement
  /** Viewport dimensions at time of animation */
  viewport: { width: number; height: number }
  /** For expand: source element bounds */
  sourceRect?: DOMRect | null
}

/**
 * Options passed to transition functions.
 * Merged from transition defaults + user-provided options.
 */
export interface TransitionOptions {
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
 * CSS mode configuration for simple transitions.
 * Uses data-effect attributes and CSS classes instead of GSAP.
 */
export interface TransitionCssConfig {
  /** data-effect value to apply (e.g., 'fade-reveal') */
  effect: string
  /** Class for hidden state (optional) */
  hiddenClass?: string
  /** Class for visible state (optional) */
  visibleClass?: string
}

/**
 * Transition definition.
 * Defines how to create reveal/hide animations for a container.
 */
export interface Transition {
  /** Unique transition identifier (e.g., 'wipe-left', 'expand') */
  id: string
  /** Human-readable name for UI display */
  name?: string
  /** Default options for this transition */
  defaults: Partial<TransitionOptions>

  /**
   * Get initial state for the container (hidden).
   * Called before animation starts to set hidden state.
   *
   * @param context - Element and computed values
   * @param options - Merged transition options
   * @returns GSAP vars object for initial state
   */
  getInitialState: (context: TransitionContext, options: TransitionOptions) => TweenVars

  /**
   * Get final state for the container (revealed).
   *
   * @param context - Element and computed values
   * @param options - Merged transition options
   * @returns GSAP vars object for final state
   */
  getFinalState: (context: TransitionContext, options: TransitionOptions) => TweenVars

  /**
   * Optional: Build custom timeline for complex animations.
   * If provided, overrides default initial -> final interpolation.
   *
   * @param timeline - Empty GSAP timeline to populate
   * @param context - Element and computed values
   * @param options - Merged transition options
   */
  buildTimeline?: (
    timeline: gsap.core.Timeline,
    context: TransitionContext,
    options: TransitionOptions
  ) => void

  /**
   * Optional: CSS mode configuration for simple transitions.
   * When provided, consumers can choose CSS mode over GSAP.
   */
  css?: TransitionCssConfig
}

/**
 * Transition registry type.
 * Maps transition IDs to transition definitions.
 */
export type TransitionRegistry = Record<string, Transition>
