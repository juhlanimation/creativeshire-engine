/**
 * scroll/collapse behaviour - Hides region on scroll down, shows on scroll up.
 *
 * Uses scrollVelocity (positive = down, negative = up) to determine direction.
 * A velocity threshold prevents jitter from micro-scrolls.
 *
 * CSS Variables Output:
 * - --header-translate: translateY offset ('-100%' when hidden, '0' when shown)
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'
import { meta } from './meta'

/** Minimum velocity magnitude to trigger a direction change (pixels/ms) */
const VELOCITY_THRESHOLD = 0.05

const scrollCollapse: Behaviour = {
  ...meta,
  requires: ['scrollVelocity', 'scrollProgress'],

  cssTemplate: `
    transition: transform 300ms ease;
    transform: translateY(var(--header-translate, 0));
  `,

  compute: (state) => {
    const { scrollVelocity, scrollProgress, prefersReducedMotion } = state

    // Reduced motion: never hide
    if (prefersReducedMotion) {
      return { '--header-translate': '0' }
    }

    // Always show when near the top of the page
    if (scrollProgress < 0.05) {
      return { '--header-translate': '0' }
    }

    // Only change direction when velocity exceeds threshold.
    // Below threshold, maintain current direction (CSS var stays as-is via transition).
    if (Math.abs(scrollVelocity) < VELOCITY_THRESHOLD) {
      return { '--header-translate': '0' }
    }

    // Scrolling down → hide, scrolling up → show
    if (scrollVelocity > 0) {
      return { '--header-translate': '-100%' }
    }
    return { '--header-translate': '0' }
  },
}

registerBehaviour(scrollCollapse)
export default scrollCollapse
