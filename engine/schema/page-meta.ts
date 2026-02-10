/**
 * Page schema metadata for platform UI.
 * Exposes PageSchema fields as configurable settings in the CMS editor.
 */

import { defineMeta } from './meta'
import type { SettingsGroup } from './settings'

export const pageMeta = defineMeta<Record<string, unknown>>({
  id: 'Page',
  name: 'Page',
  description: 'Page-level configuration: routing, SEO, Open Graph, and chrome overrides',
  category: 'page',
  icon: 'page',
  tags: ['page', 'seo', 'meta', 'routing'],

  settings: {
    // ── Route ──────────────────────────────────────────────────────────────
    slug: {
      type: 'text',
      label: 'URL Slug',
      default: '',
      description: 'URL path for the page (e.g., "/", "/about", "/work/project-1")',
      validation: { required: true, maxLength: 200, pattern: '^(\\/|[a-z0-9][a-z0-9\\-\\/]*)$', message: 'Slug must start with / or use lowercase letters, numbers, and hyphens' },
      group: 'Route',
    },

    // ── SEO ────────────────────────────────────────────────────────────────
    'head.title': {
      type: 'text',
      label: 'Page Title',
      default: '',
      description: 'Document title displayed in browser tab and search results',
      validation: { required: true, maxLength: 70 },
      group: 'SEO',
    },
    'head.description': {
      type: 'textarea',
      label: 'Meta Description',
      default: '',
      description: 'Meta description for search engine results',
      validation: { maxLength: 5000 },
      group: 'SEO',
    },
    'head.canonical': {
      type: 'text',
      label: 'Canonical URL',
      default: '',
      description: 'Canonical URL to prevent duplicate content issues',
      validation: { maxLength: 2048, pattern: '^(https?:\\/\\/|\\/|#|mailto:)', message: 'Must be a valid URL, path, or anchor' },
      group: 'SEO',
    },

    // ── Open Graph ─────────────────────────────────────────────────────────
    'head.ogTitle': {
      type: 'text',
      label: 'OG Title',
      default: '',
      description: 'Open Graph title for social sharing (falls back to page title)',
      validation: { maxLength: 70 },
      group: 'Open Graph',
    },
    'head.ogDescription': {
      type: 'textarea',
      label: 'OG Description',
      default: '',
      description: 'Open Graph description for social sharing',
      validation: { maxLength: 5000 },
      group: 'Open Graph',
    },
    'head.ogImage': {
      type: 'image',
      label: 'OG Image',
      default: '',
      description: 'Open Graph image for social sharing previews',
      group: 'Open Graph',
    },
    'head.ogUrl': {
      type: 'text',
      label: 'OG URL',
      default: '',
      description: 'Open Graph canonical URL',
      validation: { maxLength: 2048, pattern: '^(https?:\\/\\/|\\/|#|mailto:)', message: 'Must be a valid URL, path, or anchor' },
      group: 'Open Graph',
    },

    // ── Twitter ────────────────────────────────────────────────────────────
    'head.twitterCard': {
      type: 'select',
      label: 'Twitter Card',
      default: 'summary_large_image',
      description: 'Twitter card type for link previews',
      choices: [
        { value: 'summary', label: 'Summary' },
        { value: 'summary_large_image', label: 'Summary Large Image' },
      ],
      group: 'Twitter',
    },
    'head.twitterCreator': {
      type: 'text',
      label: 'Twitter Creator',
      default: '',
      description: 'Twitter handle of the content creator (e.g., "@handle")',
      validation: { maxLength: 16, pattern: '^@?[a-zA-Z0-9_]{1,15}$', message: 'Enter a valid Twitter/X handle (e.g., @handle)' },
      group: 'Twitter',
    },

    // ── Robots ─────────────────────────────────────────────────────────────
    'head.robotsIndex': {
      type: 'toggle',
      label: 'Allow Indexing',
      default: true,
      description: 'Allow search engines to index this page',
      group: 'Robots',
    },
    'head.robotsFollow': {
      type: 'toggle',
      label: 'Allow Link Following',
      default: true,
      description: 'Allow search engines to follow links on this page',
      group: 'Robots',
    },

    // ── Browser ────────────────────────────────────────────────────────────
    'head.themeColor': {
      type: 'color',
      label: 'Theme Color',
      default: '',
      description: 'Browser theme color for mobile address bar',
      group: 'Browser',
    },
    'head.viewport': {
      type: 'text',
      label: 'Viewport',
      default: 'width=device-width, initial-scale=1',
      description: 'Viewport meta tag value',
      validation: { maxLength: 100 },
      advanced: true,
      group: 'Browser',
    },
    'head.icons.icon': {
      type: 'image',
      label: 'Favicon',
      default: '',
      description: 'Page-level favicon override',
      group: 'Browser',
    },
    'head.icons.apple': {
      type: 'image',
      label: 'Apple Touch Icon',
      default: '',
      description: 'Apple touch icon for iOS home screen',
      group: 'Browser',
    },

    // ── Chrome Overrides ───────────────────────────────────────────────────
    'chrome.regions.header': {
      type: 'select',
      label: 'Header',
      default: 'inherit',
      description: 'Header visibility for this page',
      choices: [
        { value: 'inherit', label: 'Inherit from Site' },
        { value: 'hidden', label: 'Hidden' },
      ],
      group: 'Chrome Overrides',
    },
    'chrome.regions.footer': {
      type: 'select',
      label: 'Footer',
      default: 'inherit',
      description: 'Footer visibility for this page',
      choices: [
        { value: 'inherit', label: 'Inherit from Site' },
        { value: 'hidden', label: 'Hidden' },
      ],
      group: 'Chrome Overrides',
    },
  },
})

/** Returns settings config for PageSchema fields. */
export function getPageSettings() {
  return pageMeta.settings!
}

/** Returns group definitions for page settings. */
export function getPageGroups(): SettingsGroup[] {
  return [
    { id: 'Route', label: 'Route', icon: 'link' },
    { id: 'SEO', label: 'SEO', icon: 'search' },
    { id: 'Open Graph', label: 'Open Graph', icon: 'share' },
    { id: 'Twitter', label: 'Twitter', icon: 'twitter' },
    { id: 'Robots', label: 'Robots', icon: 'bot' },
    { id: 'Browser', label: 'Browser', icon: 'globe' },
    { id: 'Chrome Overrides', label: 'Chrome Overrides', icon: 'layout' },
  ]
}
