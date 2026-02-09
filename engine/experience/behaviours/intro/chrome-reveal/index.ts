/**
 * intro/chrome-reveal behaviour - reveals chrome (header/footer) after intro.
 *
 * Generic behaviour for intro sequences where chrome should appear
 * only after the intro phase completes.
 *
 * CSS Variables Output:
 * - --chrome-opacity: Chrome opacity (0 during intro, 1 after)
 * - --chrome-y: Vertical offset in pixels (for slide effect)
 * - --chrome-visible: Visibility flag (0 or 1)
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'
import { meta } from './meta'

export interface IntroChromeRevealSettings {
  /** Y offset in pixels for slide effect (positive = from top, negative = from bottom) */
  yOffset: number
  /** Which edge this chrome is on (affects slide direction) */
  edge: 'top' | 'bottom'
  /** Delay after intro completes (ms) */
  delay: number
}

const introChromeReveal: Behaviour<IntroChromeRevealSettings> = {
  ...meta,
  requires: ['phase', 'chromeVisible', 'introCompleted', 'prefersReducedMotion'],

  compute: (state, options) => {
    const {
      yOffset = 20,
      edge = 'top'
    } = (options as Partial<IntroChromeRevealSettings>) || {}

    const chromeVisible = (state.chromeVisible as boolean) ?? false
    const introCompleted = (state.introCompleted as boolean) ?? false

    // Respect reduced motion preference
    if (state.prefersReducedMotion) {
      const isVisible = chromeVisible || introCompleted
      return {
        '--chrome-opacity': isVisible ? 1 : 0,
        '--chrome-y': 0,
        '--chrome-visible': isVisible ? 1 : 0
      }
    }

    // Calculate Y offset based on edge
    const actualYOffset = edge === 'top' ? -yOffset : yOffset
    const visible = chromeVisible || introCompleted

    return {
      '--chrome-opacity': visible ? 1 : 0,
      '--chrome-y': visible ? 0 : actualYOffset,
      '--chrome-visible': visible ? 1 : 0
    }
  },

  cssTemplate: `
    opacity: var(--chrome-opacity, 1);
    transform: translateY(calc(var(--chrome-y, 0) * 1px));
    visibility: calc(var(--chrome-visible, 1) == 1 ? visible : hidden);
    pointer-events: calc(var(--chrome-visible, 1) == 1 ? auto : none);
    will-change: opacity, transform;
    transition: opacity 400ms ease, transform 400ms ease;
  `,
}

// Auto-register on module load
registerBehaviour(introChromeReveal)

export default introChromeReveal
