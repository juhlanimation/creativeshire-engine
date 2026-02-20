/**
 * VideoModal chrome pattern — factory function for a free overlay.
 * Wraps the ModalRoot chrome component for full-screen video playback.
 */

import type { PresetOverlayConfig } from '../../../../presets/types'

/**
 * Creates a VideoModal overlay configuration.
 *
 * @returns PresetOverlayConfig for a free overlay
 */
export function createVideoModalOverlay(): PresetOverlayConfig {
  return {
    component: 'ModalRoot',
  }
}
