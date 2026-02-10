/**
 * Port-12 Preset Content Contract
 *
 * Declares every CMS source field the port-12 preset reads.
 * Each sourceField.path EXACTLY matches a {{ content.xxx }} binding
 * expression found in the preset's page templates and chrome config.
 * The platform uses this contract to seed the database and build CMS forms.
 */

import type { ContentContract } from '../types'

export const port12ContentContract: ContentContract = {
  sections: [
    { id: 'hero', label: 'Hero', description: 'Full-screen video hero with title' },
    { id: 'about', label: 'Om PORT12', description: 'About section with scattered photo collage' },
    { id: 'team', label: 'Medlemmer', description: 'Team member video showcase' },
    { id: 'pricing', label: 'Medlemskab', description: 'Membership pricing plans' },
    { id: 'contact', label: 'Kontakt', description: 'Contact information' },
    { id: 'nav', label: 'Navigation', description: 'Site navigation links' },
    { id: 'footer', label: 'Footer', description: 'Footer content' },
  ],

  sourceFields: [
    // ── Hero ───────────────────────────────────────────────────────────────
    { path: 'hero.title', type: 'text', label: 'Title', section: 'hero', required: true, default: 'PORT12' },
    { path: 'hero.tagline', type: 'text', label: 'Tagline', section: 'hero', default: 'DRØM • DEL • SKAB' },
    { path: 'hero.videoSrc', type: 'text', label: 'Hero Video URL', section: 'hero', required: true },
    { path: 'hero.loopStartTime', type: 'number', label: 'Loop Start Time (s)', section: 'hero', default: 3.4 },
    { path: 'hero.textRevealTime', type: 'number', label: 'Text Reveal Time (s)', section: 'hero', default: 3.2 },
    { path: 'hero.scrollIndicatorText', type: 'text', label: 'Scroll Indicator Text', section: 'hero', default: '(SCROLL)' },

    // ── About ─────────────────────────────────────────────────────────────
    { path: 'about.text', type: 'textarea', label: 'About Text', section: 'about', required: true },
    {
      path: 'about.images',
      type: 'collection',
      label: 'About Images',
      section: 'about',
      required: true,
      itemFields: [
        { path: 'src', type: 'image', label: 'Image', section: 'about', required: true },
        { path: 'alt', type: 'text', label: 'Alt Text', section: 'about', default: '' },
      ],
    },

    // ── Team ──────────────────────────────────────────────────────────────
    { path: 'team.labelText', type: 'text', label: 'Team Label', section: 'team', default: 'Vi er' },
    {
      path: 'team.members',
      type: 'collection',
      label: 'Team Members',
      section: 'team',
      required: true,
      itemFields: [
        { path: 'name', type: 'text', label: 'Name', section: 'team', required: true },
        { path: 'videoSrc', type: 'text', label: 'Video URL', section: 'team' },
        { path: 'portfolioUrl', type: 'text', label: 'Portfolio URL', section: 'team' },
      ],
    },

    // ── Pricing ───────────────────────────────────────────────────────────
    { path: 'pricing.priceSubtitle', type: 'text', label: 'Price Subtitle', section: 'pricing', default: 'ex moms / måned' },

    // Flex plan
    { path: 'pricing.flex.name', type: 'text', label: 'Flex Plan Name', section: 'pricing', required: true, default: 'FLEX' },
    { path: 'pricing.flex.price', type: 'text', label: 'Flex Price', section: 'pricing', required: true, default: '1.300 DKK' },
    { path: 'pricing.flex.description', type: 'textarea', label: 'Flex Description', section: 'pricing' },
    { path: 'pricing.flex.illustration', type: 'image', label: 'Flex Illustration', section: 'pricing' },
    {
      path: 'pricing.flex.features',
      type: 'collection',
      label: 'Flex Features',
      section: 'pricing',
      itemFields: [
        { path: 'name', type: 'text', label: 'Feature Name', section: 'pricing', required: true },
        { path: 'icon', type: 'text', label: 'Icon SVG', section: 'pricing', required: true },
      ],
    },

    // All-In plan
    { path: 'pricing.allIn.name', type: 'text', label: 'All-In Plan Name', section: 'pricing', required: true, default: 'ALL-IN' },
    { path: 'pricing.allIn.price', type: 'text', label: 'All-In Price', section: 'pricing', required: true, default: '2.000 DKK' },
    { path: 'pricing.allIn.description', type: 'textarea', label: 'All-In Description', section: 'pricing' },
    { path: 'pricing.allIn.illustration', type: 'image', label: 'All-In Illustration', section: 'pricing' },
    {
      path: 'pricing.allIn.features',
      type: 'collection',
      label: 'All-In Features',
      section: 'pricing',
      itemFields: [
        { path: 'name', type: 'text', label: 'Feature Name', section: 'pricing', required: true },
        { path: 'icon', type: 'text', label: 'Icon SVG', section: 'pricing', required: true },
      ],
    },

    // ── Contact ───────────────────────────────────────────────────────────
    { path: 'contact.title', type: 'text', label: 'Contact Title', section: 'contact', default: 'KONTAKT OS' },
    { path: 'contact.lines', type: 'string-list', label: 'Contact Lines', section: 'contact' },
    { path: 'contact.email', type: 'text', label: 'Email', section: 'contact', required: true },
    { path: 'contact.illustration', type: 'image', label: 'Contact Illustration', section: 'contact' },

    // ── Nav ───────────────────────────────────────────────────────────────
    {
      path: 'nav.links',
      type: 'collection',
      label: 'Navigation Links',
      section: 'nav',
      itemFields: [
        { path: 'href', type: 'text', label: 'Link URL', section: 'nav', required: true },
        { path: 'label', type: 'text', label: 'Link Label', section: 'nav', required: true },
      ],
    },

    // ── Footer ────────────────────────────────────────────────────────────
    { path: 'footer.brandName', type: 'text', label: 'Brand Name', section: 'footer', default: 'PORT12' },
    { path: 'footer.copyright', type: 'text', label: 'Copyright Text', section: 'footer' },
    {
      path: 'footer.navLinks',
      type: 'collection',
      label: 'Footer Nav Links',
      section: 'footer',
      itemFields: [
        { path: 'href', type: 'text', label: 'Link URL', section: 'footer', required: true },
        { path: 'label', type: 'text', label: 'Link Label', section: 'footer', required: true },
      ],
    },
    { path: 'footer.email', type: 'text', label: 'Footer Email', section: 'footer' },
    { path: 'footer.phone', type: 'text', label: 'Phone Number', section: 'footer' },
    { path: 'footer.phoneDisplay', type: 'text', label: 'Phone Display Text', section: 'footer' },
    { path: 'footer.address', type: 'text', label: 'Address', section: 'footer' },
  ],
}
