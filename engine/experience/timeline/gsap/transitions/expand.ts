/**
 * expand transition.
 * Expands from source element to fullscreen using clip-path.
 *
 * Calculates initial clip-path from sourceRect (element bounds)
 * and animates to full viewport. Used for gallery thumbnails.
 */

import type { Transition, TransitionContext, TransitionOptions } from './types'
import { registerTransition } from './registry'

const expand: Transition = {
  id: 'expand',
  name: 'Expand',

  defaults: {
    duration: 0.8,
    ease: 'power3.inOut',
  },

  getInitialState: (context: TransitionContext, options: TransitionOptions) => {
    const { sourceRect } = options

    if (sourceRect) {
      // Calculate clip-path inset percentages from sourceRect relative to
      // the container element's own rect. This is correct regardless of:
      // - Scrollbar presence (modal adds paddingRight to prevent content shift)
      // - Contained mode (container may not fill the viewport)
      // - Container offset from viewport origin
      const containerRect = context.container.getBoundingClientRect()
      const top = ((sourceRect.top - containerRect.top) / containerRect.height) * 100
      const bottom = ((containerRect.bottom - sourceRect.bottom) / containerRect.height) * 100
      const left = ((sourceRect.left - containerRect.left) / containerRect.width) * 100
      const right = ((containerRect.right - sourceRect.right) / containerRect.width) * 100

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
}

// Auto-register on module load
registerTransition(expand)

export default expand
