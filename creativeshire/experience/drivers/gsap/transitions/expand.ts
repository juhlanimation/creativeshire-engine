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
    const { viewport } = context

    if (sourceRect) {
      // Calculate clip-path inset percentages from sourceRect
      // Uses clientWidth/clientHeight for calculations since sourceRect
      // coordinates are relative to the content area, not the full viewport.
      const top = (sourceRect.top / viewport.height) * 100
      const bottom = ((viewport.height - sourceRect.bottom) / viewport.height) * 100
      const left = (sourceRect.left / viewport.width) * 100
      const right = ((viewport.width - sourceRect.right) / viewport.width) * 100

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
