/**
 * hover/expand behaviour - hover-triggered width/size expansion.
 *
 * Generic behaviour for expanding elements on hover.
 * Used for accordions, expandable items, galleries, and any element
 * that grows on hover.
 *
 * CSS Variables Output:
 * - --expand-width: Current width value
 * - --expand-scale: Scale factor for expansion
 * - --expand-opacity: Opacity for content that appears on expand
 */

import type { Behaviour } from '../../types'
import { registerBehaviour } from '../../registry'
import { meta } from './meta'

export interface HoverExpandSettings {
  baseWidth: number
  expandedWidth: number
  expandScale: number
}

interface HoverExpandOptions {
  baseWidth?: number
  expandedWidth?: number
  widthUnit?: string
  expandScale?: number
}

const hoverExpand: Behaviour<HoverExpandSettings> = {
  ...meta,
  requires: ['isHovered', 'prefersReducedMotion'],

  compute: (state, options) => {
    const isHovered = (state.isHovered as boolean) ?? false

    const {
      baseWidth = 78,
      expandedWidth = 268,
      widthUnit = 'px',
      expandScale = 1
    } = (options as HoverExpandOptions) || {}

    const width = isHovered ? expandedWidth : baseWidth

    // Reduced motion: still expand, just no transition animation
    // (transition is in CSS, behaviour just sets the target value)
    return {
      '--expand-width': `${width}${widthUnit}`,
      '--expand-scale': isHovered ? expandScale : 1,
      '--expand-opacity': isHovered ? 1 : 0
    }
  },

  cssTemplate: `
    width: var(--expand-width, 78px);
    transition: width 0.3s ease;
    will-change: width;
  `,
}

// Auto-register on module load
registerBehaviour(hoverExpand)

export default hoverExpand
