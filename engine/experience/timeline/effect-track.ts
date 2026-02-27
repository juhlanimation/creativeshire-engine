/**
 * effect-track — bridges an EffectPrimitive into an EffectTimeline track.
 *
 * Given an effect ID, context, and options, returns a `() => Promise<void>`
 * suitable for EffectTimeline.addTrack().
 *
 * Two modes:
 * - 'gsap': Lazy import('gsap'), builds GSAP timeline, returns Promise
 * - 'css': Uses animateElement() with the CSS class from CssRealization
 *
 * Falls back to the other realization if the requested one is missing.
 */

import type { EffectContext, EffectOptions } from './primitives/types'
import { resolveEffect } from './primitives/registry'
import { animateElement } from './animateElement'

/**
 * Create an executable track function from an effect primitive.
 *
 * @param effectId - Registered effect ID (e.g., 'wipe-left', 'overlay-fade')
 * @param context - Target element and viewport info
 * @param options - Duration, ease, and other animation options
 * @param mode - Which realization to prefer ('gsap' or 'css', default: 'gsap')
 * @returns A function that executes the animation and returns a Promise
 */
export function createEffectTrack(
  effectId: string,
  context: EffectContext,
  options?: Partial<EffectOptions>,
  mode: 'gsap' | 'css' = 'gsap'
): () => Promise<void> {
  return async () => {
    const effect = resolveEffect(effectId)
    if (!effect) {
      console.warn(`[createEffectTrack] Effect "${effectId}" not found in registry`)
      return
    }

    const mergedOptions: EffectOptions = {
      duration: options?.duration ?? effect.defaults.duration,
      ease: options?.ease ?? effect.defaults.ease,
      sequenceContentFade: options?.sequenceContentFade ?? false,
      contentFadeDuration: options?.contentFadeDuration ?? 0.3,
      sourceRect: options?.sourceRect,
    }

    // Try preferred mode, fall back to the other
    if (mode === 'gsap' && effect.gsap) {
      await executeGsapTrack(effect.gsap, context, mergedOptions)
    } else if (mode === 'css' && effect.css) {
      await executeCssTrack(effect.css.forwardClass, context, mergedOptions)
    } else if (effect.gsap) {
      // Fallback: tried CSS but only GSAP available
      await executeGsapTrack(effect.gsap, context, mergedOptions)
    } else if (effect.css) {
      // Fallback: tried GSAP but only CSS available
      await executeCssTrack(effect.css.forwardClass, context, mergedOptions)
    } else {
      console.warn(`[createEffectTrack] Effect "${effectId}" has no GSAP or CSS realization`)
    }
  }
}

/**
 * Execute a GSAP-based effect track.
 */
async function executeGsapTrack(
  gsapRealization: NonNullable<import('./primitives/types').EffectPrimitive['gsap']>,
  context: EffectContext,
  options: EffectOptions
): Promise<void> {
  const { gsap } = await import('gsap')

  const initialState = gsapRealization.getInitialState(context, options)
  const finalState = gsapRealization.getFinalState(context, options)

  return new Promise<void>((resolve) => {
    const timeline = gsap.timeline({ onComplete: resolve })

    if (gsapRealization.buildTimeline) {
      gsap.set(context.target, initialState)
      gsapRealization.buildTimeline(timeline, context, options)
    } else {
      timeline.fromTo(
        context.target,
        initialState,
        {
          ...finalState,
          duration: options.duration,
          ease: options.ease,
        }
      )
    }
  })
}

/**
 * Execute a CSS class-based effect track.
 */
async function executeCssTrack(
  className: string,
  context: EffectContext,
  options: EffectOptions
): Promise<void> {
  const timeoutMs = options.duration * 1000 + 100
  await animateElement(context.target, {
    className,
    timeout: timeoutMs,
  })
}
