/**
 * intro/text-reveal behaviour - reveals text when intro phase changes.
 *
 * Generic behaviour for intro sequences with staggered text reveals.
 * Can be combined with clip-path or fade effects.
 *
 * CSS Variables Output:
 * - --intro-text-opacity: Text opacity (0 during intro, 1 after)
 * - --intro-text-y: Vertical offset in pixels
 * - --intro-text-clip: Clip progress for clip-path reveals (0-100%)
 * - --intro-text-progress: Reveal progress (0-1)
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'
import { meta } from './meta'

export interface IntroTextRevealSettings {
  /** Stagger index for multiple text elements (affects delay) */
  staggerIndex: number
  /** Delay per stagger index (ms) */
  staggerDelay: number
  /** Y offset in pixels for slide effect */
  yOffset: number
  /** Use clip-path reveal instead of fade */
  useClipPath: boolean
}

const introTextReveal: Behaviour<IntroTextRevealSettings> = {
  ...meta,
  requires: ['phase', 'revealProgress', 'prefersReducedMotion'],

  compute: (state, options) => {
    const {
      staggerIndex = 0,
      staggerDelay = 100,
      yOffset = 20,
      useClipPath = false
    } = (options as Partial<IntroTextRevealSettings>) || {}

    const phase = (state.phase as string) ?? 'intro-locked'
    const revealProgress = (state.revealProgress as number) ?? 0

    // Respect reduced motion preference
    if (state.prefersReducedMotion) {
      const isReady = phase === 'ready' || phase === 'intro-revealing'
      return {
        '--intro-text-opacity': isReady ? 1 : 0,
        '--intro-text-y': 0,
        '--intro-text-clip': isReady ? 100 : 0,
        '--intro-text-progress': isReady ? 1 : 0
      }
    }

    // Calculate staggered progress
    // Each element starts slightly later based on staggerIndex
    const staggerOffset = staggerIndex * staggerDelay / 600 // Normalize to 0-1 range
    let progress = 0

    if (phase === 'intro-revealing') {
      // Adjust progress based on stagger offset
      progress = Math.max(0, Math.min(1, (revealProgress - staggerOffset) / (1 - staggerOffset)))
    } else if (phase === 'ready') {
      progress = 1
    }

    return {
      '--intro-text-opacity': useClipPath ? 1 : progress,
      '--intro-text-y': (1 - progress) * yOffset,
      '--intro-text-clip': progress * 100,
      '--intro-text-progress': progress
    }
  },

  cssTemplate: `
    opacity: var(--intro-text-opacity, 1);
    transform: translateY(calc(var(--intro-text-y, 0) * 1px));
    clip-path: inset(0 calc((100 - var(--intro-text-clip, 100)) * 1%) 0 0);
    will-change: opacity, transform, clip-path;
  `,
}

// Auto-register on module load
registerBehaviour(introTextReveal)

export default introTextReveal
