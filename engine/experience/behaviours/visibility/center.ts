/**
 * visibility/center behaviour - tracks which element is closest to viewport center.
 *
 * Generic behaviour for scroll-based galleries where the viewport-center element
 * is "selected". Sets CSS variables for center detection.
 *
 * CSS Variables Output:
 * - --is-centered: Whether this element is closest to center (0 or 1)
 * - --center-distance: Normalized distance from center (0 = at center, 1 = at edge)
 * - --center-progress: Smooth progress as element approaches center (0-1)
 */

import type { Behaviour } from '../types'
import { registerBehaviour } from '../registry'

interface VisibilityCenterOptions {
  /** Threshold for considering element "centered" (0-1, default 0.3 = 30% of viewport) */
  threshold?: number
  /** Enable smooth interpolation based on distance */
  smooth?: boolean
}

const visibilityCenter: Behaviour = {
  id: 'visibility/center',
  name: 'Visibility Center',
  requires: ['centerDistance', 'isCentered', 'prefersReducedMotion'],

  compute: (state, options) => {
    const {
      threshold = 0.3,
      smooth = true
    } = (options as VisibilityCenterOptions) || {}

    // State values populated by viewport center driver
    const isCentered = (state.isCentered as boolean) ?? false
    const centerDistance = (state.centerDistance as number) ?? 1

    // Respect reduced motion - instant switch instead of smooth
    if (state.prefersReducedMotion) {
      return {
        '--is-centered': isCentered ? 1 : 0,
        '--center-distance': centerDistance,
        '--center-progress': isCentered ? 1 : 0
      }
    }

    // Calculate smooth progress based on distance from center
    // 0 at edges, 1 at center
    const progress = smooth
      ? Math.max(0, 1 - centerDistance / threshold)
      : isCentered ? 1 : 0

    return {
      '--is-centered': isCentered ? 1 : 0,
      '--center-distance': centerDistance,
      '--center-progress': progress
    }
  },

  cssTemplate: `
    /* Applied via effects that consume these variables */
  `,

  optionConfig: {
    threshold: {
      type: 'range',
      label: 'Center Threshold',
      default: 0.3,
      min: 0.1,
      max: 0.5,
      step: 0.05
    },
    smooth: {
      type: 'toggle',
      label: 'Smooth Progress',
      default: true
    }
  }
}

// Auto-register on module load
registerBehaviour(visibilityCenter)

export default visibilityCenter
