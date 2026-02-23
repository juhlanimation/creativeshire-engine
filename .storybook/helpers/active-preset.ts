/**
 * Active preset bridge for Storybook stories.
 *
 * Single source of truth: preset sample-content provides demo content,
 * preset page templates provide overrides (colorMode, style).
 * Stories import from here instead of maintaining local preview.ts files.
 *
 * Only patterns used by a preset are listed here.
 * Non-preset patterns keep their own colocated preview.ts.
 */

import { noirSampleContent } from '../../engine/presets/noir/sample-content'
import { loftSampleContent } from '../../engine/presets/loft/sample-content'

/**
 * Per-section preview data derived from the active preset.
 * Content from sample-content + preset overrides (colorMode, style).
 */
export const sectionPreview: Record<string, Record<string, unknown>> = {
  HeroTitle: {
    ...loftSampleContent.hero,
    colorMode: 'light',
  },
  HeroVideo: {
    ...noirSampleContent.hero,
    colorMode: 'dark',
  },
  AboutBio: {
    colorMode: 'dark',
  },
  ProjectFeatured: {
    projects: noirSampleContent.projects.featured,
    colorMode: 'light',
  },
  ProjectStrip: {
    heading: noirSampleContent.projects.otherHeading,
    yearRange: noirSampleContent.projects.yearRange,
    projects: noirSampleContent.projects.other,
    colorMode: 'light',
  },
}

/**
 * Per-chrome-pattern preview data derived from the active preset.
 * Keys match meta settings 1:1 (spread sample-content, rename only where content key differs).
 */
export const chromePreview: Record<string, Record<string, unknown>> = {
  BrandFooter: {
    ...loftSampleContent.footer,
  },
  ContactFooter: {
    ...noirSampleContent.footer,
    // Content uses 'email', meta setting uses 'contactEmail'
    contactEmail: noirSampleContent.footer.email,
  },
}

/** Get preview props for a section or chrome pattern. */
export function getPresetPreview(patternId: string): Record<string, unknown> {
  return sectionPreview[patternId] ?? chromePreview[patternId] ?? {}
}
