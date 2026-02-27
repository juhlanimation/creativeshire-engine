/**
 * Site schema types.
 * Site is the top-level configuration containing all pages and chrome.
 */

import type { ChromeSchema } from './chrome'
import type { ExperienceConfig } from './experience'
import type { PageSchema } from './page'
import type { ThemeSchema } from './theme'

// =============================================================================
// Site Metadata
// =============================================================================

/**
 * Site-level metadata for SEO, branding, and technical configuration.
 * Asset fields are URLs (platform handles upload to storage).
 */
export interface SiteMetadata {
  // SEO
  /** Default page title (used when page doesn't specify one) */
  title?: string
  /** Default meta description */
  description?: string
  /** Language code (e.g., "en", "da") */
  language?: string

  // Identity
  /** Site/brand name */
  name?: string
  /** Short tagline */
  tagline?: string

  // Assets (URLs to storage)
  /** URL to favicon */
  favicon?: string
  /** URL to default Open Graph image */
  ogImage?: string

  // Technical
  /** Canonical domain (e.g., "example.com") */
  canonicalDomain?: string
  /** Search engine indexing directive */
  robots?: 'index' | 'noindex'

  // Social
  /** Twitter/X handle (e.g., "@username") */
  twitterHandle?: string
}

// =============================================================================
// Page Reference
// =============================================================================

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

  /**
   * Schema version this site was created with.
   * Format: "major.minor.patch" (e.g., "2.0.0")
   *
   * If omitted, site is assumed to be created with current engine version.
   * Build-time validation will warn about missing version.
   */
  schemaVersion?: string

  /** Site metadata (SEO, branding, assets) */
  metadata?: SiteMetadata
  /** Theme configuration (scrollbar, colors, fonts) */
  theme?: ThemeSchema
  /** Experience configuration (modes, behaviours, intro, transition) */
  experience?: ExperienceConfig
  /** Site-level chrome (header, footer, overlays) */
  chrome: ChromeSchema
  /** List of pages in this site */
  pages: PageReference[]
}

/**
 * Fully assembled schema combining site configuration with page content.
 * This is the unified format the engine receives for rendering.
 *
 * Platforms assemble this from their storage (e.g., joining site + pages tables).
 * The engine doesn't know how data is stored—it just receives this unified schema.
 */
export interface FullSchema {
  /** Site configuration (theme, chrome, experience, page references) */
  site: SiteSchema
  /** Full page content (sections, widgets, head metadata) */
  pages: PageSchema[]
}
