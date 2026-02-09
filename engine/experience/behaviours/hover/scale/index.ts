/**
 * hover/scale behaviour - hover-triggered scale animation.
 *
 * Generic behaviour for hover scale effects with optional shadow changes.
 * Used for cards, buttons, CTAs, and interactive elements.
 *
 * CSS Variables Output:
 * - --hover-scale: Scale transform value
 * - --card-scale: Alias for card-specific styling
 * - --cta-scale: Alias for CTA-specific styling
 * - --hover-shadow: Box shadow value
 * - --cta-shadow: Alias for CTA-specific shadow
 * - --overlay-opacity: Overlay opacity for card effects
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'
import { meta } from './meta'

export interface HoverScaleSettings {
  hoverScale: number
  pressScale: number
  overlayOpacity: number
  hoverOverlayOpacity: number
}

interface HoverScaleOptions {
  hoverScale?: number
  pressScale?: number
  defaultShadow?: string
  hoverShadow?: string
  overlayOpacity?: number
  hoverOverlayOpacity?: number
}

const hoverScale: Behaviour<HoverScaleSettings> = {
  ...meta,
  requires: ['isHovered', 'isPressed', 'prefersReducedMotion'],

  compute: (state, options) => {
    const isHovered = (state.isHovered as boolean) ?? false
    const isPressed = (state.isPressed as boolean) ?? false
    const {
      hoverScale: hoverScaleValue = 1.03,
      pressScale = 0.98,
      defaultShadow = '0 2px 8px rgba(153, 51, 255, 0.2)',
      hoverShadow = '0 4px 12px rgba(153, 51, 255, 0.3)',
      overlayOpacity = 0.1,
      hoverOverlayOpacity = 0.3
    } = (options as HoverScaleOptions) || {}

    // Respect reduced motion preference
    if (state.prefersReducedMotion) {
      return {
        '--hover-scale': 1,
        '--card-scale': 1,
        '--cta-scale': 1,
        '--hover-shadow': defaultShadow,
        '--cta-shadow': defaultShadow,
        '--overlay-opacity': overlayOpacity
      }
    }

    // Calculate scale based on state
    let scale = 1
    if (isPressed) {
      scale = pressScale
    } else if (isHovered) {
      scale = hoverScaleValue
    }

    // Shadow changes on hover
    const shadow = isHovered ? hoverShadow : defaultShadow

    return {
      '--hover-scale': scale,
      '--card-scale': scale,
      '--cta-scale': scale,
      '--hover-shadow': shadow,
      '--cta-shadow': shadow,
      '--overlay-opacity': isHovered ? hoverOverlayOpacity : overlayOpacity
    }
  },

  cssTemplate: `
    transform: scale(var(--hover-scale, 1));
    box-shadow: var(--hover-shadow, 0 2px 8px rgba(153, 51, 255, 0.2));
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    will-change: transform, box-shadow;
  `,
}

// Auto-register on module load
registerBehaviour(hoverScale)

export default hoverScale
