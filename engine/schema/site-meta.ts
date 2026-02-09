/**
 * Site metadata schema metadata for platform UI.
 * Exposes SiteMetadata fields as configurable settings in the CMS editor.
 */

import { defineMeta } from './meta'
import type { SettingsGroup } from './settings'

export const siteMetadataMeta = defineMeta<Record<string, unknown>>({
  id: 'SiteMetadata',
  name: 'Site Metadata',
  description: 'Site-level SEO, branding, assets, and technical configuration',
  category: 'page',
  icon: 'globe',
  tags: ['site', 'seo', 'branding', 'metadata'],

  settings: {
    // ── SEO ────────────────────────────────────────────────────────────────
    title: {
      type: 'text',
      label: 'Default Title',
      default: '',
      description: 'Default page title (used when page doesn\'t specify one)',
      group: 'SEO',
    },
    description: {
      type: 'textarea',
      label: 'Default Description',
      default: '',
      description: 'Default meta description for the site',
      group: 'SEO',
    },
    language: {
      type: 'select',
      label: 'Language',
      default: 'en',
      description: 'Site language code',
      choices: [
        { value: 'en', label: 'English' },
        { value: 'da', label: 'Danish' },
        { value: 'de', label: 'German' },
        { value: 'fr', label: 'French' },
        { value: 'es', label: 'Spanish' },
        { value: 'nl', label: 'Dutch' },
        { value: 'sv', label: 'Swedish' },
        { value: 'no', label: 'Norwegian' },
        { value: 'pt', label: 'Portuguese' },
        { value: 'it', label: 'Italian' },
        { value: 'ja', label: 'Japanese' },
        { value: 'ko', label: 'Korean' },
        { value: 'zh', label: 'Chinese' },
      ],
      group: 'SEO',
    },

    // ── Identity ───────────────────────────────────────────────────────────
    name: {
      type: 'text',
      label: 'Site Name',
      default: '',
      description: 'Site or brand name',
      group: 'Identity',
    },
    tagline: {
      type: 'text',
      label: 'Tagline',
      default: '',
      description: 'Short site tagline or slogan',
      group: 'Identity',
    },

    // ── Assets ─────────────────────────────────────────────────────────────
    favicon: {
      type: 'image',
      label: 'Favicon',
      default: '',
      description: 'Site favicon URL',
      group: 'Assets',
    },
    logo: {
      type: 'image',
      label: 'Logo',
      default: '',
      description: 'Site logo URL',
      group: 'Assets',
    },
    logoDark: {
      type: 'image',
      label: 'Logo (Dark)',
      default: '',
      description: 'Dark variant logo URL',
      group: 'Assets',
    },
    ogImage: {
      type: 'image',
      label: 'Default OG Image',
      default: '',
      description: 'Default Open Graph image for social sharing',
      group: 'Assets',
    },

    // ── Technical ──────────────────────────────────────────────────────────
    canonicalDomain: {
      type: 'text',
      label: 'Canonical Domain',
      default: '',
      description: 'Canonical domain (e.g., "example.com")',
      group: 'Technical',
    },
    robots: {
      type: 'select',
      label: 'Robots',
      default: 'index',
      description: 'Search engine indexing directive',
      choices: [
        { value: 'index', label: 'Allow Indexing' },
        { value: 'noindex', label: 'No Indexing' },
      ],
      group: 'Technical',
    },

    // ── Social ─────────────────────────────────────────────────────────────
    twitterHandle: {
      type: 'text',
      label: 'Twitter Handle',
      default: '',
      description: 'Twitter/X handle (e.g., "@handle")',
      group: 'Social',
    },
  },
})

/** Returns settings config for SiteMetadata fields. */
export function getSiteMetadataSettings() {
  return siteMetadataMeta.settings!
}

/** Returns group definitions for site metadata settings. */
export function getSiteMetadataGroups(): SettingsGroup[] {
  return [
    { id: 'SEO', label: 'SEO', icon: 'search' },
    { id: 'Identity', label: 'Identity', icon: 'badge' },
    { id: 'Assets', label: 'Assets', icon: 'image' },
    { id: 'Technical', label: 'Technical', icon: 'settings' },
    { id: 'Social', label: 'Social', icon: 'share' },
  ]
}
