/**
 * Page schema metadata for platform UI.
 * Exposes PageSchema fields as configurable settings in the CMS editor.
 */

import { defineMeta } from './meta'

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
      validation: { required: true },
      group: 'Route',
    },

    // ── SEO ────────────────────────────────────────────────────────────────
    'head.title': {
      type: 'text',
      label: 'Page Title',
      default: '',
      description: 'Document title displayed in browser tab and search results',
      validation: { required: true },
      group: 'SEO',
    },
    'head.description': {
      type: 'textarea',
      label: 'Meta Description',
      default: '',
      description: 'Meta description for search engine results',
      group: 'SEO',
    },
    'head.canonical': {
      type: 'text',
      label: 'Canonical URL',
      default: '',
      description: 'Canonical URL to prevent duplicate content issues',
      group: 'SEO',
    },

    // ── Open Graph ─────────────────────────────────────────────────────────
    'head.ogTitle': {
      type: 'text',
      label: 'OG Title',
      default: '',
      description: 'Open Graph title for social sharing (falls back to page title)',
      group: 'Open Graph',
    },
    'head.ogDescription': {
      type: 'textarea',
      label: 'OG Description',
      default: '',
      description: 'Open Graph description for social sharing',
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
