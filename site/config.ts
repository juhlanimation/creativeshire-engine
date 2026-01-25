/**
 * Site configuration for Creativeshire.
 * Minimal setup with stacking mode and no chrome.
 */

import type { SiteSchema } from '../creativeshire/schema'

/**
 * Main site configuration.
 * Uses stacking experience mode with minimal chrome setup.
 */
export const siteConfig: SiteSchema = {
  id: 'creativeshire',
  experience: {
    mode: 'stacking'
  },
  chrome: {
    regions: {}
  },
  pages: [
    { id: 'home', slug: '/' }
  ]
}
