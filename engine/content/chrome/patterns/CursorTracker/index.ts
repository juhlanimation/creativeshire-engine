/**
 * CursorTracker chrome pattern — factory function for cursor overlay.
 * Wraps the CursorLabel chrome component with configurable label and offset.
 *
 * Activation is handled via the action system:
 * - Widget `on: { mouseenter: '{overlayKey}.show', mouseleave: '{overlayKey}.hide' }`
 * - CursorLabel registers `{overlayKey}.show` / `{overlayKey}.hide` handlers on mount
 * - ChromeRenderer passes `overlayKey` prop automatically
 */

import type { PresetOverlayConfig } from '../../../../presets/types'
import type { CursorTrackerProps } from './types'

/**
 * Creates a CursorTracker overlay configuration.
 *
 * @param props - Cursor label text and offset
 * @returns PresetOverlayConfig for the cursor slot
 */
export function createCursorTrackerOverlay(props: CursorTrackerProps): PresetOverlayConfig {
  return {
    component: 'CursorLabel',
    props: {
      label: props.label,
      ...(props.offsetX !== undefined && { offsetX: props.offsetX }),
      ...(props.offsetY !== undefined && { offsetY: props.offsetY }),
      ...(props.targetSelector && { targetSelector: props.targetSelector }),
    },
  }
}
