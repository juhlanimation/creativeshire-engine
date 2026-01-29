/**
 * scroll-fade behaviour - Fades section in as it enters viewport.
 *
 * Uses sectionVisibility (0-1 intersection ratio) to compute opacity.
 * Matches bojuhl.com fade-in effect with 1.5x acceleration.
 *
 * CSS Variables Output:
 * - --section-opacity: Section opacity (0-1)
 * - --section-y: Vertical offset (always 0px for this behaviour)
 */

import type { Behaviour } from '../types'
import { registerBehaviour } from '../registry'

const scrollFade: Behaviour = {
  id: 'scroll-fade',
  name: 'Scroll Fade',

  compute: (state) => {
    const { sectionVisibility, prefersReducedMotion } = state

    // Reduced motion: instant visibility
    if (prefersReducedMotion) {
      return {
        '--section-opacity': 1,
        '--section-y': '0px',
      }
    }

    // Map visibility (0-1) to opacity with acceleration
    // 1.5x multiplier means section is fully visible at ~67% intersection
    const visibility = (sectionVisibility as number) ?? 0
    const progress = Math.min(1, visibility * 1.5)

    return {
      '--section-opacity': progress,
      '--section-y': '0px',
    }
  },
}

registerBehaviour(scrollFade)
export default scrollFade
