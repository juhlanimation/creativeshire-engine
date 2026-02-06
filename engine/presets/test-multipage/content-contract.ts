/**
 * Test Multipage Preset Content Contract
 *
 * Declares which CMS fields the test-multipage preset reads.
 * Platform auto-generates field definitions from this contract.
 */

import type { ContentContract } from '../types'

/**
 * Content contract for the test-multipage preset.
 */
export const testMultipageContentContract: ContentContract = {
  sections: [
    { id: 'head', label: 'Head', description: 'Page metadata' },
    { id: 'nav', label: 'Navigation', description: 'Header navigation links' },
    { id: 'home', label: 'Home Page', description: 'Home page content' },
    { id: 'about', label: 'About Page', description: 'About page content' },
  ],

  sourceFields: [
    // ── Head ───────────────────────────────────────────────────────────
    { path: 'head.siteTitle', type: 'text', label: 'Site Title', section: 'head', required: true, default: 'Test Site', placeholder: 'Test Site' },

    // ── Nav ────────────────────────────────────────────────────────────
    {
      path: 'nav.links',
      type: 'collection',
      label: 'Navigation Links',
      section: 'nav',
      required: true,
      itemFields: [
        { path: 'label', type: 'text', label: 'Link Text', section: 'nav', required: true },
        { path: 'href', type: 'text', label: 'Link URL', section: 'nav', required: true },
      ],
    },

    // ── Home ───────────────────────────────────────────────────────────
    { path: 'home.heroTitle', type: 'text', label: 'Hero Title', section: 'home', required: true, default: 'Welcome Home', placeholder: 'Welcome' },
    { path: 'home.heroSubtitle', type: 'text', label: 'Hero Subtitle', section: 'home', default: 'This is the home page of the test multipage preset', placeholder: 'This is a test site' },
    { path: 'home.featureTitle', type: 'text', label: 'Feature Title', section: 'home', required: true, default: 'Features', placeholder: 'Features' },
    { path: 'home.featureText', type: 'textarea', label: 'Feature Text', section: 'home', default: 'Click "About" in the header to test page transitions.', placeholder: 'Some feature content here' },

    // ── About ──────────────────────────────────────────────────────────
    { path: 'about.title', type: 'text', label: 'About Title', section: 'about', required: true, default: 'About Us', placeholder: 'About Us' },
    { path: 'about.text', type: 'textarea', label: 'About Text', section: 'about', required: true, default: 'This is the about page of the test multipage preset', placeholder: 'Information about the site' },
    { path: 'about.teamTitle', type: 'text', label: 'Team Title', section: 'about', default: 'Our Team', placeholder: 'Our Team' },
    { path: 'about.teamText', type: 'textarea', label: 'Team Text', section: 'about', default: 'Click "Home" in the header to test page transitions back.', placeholder: 'Meet the team' },
  ],
}
