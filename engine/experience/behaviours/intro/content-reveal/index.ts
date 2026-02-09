/**
 * intro/content-reveal behaviour - reveals content when intro phase changes.
 *
 * Generic behaviour for intro sequences where content should appear
 * after the intro phase completes.
 *
 * CSS Variables Output:
 * - --intro-opacity: Content opacity (0 during intro, 1 after)
 * - --intro-y: Vertical offset in pixels
 * - --intro-scale: Scale transform value
 * - --intro-progress: Reveal progress (0-1)
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'
import { meta } from './meta'

export interface IntroContentRevealSettings {
  /** Delay after intro completes before starting reveal (ms) */
  delay: number
  /** Reveal duration (ms) */
  duration: number
  /** Y offset in pixels for slide effect */
  yOffset: number
  /** Scale start value */
  scaleStart: number
}

const introContentReveal: Behaviour<IntroContentRevealSettings> = {
  ...meta,
  requires: ['phase', 'revealProgress', 'prefersReducedMotion'],

  compute: (state, options) => {
    const {
      yOffset = 30,
      scaleStart = 0.98
    } = (options as Partial<IntroContentRevealSettings>) || {}

    const phase = (state.phase as string) ?? 'intro-locked'
    const revealProgress = (state.revealProgress as number) ?? 0

    // Respect reduced motion preference
    if (state.prefersReducedMotion) {
      const isReady = phase === 'ready' || phase === 'intro-revealing'
      return {
        '--intro-opacity': isReady ? 1 : 0,
        '--intro-y': 0,
        '--intro-scale': 1,
        '--intro-progress': isReady ? 1 : 0
      }
    }

    // Calculate reveal based on phase
    let progress = 0
    if (phase === 'intro-revealing') {
      progress = revealProgress
    } else if (phase === 'ready') {
      progress = 1
    }

    return {
      '--intro-opacity': progress,
      '--intro-y': (1 - progress) * yOffset,
      '--intro-scale': scaleStart + (1 - scaleStart) * progress,
      '--intro-progress': progress
    }
  },

  cssTemplate: `
    opacity: var(--intro-opacity, 1);
    transform: translateY(calc(var(--intro-y, 0) * 1px)) scale(var(--intro-scale, 1));
    will-change: opacity, transform;
  `,
}

// Auto-register on module load
registerBehaviour(introContentReveal)

export default introContentReveal
