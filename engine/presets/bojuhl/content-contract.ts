/**
 * Bojuhl Preset Content Contract
 *
 * Declares ALL CMS fields the bojuhl preset reads.
 * Each sourceField.path matches a {{ content.xxx }} binding expression in the
 * preset templates exactly — no preprocessor needed.
 *
 * Platform uses this to:
 * 1. Seed the database with default values when a site is created
 * 2. Build CMS editor forms grouped by section
 * 3. Validate that required fields are populated
 */

import type { ContentContract } from '../types'

export const bojuhlContentContract: ContentContract = {
  sections: [
    { id: 'intro', label: 'Intro', description: 'Intro sequence configuration' },
    { id: 'head', label: 'Head', description: 'Page title and meta description' },
    { id: 'hero', label: 'Hero', description: 'Hero section with video and role titles' },
    { id: 'about', label: 'About', description: 'Biography, photo, and client logos' },
    { id: 'projects', label: 'Projects', description: 'Featured and other projects' },
    { id: 'footer', label: 'Footer', description: 'Navigation, contact, and studio info' },
    { id: 'contact', label: 'Contact', description: 'Contact prompt overlay' },
  ],

  sourceFields: [
    // ── Intro ──────────────────────────────────────────────────────────
    {
      path: 'intro.maskText',
      type: 'text',
      label: 'Intro Mask Text',
      section: 'intro',
      required: true,
      default: 'BO JUHL',
    },

    // ── Head ───────────────────────────────────────────────────────────
    {
      path: 'head.title',
      type: 'text',
      label: 'Page Title',
      section: 'head',
      required: true,
      default: 'Bo Juhl | Executive Producer & Editor',
    },
    {
      path: 'head.description',
      type: 'textarea',
      label: 'Meta Description',
      section: 'head',
      required: true,
      default: 'Executive Producer leading animated films and campaigns for Riot Games, Netflix, Supercell, Amazon, and LEGO.',
    },

    // ── Hero ───────────────────────────────────────────────────────────
    {
      path: 'hero.introText',
      type: 'text',
      label: 'Hero Intro Text',
      section: 'hero',
      required: true,
      default: "I'm Bo Juhl",
    },
    {
      path: 'hero.roles',
      type: 'string-list',
      label: 'Role Titles',
      section: 'hero',
      required: true,
      default: ['EXECUTIVE PRODUCER', 'PRODUCER', 'EDITOR'],
    },
    {
      path: 'hero.videoSrc',
      type: 'text',
      label: 'Hero Video URL',
      section: 'hero',
      required: true,
      default: '/videos/frontpage/frontpage.webm',
    },
    {
      path: 'hero.scrollIndicatorText',
      type: 'text',
      label: 'Scroll Indicator Text',
      section: 'hero',
      default: '(SCROLL)',
    },

    // ── About ──────────────────────────────────────────────────────────
    {
      path: 'about.bioParagraphs',
      type: 'textarea',
      label: 'Biography',
      section: 'about',
      required: true,
      placeholder: 'Full biography text (HTML allowed, paragraphs separated by blank lines)',
    },
    {
      path: 'about.signature',
      type: 'text',
      label: 'Signature Name',
      section: 'about',
      default: 'Bo Juhl',
    },
    {
      path: 'about.photoSrc',
      type: 'image',
      label: 'Profile Photo',
      section: 'about',
      required: true,
    },
    {
      path: 'about.photoAlt',
      type: 'text',
      label: 'Profile Photo Alt Text',
      section: 'about',
      required: true,
      placeholder: 'Descriptive alt text for profile photo',
    },
    {
      path: 'about.clientLogos',
      type: 'collection',
      label: 'Client Logos',
      section: 'about',
      itemFields: [
        { path: 'src', type: 'image', label: 'Logo Image', section: 'about', required: true },
        { path: 'alt', type: 'text', label: 'Logo Alt Text', section: 'about', required: true },
        { path: 'name', type: 'text', label: 'Client Name', section: 'about' },
        { path: 'height', type: 'number', label: 'Display Height (px)', section: 'about' },
      ],
    },

    // ── Projects ───────────────────────────────────────────────────────
    {
      path: 'projects.featured',
      type: 'collection',
      label: 'Featured Projects',
      section: 'projects',
      required: true,
      itemFields: [
        { path: 'id', type: 'text', label: 'Project ID', section: 'projects', required: true },
        { path: 'title', type: 'text', label: 'Title', section: 'projects', required: true },
        { path: 'description', type: 'textarea', label: 'Description', section: 'projects' },
        { path: 'role', type: 'text', label: 'Role', section: 'projects', required: true },
        { path: 'year', type: 'text', label: 'Year', section: 'projects', required: true },
        { path: 'client', type: 'text', label: 'Client', section: 'projects' },
        { path: 'studio', type: 'text', label: 'Studio', section: 'projects' },
        { path: 'thumbnailSrc', type: 'image', label: 'Thumbnail', section: 'projects', required: true },
        { path: 'thumbnailAlt', type: 'text', label: 'Thumbnail Alt Text', section: 'projects' },
        { path: 'videoSrc', type: 'text', label: 'Hover Preview Video URL', section: 'projects' },
        { path: 'videoUrl', type: 'text', label: 'Full Video URL', section: 'projects' },
      ],
    },
    {
      path: 'projects.other',
      type: 'collection',
      label: 'Other Projects',
      section: 'projects',
      itemFields: [
        { path: 'id', type: 'text', label: 'Project ID', section: 'projects', required: true },
        { path: 'title', type: 'text', label: 'Title', section: 'projects', required: true },
        { path: 'description', type: 'textarea', label: 'Description', section: 'projects' },
        { path: 'role', type: 'text', label: 'Role', section: 'projects', required: true },
        { path: 'year', type: 'text', label: 'Year', section: 'projects', required: true },
        { path: 'client', type: 'text', label: 'Client', section: 'projects' },
        { path: 'studio', type: 'text', label: 'Studio', section: 'projects' },
        { path: 'thumbnailSrc', type: 'image', label: 'Thumbnail', section: 'projects', required: true },
        { path: 'thumbnailAlt', type: 'text', label: 'Thumbnail Alt Text', section: 'projects' },
        { path: 'videoSrc', type: 'text', label: 'Hover Preview Video URL', section: 'projects' },
        { path: 'videoUrl', type: 'text', label: 'Full Video URL', section: 'projects' },
      ],
    },
    {
      path: 'projects.otherHeading',
      type: 'text',
      label: 'Other Projects Heading',
      section: 'projects',
      default: 'OTHER SELECTED PROJECTS',
    },
    {
      path: 'projects.yearRange',
      type: 'text',
      label: 'Year Range',
      section: 'projects',
      default: '2018-2024',
    },

    // ── Footer ─────────────────────────────────────────────────────────
    {
      path: 'footer.navLinks',
      type: 'collection',
      label: 'Footer Navigation Links',
      section: 'footer',
      itemFields: [
        { path: 'label', type: 'text', label: 'Label', section: 'footer', required: true },
        { path: 'href', type: 'text', label: 'Link Target', section: 'footer', required: true },
      ],
    },
    {
      path: 'footer.contactHeading',
      type: 'text',
      label: 'Contact Heading',
      section: 'footer',
      default: 'GET IN TOUCH',
    },
    {
      path: 'footer.email',
      type: 'text',
      label: 'Contact Email',
      section: 'footer',
      required: true,
      placeholder: 'hello@example.com',
    },
    {
      path: 'footer.linkedinUrl',
      type: 'text',
      label: 'LinkedIn URL',
      section: 'footer',
      placeholder: 'https://linkedin.com/in/yourname',
    },
    {
      path: 'footer.studioHeading',
      type: 'text',
      label: 'Studio Heading',
      section: 'footer',
      default: 'FIND MY STUDIO',
    },
    {
      path: 'footer.studioUrl',
      type: 'text',
      label: 'Studio Website URL',
      section: 'footer',
      placeholder: 'https://yourstudio.com',
    },
    {
      path: 'footer.studioUrlLabel',
      type: 'text',
      label: 'Studio URL Display Label',
      section: 'footer',
      placeholder: 'yourstudio.com',
    },
    {
      path: 'footer.studioEmail',
      type: 'text',
      label: 'Studio Email',
      section: 'footer',
      placeholder: 'hello@yourstudio.com',
    },
    {
      path: 'footer.studioSocials',
      type: 'collection',
      label: 'Studio Social Links',
      section: 'footer',
      itemFields: [
        { path: 'platform', type: 'text', label: 'Platform', section: 'footer', required: true },
        { path: 'url', type: 'text', label: 'URL', section: 'footer', required: true },
      ],
    },
    {
      path: 'footer.copyright',
      type: 'text',
      label: 'Copyright Text',
      section: 'footer',
      placeholder: 'Copyright \u00a9 Your Name / All rights reserved',
    },

    // ── Contact ────────────────────────────────────────────────────────
    {
      path: 'contact.promptText',
      type: 'text',
      label: 'Contact Prompt Text',
      section: 'contact',
      required: true,
      default: 'How can I help you?',
    },
    {
      path: 'contact.email',
      type: 'text',
      label: 'Contact Email',
      section: 'contact',
      required: true,
      placeholder: 'hello@example.com',
    },
  ],
}
