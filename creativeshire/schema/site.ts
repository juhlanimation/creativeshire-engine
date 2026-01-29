/**
 * Site schema types.
 * Site is the top-level configuration containing all pages and chrome.
 */

import type { ChromeSchema } from './chrome'
import type { ExperienceConfig } from './experience'
import type { ThemeSchema } from './theme'

/**
 * Default behaviour assignments for a mode.
 * Specifies which behaviours apply to sections and widgets within the mode.
 */
export interface ModeDefaults {
  /** Default behaviour for sections in this mode */
  section?: string
  /** Default behaviour for widgets in this mode */
  widget?: string
}

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
 * The top-level configuration containing theme, experience, chrome, and page references.
 */
export interface SiteSchema {
  /** Unique identifier for the site */
  id: string
  /** Theme configuration (scrollbar, colors, fonts) */
  theme?: ThemeSchema
  /** Experience configuration (modes, behaviours) */
  experience: ExperienceConfig
  /** Site-level chrome (header, footer, overlays) */
  chrome: ChromeSchema
  /** List of pages in this site */
  pages: PageReference[]
}
