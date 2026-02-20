/**
 * scroll/reveal behaviour — Fades element in based on a propagated scroll progress variable.
 *
 * Reads a CSS variable from document.documentElement.style (set by any section behaviour
 * via propagateToRoot) and normalizes it to 0-1 opacity.
 *
 * IoC: The chrome behaviour doesn't know what section or scroll mechanism produces the
 * progress. Different experiences wire different sources. Changing from cover-scroll to
 * slideshow only changes the experience config, not the behaviour.
 *
 * One-frame delay: Chrome BehaviourWrappers register before section BehaviourWrappers
 * (DOM order in SiteRenderer), so on each frame the chrome reads the previous frame's
 * propagated value. At 60fps this is ~16ms — imperceptible.
 *
 * CSS Variables Output:
 * - --reveal-progress: Normalized progress (0-1)
 */

import type { Behaviour } from '../../types'
import { MIN_PAINT_OPACITY } from '../../types'
import { registerBehaviour } from '../../registry'
import { meta } from './meta'

export interface ScrollRevealSettings {
  /** CSS variable name on document root to read progress from (e.g., '--cover-progress') */
  sourceVar: string
  /** Maximum value of the source variable for normalization. Default: 100 */
  sourceMax: number
}

const scrollReveal: Behaviour<ScrollRevealSettings> = {
  ...meta,
  prerasterize: true,
  requires: ['scrollProgress'],

  cssTemplate: `
    opacity: var(--reveal-progress, 0);
    will-change: opacity;
  `,

  compute: (state, options) => {
    if (state.prefersReducedMotion) {
      return { '--reveal-progress': 1 }
    }

    if (typeof document === 'undefined') {
      return { '--reveal-progress': MIN_PAINT_OPACITY }
    }

    const sourceVar = (options?.sourceVar as string) ?? '--cover-progress'
    const sourceMax = (options?.sourceMax as number) ?? 100

    const rawValue = document.documentElement.style.getPropertyValue(sourceVar)
    const parsed = parseFloat(rawValue)

    if (isNaN(parsed)) {
      return { '--reveal-progress': MIN_PAINT_OPACITY }
    }

    const progress = Math.min(1, Math.max(0, parsed / sourceMax))

    return { '--reveal-progress': progress }
  },
}

// Auto-register on module load
registerBehaviour(scrollReveal)

export default scrollReveal
