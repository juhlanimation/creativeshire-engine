/**
 * Loft Preset Content Contract
 *
 * Thin aggregation: imports section and chrome content declarations
 * and builds the contract via buildContentContract(). The pricing and
 * contact sections use custom field layouts, so they are declared inline.
 */

import { buildContentContract } from '../content-utils'
import { content as heroTitleContent } from '../../content/sections/patterns/HeroTitle/content'
import { content as aboutCollageContent } from '../../content/sections/patterns/AboutCollage/content'
import { content as teamShowcaseContent } from '../../content/sections/patterns/TeamShowcase/content'
import { content as brandFooterContent } from '../../content/chrome/patterns/BrandFooter/content'

export const loftContentContract = buildContentContract({
  // ── Site-level (inline) ───────────────────────────────────────────────
  header: {
    label: 'Header',
    description: 'Header brand and navigation',
    contentFields: [
      { path: 'brandName', type: 'text', label: 'Brand Name', required: true, default: 'PORT12' },
    ],
    sampleContent: { brandName: 'PORT12' },
  },

  // ── Section-level (imported from section content.ts) ──────────────────
  hero: { ...heroTitleContent, label: 'Hero', description: 'Full-screen video hero with title' },
  about: { ...aboutCollageContent, label: 'Om PORT12', description: 'About section with scattered photo collage' },
  team: { ...teamShowcaseContent, label: 'Medlemmer', description: 'Team member video showcase' },

  // ── Pricing (custom layout — inline) ──────────────────────────────────
  pricing: {
    label: 'Medlemskab',
    description: 'Membership pricing plans',
    contentFields: [
      { path: 'priceSubtitle', type: 'text', label: 'Price Subtitle', default: 'ex moms / måned' },

      // Flex plan
      { path: 'flex.name', type: 'text', label: 'Flex Plan Name', required: true, default: 'FLEX' },
      { path: 'flex.price', type: 'text', label: 'Flex Price', required: true, default: '1.300 DKK' },
      { path: 'flex.description', type: 'textarea', label: 'Flex Description' },
      { path: 'flex.illustration', type: 'image', label: 'Flex Illustration' },
      {
        path: 'flex.features',
        type: 'collection',
        label: 'Flex Features',
        itemFields: [
          { path: 'name', type: 'text', label: 'Feature Name', required: true },
          { path: 'icon', type: 'text', label: 'Icon SVG', required: true },
        ],
      },

      // All-In plan
      { path: 'allIn.name', type: 'text', label: 'All-In Plan Name', required: true, default: 'ALL-IN' },
      { path: 'allIn.price', type: 'text', label: 'All-In Price', required: true, default: '2.000 DKK' },
      { path: 'allIn.description', type: 'textarea', label: 'All-In Description' },
      { path: 'allIn.illustration', type: 'image', label: 'All-In Illustration' },
      {
        path: 'allIn.features',
        type: 'collection',
        label: 'All-In Features',
        itemFields: [
          { path: 'name', type: 'text', label: 'Feature Name', required: true },
          { path: 'icon', type: 'text', label: 'Icon SVG', required: true },
        ],
      },
    ],
    sampleContent: {
      priceSubtitle: 'ex moms / måned',
      flex: { name: 'FLEX', price: '1.300 DKK' },
      allIn: { name: 'ALL-IN', price: '2.000 DKK' },
    },
  },

  // ── Contact (custom layout — inline) ──────────────────────────────────
  contact: {
    label: 'Kontakt',
    description: 'Contact information',
    contentFields: [
      { path: 'title', type: 'text', label: 'Contact Title', default: 'KONTAKT OS' },
      { path: 'lines', type: 'string-list', label: 'Contact Lines' },
      { path: 'email', type: 'text', label: 'Email', required: true },
      { path: 'illustration', type: 'image', label: 'Contact Illustration' },
    ],
    sampleContent: { title: 'KONTAKT OS', email: 'info@example.com' },
  },

  // ── Navigation (site-level — inline) ──────────────────────────────────
  nav: {
    label: 'Navigation',
    description: 'Site navigation links',
    contentFields: [
      {
        path: 'links',
        type: 'collection',
        label: 'Navigation Links',
        itemFields: [
          { path: 'href', type: 'text', label: 'Link URL', required: true },
          { path: 'label', type: 'text', label: 'Link Label', required: true },
        ],
      },
    ],
    sampleContent: {
      links: [
        { href: '#about', label: 'About' },
        { href: '#team', label: 'Team' },
        { href: '#pricing', label: 'Pricing' },
      ],
    },
  },

  // ── Chrome-level (imported from chrome content.ts) ────────────────────
  footer: { ...brandFooterContent, label: 'Footer', description: 'Footer content' },
})
