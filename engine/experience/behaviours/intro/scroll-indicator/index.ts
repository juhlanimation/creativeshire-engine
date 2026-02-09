/**
 * intro/scroll-indicator behaviour - shows scroll indicator after intro.
 *
 * Generic behaviour for scroll indicators that should only appear
 * after the intro sequence completes and scroll is unlocked.
 *
 * CSS Variables Output:
 * - --scroll-indicator-opacity: Indicator opacity
 * - --scroll-indicator-visible: Visibility flag (0 or 1)
 * - --scroll-indicator-pulse: Pulse animation state (0-1, loops)
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'
import { meta } from './meta'

export interface IntroScrollIndicatorSettings {
  /** Delay after intro completes before showing (ms) */
  delay: number
  /** Enable pulsing animation */
  enablePulse: boolean
  /** Hide after user starts scrolling */
  hideOnScroll: boolean
  /** Scroll threshold to hide (0-1) */
  hideThreshold: number
}

const introScrollIndicator: Behaviour<IntroScrollIndicatorSettings> = {
  ...meta,
  requires: ['phase', 'introCompleted', 'scrollProgress', 'isScrollLocked', 'prefersReducedMotion'],

  compute: (state, options) => {
    const {
      hideOnScroll = true,
      hideThreshold = 0.05
    } = (options as Partial<IntroScrollIndicatorSettings>) || {}

    const phase = (state.phase as string) ?? 'intro-locked'
    const introCompleted = (state.introCompleted as boolean) ?? false
    const scrollProgress = (state.scrollProgress as number) ?? 0
    const isScrollLocked = (state.isScrollLocked as boolean) ?? true

    // Respect reduced motion preference
    if (state.prefersReducedMotion) {
      const isReady = phase === 'ready' && !isScrollLocked
      const isHidden = hideOnScroll && scrollProgress > hideThreshold
      const visible = isReady && !isHidden
      return {
        '--scroll-indicator-opacity': visible ? 1 : 0,
        '--scroll-indicator-visible': visible ? 1 : 0,
        '--scroll-indicator-pulse': 0
      }
    }

    // Only show when intro is complete and scroll is unlocked
    const isReady = (phase === 'ready' || introCompleted) && !isScrollLocked

    // Hide if user has started scrolling
    const isHidden = hideOnScroll && scrollProgress > hideThreshold

    const visible = isReady && !isHidden
    const opacity = visible ? 1 : 0

    // Pulse animation value (0-1, based on time for continuous animation)
    // This will be driven by CSS animation, we just enable/disable it
    const pulseState = visible ? 1 : 0

    return {
      '--scroll-indicator-opacity': opacity,
      '--scroll-indicator-visible': visible ? 1 : 0,
      '--scroll-indicator-pulse': pulseState
    }
  },

  cssTemplate: `
    opacity: var(--scroll-indicator-opacity, 0);
    visibility: calc(var(--scroll-indicator-visible, 0) == 1 ? visible : hidden);
    pointer-events: calc(var(--scroll-indicator-visible, 0) == 1 ? auto : none);
    will-change: opacity;
    transition: opacity 400ms ease;
  `,
}

// Auto-register on module load
registerBehaviour(introScrollIndicator)

export default introScrollIndicator
