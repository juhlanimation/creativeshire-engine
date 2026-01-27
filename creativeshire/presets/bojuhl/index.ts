/**
 * Bojuhl Preset
 * Portfolio site preset with hero, about, and projects sections.
 *
 * Usage:
 * ```typescript
 * import { bojuhlPreset } from '@/creativeshire/presets/bojuhl'
 *
 * export const siteConfig: SiteSchema = {
 *   id: 'my-site',
 *   ...bojuhlPreset,
 * }
 * ```
 */

import type { SitePreset } from '../types'
import { experienceConfig, behaviourDefaults } from './site'
import { footerConfig, floatingContactConfig } from './chrome'
import { homePageTemplate } from './pages'

/**
 * Bojuhl preset - complete portfolio site configuration.
 * Includes hero, about, featured projects, and other projects sections.
 */
export const bojuhlPreset: SitePreset = {
  experience: experienceConfig,
  chrome: {
    regions: {
      header: 'hidden',
      footer: footerConfig,
    },
    overlays: {
      floatingContact: floatingContactConfig,
    },
  },
  pages: {
    home: homePageTemplate,
  },
  behaviours: behaviourDefaults,
}
