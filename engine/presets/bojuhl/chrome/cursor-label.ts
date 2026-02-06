/**
 * Bojuhl preset cursor label configurations.
 * "WATCH" label for video thumbnails, "ENTER" label for links.
 *
 * Component-based: CursorLabel is a chrome component that handles
 * its own positioning (follows cursor over target elements).
 */

import type { PresetOverlayConfig } from '../../types'

/**
 * Cursor label for video thumbnails in featured projects.
 * Targets Video widgets in hover-play mode.
 */
export const cursorLabelWatchConfig: PresetOverlayConfig = {
  component: 'CursorLabel',
  props: {
    label: 'WATCH',
    targetSelector: '.video-widget--hover-play',
  },
}

/**
 * Cursor label for links in text content.
 * Targets anchor elements inside text widgets.
 */
export const cursorLabelEnterConfig: PresetOverlayConfig = {
  component: 'CursorLabel',
  props: {
    label: 'ENTER',
    targetSelector: '.text-widget a',
  },
}
