/**
 * Bojuhl preset global cursor label configuration.
 * Site-wide "WATCH" cursor label for video thumbnails.
 *
 * Targets any element with [data-cursor-label-target] attribute.
 * Used by Video widgets and ExpandableGalleryRow.
 */

import type { PresetOverlayConfig } from '../../types'

/**
 * Global cursor label overlay configuration.
 * Positioned relative to cursor, follows mouse movement.
 */
export const cursorLabelConfig: PresetOverlayConfig = {
  widget: {
    id: 'global-cursor-label',
    type: 'CursorLabel',
    props: {
      label: 'WATCH',
      targetSelector: '[data-cursor-label-target]',
    },
  },
}
