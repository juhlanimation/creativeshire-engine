/**
 * scroll/fade-out behaviour - Fades section out as it exits viewport.
 *
 * Inverse of scroll/fade. As section scrolls up and out of view,
 * opacity transitions from 1 to 0.
 *
 * CSS Variables Output:
 * - --section-opacity: Section opacity (1-0 as section exits)
 * - --section-y: Vertical offset (always 0px for this behaviour)
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'
import { meta } from './meta'

const scrollFadeOut: Behaviour = {
  ...meta,
  requires: ['sectionVisibility', 'prefersReducedMotion'],

  cssTemplate: `
    opacity: var(--section-opacity, 1);
    transform: translateY(var(--section-y, 0px));
    will-change: opacity, transform;
  `,

  compute: (state) => {
    const { sectionVisibility, prefersReducedMotion } = state

    // Reduced motion: keep visible (no fade)
    if (prefersReducedMotion) {
      return {
        '--section-opacity': 1,
        '--section-y': '0px',
      }
    }

    // Inverse of scroll-fade: opacity decreases as visibility increases
    // visibility 0 = fully visible (opacity 1)
    // visibility 1 = scrolled out (opacity 0)
    const visibility = (sectionVisibility as number) ?? 0
    const progress = Math.min(1, visibility * 1.5)

    return {
      '--section-opacity': 1 - progress,
      '--section-y': '0px',
    }
  },
}

registerBehaviour(scrollFadeOut)
export default scrollFadeOut
