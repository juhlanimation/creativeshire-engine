/**
 * scroll/glass behaviour - Threshold-based glass morphism.
 *
 * Below scroll threshold: fully transparent.
 * Above threshold: frosted glass background + blur.
 * Smooth CSS transition handled by the transform/glass effect, not compute().
 *
 * CSS Variables Output:
 * - --glass-opacity: 0 (transparent) or target opacity value
 * - --glass-blur: 0px (clear) or target blur in px
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'
import { meta, type GlassSettings } from './meta'

const scrollGlass: Behaviour<GlassSettings> = {
  ...meta,
  requires: ['scrollY', 'prefersReducedMotion'],

  compute: (state, options) => {
    if (state.prefersReducedMotion) {
      // Show glass at full strength immediately (no animation)
      const targetOpacity = (options?.targetOpacity as number) ?? 0.85
      const targetBlur = (options?.targetBlur as number) ?? 12
      return {
        '--glass-opacity': targetOpacity,
        '--glass-blur': `${targetBlur}px`,
      }
    }

    const scrollY = (state.scrollY as number) ?? 0
    const threshold = (options?.threshold as number) ?? 50
    const targetOpacity = (options?.targetOpacity as number) ?? 0.85
    const targetBlur = (options?.targetBlur as number) ?? 12

    // Binary threshold — transition smoothness handled by CSS transition in effect
    const isActive = scrollY > threshold

    return {
      '--glass-opacity': isActive ? targetOpacity : 0,
      '--glass-blur': isActive ? `${targetBlur}px` : '0px',
    }
  },
}

registerBehaviour(scrollGlass)
export default scrollGlass
