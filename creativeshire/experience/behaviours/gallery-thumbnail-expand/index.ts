/**
 * gallery-thumbnail-expand behaviour - expand thumbnails on hover in gallery.
 */

import type { Behaviour } from '../types'
import { registerBehaviour } from '../registry'

const galleryThumbnailExpand: Behaviour = {
  id: 'gallery-thumbnail-expand',
  name: 'Gallery Thumbnail Expand',
  requires: ['prefersReducedMotion'],

  compute: (state, options) => {
    // Track which thumbnail is hovered (if any)
    const hoveredIndex = (state.hoveredThumbnailIndex as number) ?? -1
    const currentIndex = (state.thumbnailIndex as number) ?? 0
    const isHovered = hoveredIndex === currentIndex

    const baseWidth = (options?.baseWidth as number) ?? 78
    const expandedWidth = (options?.expandedWidth as number) ?? 268

    // Respect reduced motion preference
    if (state.prefersReducedMotion) {
      return {
        '--thumbnail-width': `${isHovered ? expandedWidth : baseWidth}px`,
        '--details-opacity': isHovered ? 1 : 0
      }
    }

    return {
      '--thumbnail-width': `${isHovered ? expandedWidth : baseWidth}px`,
      '--details-opacity': isHovered ? 1 : 0
    }
  },

  cssTemplate: `
    width: var(--thumbnail-width, 78px);
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
registerBehaviour(galleryThumbnailExpand)

export default galleryThumbnailExpand
