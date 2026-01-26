/**
 * Site schema types.
 * Site is the top-level configuration containing all pages and chrome.
 */

import type { ChromeSchema } from './chrome'
import type { ExperienceConfig } from './experience'

/**
 * Reference to a page with its identifier and slug.
 * Used in site configuration to list available pages.
 */
export interface PageReference {
  /** Page identifier matching PageSchema.id */
  id: string
  /** URL slug matching PageSchema.slug */
  slug: string
}

/**
 * Schema for a site instance.
 * The top-level configuration containing experience, chrome, and page references.
 */
export interface SiteSchema {
  /** Unique identifier for the site */
  id: string
  /** Experience configuration (modes, behaviours) */
  experience: ExperienceConfig
  /** Site-level chrome (header, footer, overlays) */
  chrome: ChromeSchema
  /** List of pages in this site */
  pages: PageReference[]
}
