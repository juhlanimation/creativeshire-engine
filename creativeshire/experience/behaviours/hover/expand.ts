/**
 * hover/expand behaviour - hover-triggered width/size expansion.
 *
 * Generic behaviour for expanding elements on hover.
 * Used for thumbnails, accordions, and expandable items.
 *
 * CSS Variables Output:
 * - --expand-width: Current width value
 * - --thumbnail-width: Alias for thumbnail-specific styling
 * - --details-opacity: Opacity for detail content that appears on expand
 */

import type { Behaviour } from '../types'
import { registerBehaviour } from '../registry'

interface HoverExpandOptions {
  baseWidth?: number
  expandedWidth?: number
  widthUnit?: string
}

const hoverExpand: Behaviour = {
  id: 'hover/expand',
  name: 'Hover Expand',
  requires: ['prefersReducedMotion'],

  compute: (state, options) => {
    // Support both direct hover state and indexed hover tracking
    const hoveredIndex = (state.hoveredThumbnailIndex as number) ?? -1
    const currentIndex = (state.thumbnailIndex as number) ?? 0
    const directHover = (state.isHovered as boolean) ?? false

    // Determine if this element is hovered
    const isHovered = directHover || hoveredIndex === currentIndex

    const {
      baseWidth = 78,
      expandedWidth = 268,
      widthUnit = 'px'
    } = (options as HoverExpandOptions) || {}

    const width = isHovered ? expandedWidth : baseWidth

    // Reduced motion: still expand, just no transition animation
    // (transition is in CSS, behaviour just sets the target value)
    return {
      '--expand-width': `${width}${widthUnit}`,
      '--thumbnail-width': `${width}${widthUnit}`,
      '--details-opacity': isHovered ? 1 : 0
    }
  },

  cssTemplate: `
    width: var(--expand-width, 78px);
    transition: width 0.3s ease;
    will-change: width;
  `,

  optionConfig: {
    baseWidth: {
      type: 'range',
      label: 'Base Width',
      default: 78,
      min: 50,
      max: 120,
      step: 2
    },
    expandedWidth: {
      type: 'range',
      label: 'Expanded Width',
      default: 268,
      min: 200,
      max: 400,
      step: 10
    }
  }
}

// Auto-register on module load
registerBehaviour(hoverExpand)

export default hoverExpand
