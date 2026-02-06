/**
 * Test Multipage Preset
 * Simple multi-page site with page transitions for testing.
 *
 * Features:
 * - Multiple pages (home, about) with navigation
 * - Header with nav links
 * - Page transitions (fade out → navigate → fade in)
 *
 * Usage:
 * ```typescript
 * import { testMultipagePreset } from '@creativeshire/engine/presets'
 *
 * export const siteConfig: SiteSchema = {
 *   id: 'my-site',
 *   ...testMultipagePreset,
 * }
 * ```
 */

import type { SitePreset } from '../types'
import { registerPreset, type PresetMeta } from '../registry'
import { transitionConfig } from './site'
import { headerConfig } from './chrome'
import { homePageTemplate, aboutPageTemplate } from './pages'
import { testMultipageContentContract } from './content-contract'

/**
 * Test multipage preset metadata for UI display.
 */
export const testMultipageMeta: PresetMeta = {
  id: 'test-multipage',
  name: 'Test Multipage',
  description: 'Simple multi-page site with header navigation and page transitions.',
}

/**
 * Test multipage preset - simple multi-page site with page transitions.
 * Includes home and about pages with header navigation.
 */
export const testMultipagePreset: SitePreset = {
  theme: {
    scrollbar: {
      width: 6,
      thumb: '#333333',
      track: '#f0f0f0',
    },
  },
  transition: transitionConfig,
  chrome: {
    regions: {
      header: headerConfig,
      footer: 'hidden',
    },
  },
  pages: {
    home: homePageTemplate,
    about: aboutPageTemplate,
  },
}

// Re-export content contract for platform use
export { testMultipageContentContract } from './content-contract'

// Auto-register on module load
registerPreset(testMultipageMeta, testMultipagePreset, {
  contentContract: testMultipageContentContract,
})
