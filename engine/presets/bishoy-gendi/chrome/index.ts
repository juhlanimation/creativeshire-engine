/**
 * Bishoy Gendi preset chrome configuration.
 *
 * NavTimeline is a preset overlay (not experience chrome) — the preset
 * decides what UI wraps sections; the experience only controls scroll physics.
 * Footer hiding via hideChrome: ['footer']
 * IntroOverlay is configured in intro config (not chrome)
 */

import type { PresetChromeConfig } from '../../types'

/**
 * Chrome configuration for Bishoy Gendi preset.
 * Header and footer are hidden - navigation is handled by the experience.
 */
export const chromeConfig: PresetChromeConfig = {
  regions: {
    header: 'hidden',
    footer: 'hidden',
  },
  overlays: {
    modal: { component: 'ModalRoot' },
    navTimeline: {
      component: 'NavTimeline',
      props: { position: 'center', showArrows: true, autohide: true },
    },
  },
}
