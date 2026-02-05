/**
 * Page schema types.
 * Pages contain sections and define document-level metadata.
 */

import type { SectionSchema } from './section'
import type { PageChromeOverrides } from './chrome'
import type { ExperienceConfig } from './experience'

/**
 * Page-level metadata for SEO and document head.
 * Uses flattened structure (no nested objects) for simpler access.
 */
export interface PageHeadSchema {
  /** Page title (required) */
  title: string

  /** Meta description for SEO */
  description?: string
  /** Canonical URL */
  canonical?: string

  /** Open Graph title */
  ogTitle?: string
  /** Open Graph description */
  ogDescription?: string
  /** Open Graph image URL */
  ogImage?: string
  /** Open Graph URL */
  ogUrl?: string

  /** Twitter card type */
  twitterCard?: 'summary' | 'summary_large_image'
  /** Twitter creator handle */
  twitterCreator?: string

  /** Robots index directive */
  robotsIndex?: boolean
  /** Robots follow directive */
  robotsFollow?: boolean

  /** Viewport meta tag value */
  viewport?: string
  /** Theme color for browser UI */
  themeColor?: string
  /** Favicon and Apple touch icon */
  icons?: {
    icon?: string
    apple?: string
  }
}

/**
 * Schema for a page instance.
 * Pages are the primary content containers with sections and metadata.
 */
export interface PageSchema {
  /** Unique identifier for the page */
  id: string
  /** URL slug (e.g., '/', '/about', '/work/project-1') */
  slug: string
  /** Document head metadata */
  head?: PageHeadSchema
  /** Sections contained in this page */
  sections: SectionSchema[]
  /** Chrome overrides for this page */
  chrome?: PageChromeOverrides
  /** Experience override for this page (defaults to site experience) */
  experience?: ExperienceConfig
}
