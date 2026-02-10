/**
 * scroll/cover-progress behaviour.
 * Calculates how much the next sibling section overlaps this section (0→100).
 *
 * Sets --cover-progress on the section element.
 * Optionally propagates to document root via propagateToRoot option
 * for cross-region consumption (e.g., logo reveal in chrome header).
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'
import { meta } from './meta'

export interface CoverProgressSettings {
  /** CSS variable name to set on document root (e.g., '--hero-cover-progress'). Empty = no propagation. */
  propagateToRoot: string
}

const scrollCoverProgress: Behaviour<CoverProgressSettings> = {
  ...meta,
  requires: ['scrollProgress'],

  compute: (state, options) => {
    const scrollProgress = (state.scrollProgress as number) ?? 0

    // Cover progress: maps scroll progress to 0-100 percentage
    // At scrollProgress 0, the next section hasn't started covering yet
    // At scrollProgress 1, the next section fully covers this section
    const progress = Math.min(100, Math.max(0, scrollProgress * 100))

    // Propagate to document root for cross-region consumption
    const rootVar = options?.propagateToRoot as string
    if (rootVar && typeof document !== 'undefined') {
      document.documentElement.style.setProperty(rootVar, progress.toString())
    }

    return { '--cover-progress': progress }
  },

  cssTemplate: `
    will-change: contents;
  `,
}

// Auto-register on module load
registerBehaviour(scrollCoverProgress)

export default scrollCoverProgress
