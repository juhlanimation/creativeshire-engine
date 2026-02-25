/**
 * Prism Preset Content Contract
 *
 * Declares every CMS source field the prism preset reads.
 * Each sourceField.path EXACTLY matches a {{ content.xxx }} binding
 * expression found in the preset's page templates and site config.
 * The platform uses this contract to seed the database and build CMS forms.
 *
 * Nested object paths (e.g. azukiElementals.logo.src) are declared as
 * separate leaf-level source fields rather than a single composite field.
 */

import type { ContentContract } from '../types'

export const prismContentContract: ContentContract = {
  sections: [
{ id: 'head', label: 'Head', description: 'Page metadata for SEO' },
    { id: 'contact', label: 'Contact', description: 'Global contact info used across sections' },
    { id: 'showreel', label: 'Showreel', description: 'Fullscreen video showreel' },
    { id: 'about', label: 'About', description: 'About card overlay on video' },
    { id: 'azukiElementals', label: 'Azuki Elementals', description: 'ProjectGallery section' },
    { id: 'boyMoleFoxHorse', label: 'Boy Mole Fox Horse', description: 'ProjectShowcase with shot indicator' },
    { id: 'the21', label: 'THE 21', description: 'ProjectCompare with before/after wipe' },
    { id: 'clashRoyale', label: 'Clash Royale', description: 'ProjectVideoGrid section' },
    { id: 'riotGames', label: 'Riot Games', description: 'ProjectExpand with expandable thumbnails' },
    { id: 'projectsILike', label: 'Projects I Like', description: 'ProjectTabs with categorized collections' },
  ],

  sourceFields: [
    // ── Head ───────────────────────────────────────────────────────────────
    { path: 'head.title', type: 'text', label: 'Page Title', section: 'head', required: true, default: 'Jordan Rivera | Character Animator' },
    { path: 'head.description', type: 'textarea', label: 'Meta Description', section: 'head', required: true, default: 'Senior character animator based in London, UK. 16 years of experience in animation.' },

    // ── Contact ────────────────────────────────────────────────────────────
    { path: 'contact.email', type: 'text', label: 'Email', section: 'contact', required: true, placeholder: 'hello@example.com' },
    { path: 'contact.instagram', type: 'text', label: 'Instagram URL', section: 'contact', placeholder: 'https://instagram.com/username' },
    { path: 'contact.linkedin', type: 'text', label: 'LinkedIn URL', section: 'contact', placeholder: 'https://linkedin.com/in/username' },
    { path: 'contact.displayName', type: 'text', label: 'Display Name', section: 'contact', default: 'Jordan Rivera' },

    // ── Showreel ───────────────────────────────────────────────────────────
    { path: 'showreel.videoSrc', type: 'text', label: 'Showreel Video URL', section: 'showreel', required: true },
    { path: 'showreel.videoPoster', type: 'image', label: 'Showreel Poster', section: 'showreel' },
    { path: 'showreel.posterTime', type: 'number', label: 'Poster Frame Time (s)', section: 'showreel', default: 3 },

    // ── About ─────────────────────────────────────────────────────────────
    { path: 'about.label', type: 'text', label: 'About Label', section: 'about', default: 'HEY, I AM' },
    { path: 'about.videoSrc', type: 'text', label: 'Background Video URL', section: 'about' },
    { path: 'about.name', type: 'text', label: 'Full Name', section: 'about', required: true, default: 'Jordan Rivera' },
    { path: 'about.title', type: 'text', label: 'Professional Title', section: 'about', required: true, default: 'Senior Character Animator' },
    { path: 'about.location', type: 'text', label: 'Location', section: 'about', default: 'London, UK' },
    { path: 'about.bio', type: 'textarea', label: 'Biography (HTML)', section: 'about', required: true, default: 'With 16 years of experience in the animation industry, I have had the privilege of working on a diverse range of projects — from feature films and television series to commercials and video games.' },

    // ── Azuki Elementals ───────────────────────────────────────────────────
    { path: 'azukiElementals.backgroundColor', type: 'text', label: 'Background Color', section: 'azukiElementals', default: '#C03540' },
    { path: 'azukiElementals.logo.src', type: 'image', label: 'Logo Image', section: 'azukiElementals', required: true },
    { path: 'azukiElementals.logo.alt', type: 'text', label: 'Logo Alt Text', section: 'azukiElementals', default: 'Azuki' },
    { path: 'azukiElementals.logo.width', type: 'number', label: 'Logo Width', section: 'azukiElementals', default: 300 },
    { path: 'azukiElementals.logo.filter', type: 'text', label: 'Logo CSS Filter', section: 'azukiElementals', default: 'brightness(0) invert(1)' },
    { path: 'azukiElementals.accentColor', type: 'text', label: 'Accent Color', section: 'azukiElementals', default: 'accent' },
    { path: 'azukiElementals.mainVideo.src', type: 'text', label: 'Main Video URL', section: 'azukiElementals', required: true },
    { path: 'azukiElementals.mainVideo.poster', type: 'image', label: 'Main Video Poster', section: 'azukiElementals' },
    { path: 'azukiElementals.mainVideo.posterTime', type: 'number', label: 'Main Video Poster Time (s)', section: 'azukiElementals', default: 4 },
    {
      path: 'azukiElementals.projects',
      type: 'collection',
      label: 'Gallery Projects',
      section: 'azukiElementals',
      required: true,
      itemFields: [
        { path: 'thumbnail', type: 'image', label: 'Thumbnail', section: 'azukiElementals', required: true },
        { path: 'title', type: 'text', label: 'Title', section: 'azukiElementals', required: true },
        { path: 'video', type: 'text', label: 'Preview Video URL', section: 'azukiElementals' },
        { path: 'year', type: 'text', label: 'Year', section: 'azukiElementals' },
        { path: 'studio', type: 'text', label: 'Studio', section: 'azukiElementals' },
        { path: 'role', type: 'text', label: 'Role', section: 'azukiElementals' },
        { path: 'posterTime', type: 'number', label: 'Thumbnail Frame Time (s)', section: 'azukiElementals' },
      ],
    },

    // ── Boy Mole Fox Horse ─────────────────────────────────────────────────
    { path: 'boyMoleFoxHorse.backgroundColor', type: 'text', label: 'Background Color', section: 'boyMoleFoxHorse', default: '#FAF6ED' },
    { path: 'boyMoleFoxHorse.logo.src', type: 'image', label: 'Logo Image', section: 'boyMoleFoxHorse', required: true },
    { path: 'boyMoleFoxHorse.logo.alt', type: 'text', label: 'Logo Alt Text', section: 'boyMoleFoxHorse', default: 'The Boy, the Mole, the Fox and the Horse' },
    { path: 'boyMoleFoxHorse.logo.width', type: 'number', label: 'Logo Width', section: 'boyMoleFoxHorse', default: 300 },
    { path: 'boyMoleFoxHorse.studio', type: 'text', label: 'Studio', section: 'boyMoleFoxHorse', required: true, default: 'WellHello Productions' },
    { path: 'boyMoleFoxHorse.role', type: 'text', label: 'Role', section: 'boyMoleFoxHorse', required: true, default: 'Character Animator' },
    { path: 'boyMoleFoxHorse.videoSrc', type: 'text', label: 'Main Video URL', section: 'boyMoleFoxHorse', required: true },
    { path: 'boyMoleFoxHorse.videoPoster', type: 'image', label: 'Video Poster', section: 'boyMoleFoxHorse' },
    { path: 'boyMoleFoxHorse.posterTime', type: 'number', label: 'Poster Frame Time (s)', section: 'boyMoleFoxHorse', default: 5 },
    {
      path: 'boyMoleFoxHorse.shots',
      type: 'collection',
      label: 'Shot Markers',
      section: 'boyMoleFoxHorse',
      itemFields: [
        { path: 'frame', type: 'number', label: 'Frame Number', section: 'boyMoleFoxHorse', required: true },
        { path: 'videoSrc', type: 'text', label: 'Shot Video URL', section: 'boyMoleFoxHorse' },
      ],
    },

    // ── THE 21 ─────────────────────────────────────────────────────────────
    { path: 'the21.backgroundColor', type: 'text', label: 'Background Color', section: 'the21', default: '#3B3D2E' },
    { path: 'the21.logo.src', type: 'image', label: 'Logo Image', section: 'the21', required: true },
    { path: 'the21.logo.alt', type: 'text', label: 'Logo Alt Text', section: 'the21', default: 'The 21' },
    { path: 'the21.logo.width', type: 'number', label: 'Logo Width', section: 'the21', default: 120 },
    { path: 'the21.studio', type: 'text', label: 'Studio', section: 'the21', default: 'WellHello Productions' },
    { path: 'the21.role', type: 'text', label: 'Role', section: 'the21', default: 'Character Animator' },
    { path: 'the21.beforeVideo', type: 'text', label: 'Before Video URL', section: 'the21', required: true },
    { path: 'the21.afterVideo', type: 'text', label: 'After Video URL', section: 'the21', required: true },
    { path: 'the21.beforeLabel', type: 'text', label: 'Before Label', section: 'the21', default: 'Final' },
    { path: 'the21.afterLabel', type: 'text', label: 'After Label', section: 'the21', default: 'Tiedown' },
    { path: 'the21.videoBackground', type: 'text', label: 'Video Frame Color', section: 'the21', default: '#232416' },
    { path: 'the21.description', type: 'textarea', label: 'Description (HTML)', section: 'the21', default: 'The 21 is an animated film inspired by neo-Coptic iconography.' },
    { path: 'the21.contentBackground', type: 'text', label: 'Content Area Background', section: 'the21', default: '#3B3D2E' },
    { path: 'the21.descriptionColor', type: 'text', label: 'Description Text Color', section: 'the21', default: '#FDF9F0' },

    // ── Clash Royale ───────────────────────────────────────────────────────
    { path: 'clashRoyale.backgroundColor', type: 'text', label: 'Background Color', section: 'clashRoyale', default: '#000000' },
    { path: 'clashRoyale.logo.src', type: 'image', label: 'Logo Image', section: 'clashRoyale', required: true },
    { path: 'clashRoyale.logo.alt', type: 'text', label: 'Logo Alt Text', section: 'clashRoyale', default: 'Supercell' },
    { path: 'clashRoyale.logo.width', type: 'number', label: 'Logo Width', section: 'clashRoyale', default: 200 },
    {
      path: 'clashRoyale.videos',
      type: 'collection',
      label: 'Video Grid',
      section: 'clashRoyale',
      required: true,
      itemFields: [
        { path: 'src', type: 'text', label: 'Video URL', section: 'clashRoyale', required: true },
        { path: 'title', type: 'text', label: 'Video Title', section: 'clashRoyale', required: true },
        { path: 'aspectRatio', type: 'text', label: 'Aspect Ratio', section: 'clashRoyale', required: true },
        { path: 'poster', type: 'image', label: 'Thumbnail', section: 'clashRoyale' },
        { path: 'posterTime', type: 'number', label: 'Poster Frame Time (s)', section: 'clashRoyale' },
      ],
    },

    // ── Riot Games ─────────────────────────────────────────────────────────
    { path: 'riotGames.backgroundColor', type: 'text', label: 'Background Color', section: 'riotGames', default: '#0B0A0A' },
    { path: 'riotGames.logo.src', type: 'image', label: 'Logo Image', section: 'riotGames', required: true },
    { path: 'riotGames.logo.alt', type: 'text', label: 'Logo Alt Text', section: 'riotGames', default: 'Riot Games' },
    { path: 'riotGames.logo.width', type: 'number', label: 'Logo Width', section: 'riotGames', default: 120 },
    {
      path: 'riotGames.videos',
      type: 'collection',
      label: 'Expandable Videos',
      section: 'riotGames',
      required: true,
      itemFields: [
        { path: 'thumbnailSrc', type: 'image', label: 'Thumbnail', section: 'riotGames', required: true },
        { path: 'thumbnailAlt', type: 'text', label: 'Thumbnail Alt Text', section: 'riotGames' },
        { path: 'videoSrc', type: 'text', label: 'Video URL', section: 'riotGames', required: true },
        { path: 'title', type: 'text', label: 'Video Title', section: 'riotGames', required: true },
      ],
    },

    // ── Projects I Like ────────────────────────────────────────────────────
    { path: 'projectsILike.backgroundColor', type: 'text', label: 'Background Color', section: 'projectsILike', default: '#000000' },
    { path: 'projectsILike.defaultTab', type: 'text', label: 'Default Tab ID', section: 'projectsILike', default: 'ldr' },
    {
      path: 'projectsILike.tabs',
      type: 'collection',
      label: 'Tabs',
      section: 'projectsILike',
      required: true,
      itemFields: [
        { path: 'id', type: 'text', label: 'Tab ID', section: 'projectsILike', required: true, hidden: true },
        { path: 'label', type: 'text', label: 'Tab Label', section: 'projectsILike', required: true },
        {
          path: 'videos',
          type: 'collection',
          label: 'Tab Videos',
          section: 'projectsILike',
          itemFields: [
            { path: 'src', type: 'text', label: 'Video URL', section: 'projectsILike', required: true },
            { path: 'title', type: 'text', label: 'Video Title', section: 'projectsILike', required: true },
          ],
        },
      ],
    },
    { path: 'projectsILike.externalLink.url', type: 'text', label: 'External Link URL', section: 'projectsILike' },
    { path: 'projectsILike.externalLink.label', type: 'text', label: 'External Link Label', section: 'projectsILike', default: 'See more on Instagram' },
  ],
}
