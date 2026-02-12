/**
 * Bishoy Gendi Preset
 * Portfolio with 8 project showcase sections.
 *
 * Based on bishoy-gendi-portfolio reference site.
 * Currently uses simple experience for baseline rendering.
 *
 * Usage:
 * ```typescript
 * import { bishoyGendiPreset } from './'
 *
 * export const siteConfig: SiteSchema = {
 *   id: 'my-site',
 *   ...bishoyGendiPreset,
 * }
 * ```
 */

import './styles.css'
import type { SitePreset } from '../types'
import { registerPreset, type PresetMeta } from '../registry'
import { experienceConfig } from './site'
import { chromeConfig } from './chrome'
import { homePageTemplate } from './pages'
import { bishoyGendiContentContract } from './content-contract'

/**
 * Bishoy Gendi preset metadata for UI display.
 */
export const bishoyGendiMeta: PresetMeta = {
  id: 'bishoy-gendi',
  name: 'Bishoy Gendi Portfolio',
  description: 'Portfolio with 8 project showcase sections.',
}

/**
 * Bishoy Gendi preset configuration.
 *
 * Sections:
 * 1. Showreel - Fullscreen video
 * 2. About - Card overlay
 * 3. Azuki Elementals - ProjectGallery
 * 4. Boy Mole Fox Horse - ProjectShowcase
 * 5. THE 21 - ProjectCompare
 * 6. Clash Royale - ProjectVideoGrid
 * 7. Riot Games - ProjectExpand
 * 8. Projects I Like - ProjectTabs
 */
export const bishoyGendiPreset: SitePreset = {
  theme: {
    smoothScroll: {
      enabled: true,
    },
    typography: {
      title: 'var(--font-inter), system-ui, -apple-system, sans-serif',
      paragraph: 'var(--font-plus-jakarta), system-ui, -apple-system, sans-serif',
    },
  },
  experience: experienceConfig,
  chrome: chromeConfig,
  pages: {
    home: homePageTemplate,
  },
}

// Auto-register on module load
registerPreset(bishoyGendiMeta, bishoyGendiPreset, {
  contentContract: bishoyGendiContentContract,
})

// Content contract export
export { bishoyGendiContentContract } from './content-contract'

// Export sample content for dev preview
export { bishoyGendiSampleContent } from './sample-content'
