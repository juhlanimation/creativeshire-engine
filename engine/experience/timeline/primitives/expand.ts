/**
 * expand effect primitive.
 * Expands from source element to fullscreen using clip-path.
 *
 * Calculates initial clip-path from sourceRect (element bounds)
 * and animates to full viewport. Used for gallery thumbnails.
 */

import type { EffectPrimitive, EffectContext, EffectOptions } from './types'
import { registerEffect } from './registry'

const expand: EffectPrimitive = {
  id: 'expand',
  name: 'Expand',

  defaults: {
    duration: 0.8,
    ease: 'power3.inOut',
  },

  gsap: {
    getInitialState: (context: EffectContext, options: EffectOptions) => {
      const { sourceRect } = options

      if (sourceRect) {
        // Calculate clip-path inset percentages from sourceRect relative to
        // the target element's own rect. This is correct regardless of:
        // - Scrollbar presence (modal adds paddingRight to prevent content shift)
        // - Contained mode (container may not fill the viewport)
        // - Container offset from viewport origin
        const targetRect = context.target.getBoundingClientRect()
        const top = ((sourceRect.top - targetRect.top) / targetRect.height) * 100
        const bottom = ((targetRect.bottom - sourceRect.bottom) / targetRect.height) * 100
        const left = ((sourceRect.left - targetRect.left) / targetRect.width) * 100
        const right = ((targetRect.right - sourceRect.right) / targetRect.width) * 100

        return {
          clipPath: `inset(${top}% ${right}% ${bottom}% ${left}%)`,
          visibility: 'visible',
        }
      }

      // Fallback: expand from center
      return {
        clipPath: 'inset(50% 50% 50% 50%)',
        visibility: 'visible',
      }
    },

    getFinalState: () => ({
      clipPath: 'inset(0% 0% 0% 0%)',
    }),
  },
}

// Auto-register on module load
registerEffect(expand)

export default expand
