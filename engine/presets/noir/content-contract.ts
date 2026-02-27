/**
 * Noir Preset Content Contract
 *
 * Thin aggregation: imports section and chrome content declarations
 * and builds the contract via buildContentContract(). Site-level fields
 * (head, contact) are declared inline.
 */

import { buildContentContract } from '../content-utils'
import { content as heroVideoContent } from '../../content/sections/patterns/HeroVideo/content'
import { content as aboutBioContent } from '../../content/sections/patterns/AboutBio/content'
import { content as projectFeaturedContent } from '../../content/sections/patterns/ProjectFeatured/content'
import { content as contactFooterContent } from '../../content/chrome/patterns/ContactFooter/content'

export const noirContentContract = buildContentContract({
  // ── Site-level (inline) ───────────────────────────────────────────────
  head: {
    label: 'Head',
    description: 'Page title and meta description',
    contentFields: [
      { path: 'title', type: 'text', label: 'Page Title', required: true, default: 'Alex Morgan | Creative Director & Producer' },
      { path: 'description', type: 'textarea', label: 'Meta Description', required: true, default: 'Creative Director leading animated films and campaigns for leading studios and brands.' },
    ],
    sampleContent: { title: 'Alex Morgan | Creative Director & Producer', description: 'Creative Director leading animated films and campaigns for leading studios and brands.' },
  },
  header: {
    label: 'Header',
    description: 'Header brand and navigation',
    contentFields: [
      { path: 'brandName', type: 'text', label: 'Brand Name', required: true, default: 'PORT12' },
    ],
    sampleContent: { brandName: 'PORT12' },
  },

  // ── Section-level (imported from section content.ts) ──────────────────
  hero: { ...heroVideoContent, label: 'Hero', description: 'Hero section with video and role titles' },
  about: { ...aboutBioContent, label: 'About', description: 'Biography, photo, and client logos' },
  projects: { ...projectFeaturedContent, label: 'Projects', description: 'Featured and other projects' },

  // ── Chrome-level (imported from chrome content.ts) ────────────────────
  footer: { ...contactFooterContent, label: 'Footer', description: 'Navigation, contact, and studio info' },

  // ── Site-level (inline) ───────────────────────────────────────────────
  contact: {
    label: 'Contact',
    description: 'Contact prompt overlay',
    contentFields: [
      { path: 'label', type: 'text', label: 'Contact Label', required: true, default: 'How can I help you?' },
      { path: 'email', type: 'text', label: 'Contact Email', required: true, placeholder: 'hello@example.com' },
    ],
    sampleContent: { label: 'How can I help you?', email: 'hello@example.com' },
  },
})
