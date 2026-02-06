/**
 * Bishoy Gendi preset chrome configuration.
 *
 * Minimal chrome - the infinite-carousel experience provides:
 * - NavTimeline via experienceChrome
 * - Footer hiding via hideChrome: ['footer']
 * - IntroOverlay is configured in intro config (not chrome)
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
  },
}
