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
import { createFixedNavRegion } from '../../content/chrome/patterns/FixedNav'
import { homePageTemplate } from './pages/home'
import { aboutPageTemplate } from './pages/about'
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
  content: {
    id: 'test-multipage-content',
    name: 'Test Multipage',
    pages: {
      home: homePageTemplate,
      about: aboutPageTemplate,
    },
    chrome: {
      regions: {
        header: createFixedNavRegion({
          siteTitle: 'Test Site',
          navLinks: [
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
          ],
          background: 'rgba(255, 255, 255, 0.95)',
          color: '#000000',
        }),
        footer: 'hidden',
      },
    },
    contentContract: testMultipageContentContract,
    sampleContent: {},
  },
  experience: {
    base: 'simple',
    overrides: {
      transition: { id: 'fade' },
    },
  },
  theme: {
    id: 'test-multipage-theme',
    name: 'Test',
    theme: {
      scrollbar: {
        width: 6,
        thumb: '#333333',
        track: '#f0f0f0',
      },
    },
  },
}

// Re-export content contract for platform use
export { testMultipageContentContract } from './content-contract'

// Auto-register on module load
registerPreset(testMultipageMeta, testMultipagePreset)
