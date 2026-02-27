/**
 * Test Multipage Preset Content Contract
 *
 * Thin aggregation via buildContentContract(). All fields are site-level
 * (no section patterns to import from) so declarations are inline.
 */

import { buildContentContract } from '../content-utils'

export const testMultipageContentContract = buildContentContract({
  head: {
    label: 'Head',
    description: 'Page metadata',
    contentFields: [
      { path: 'siteTitle', type: 'text', label: 'Site Title', required: true, default: 'Test Site', placeholder: 'Test Site' },
    ],
    sampleContent: { siteTitle: 'Test Site' },
  },
  nav: {
    label: 'Navigation',
    description: 'Header navigation links',
    contentFields: [
      {
        path: 'links',
        type: 'collection',
        label: 'Navigation Links',
        required: true,
        itemFields: [
          { path: 'label', type: 'text', label: 'Link Text', required: true },
          { path: 'href', type: 'text', label: 'Link URL', required: true },
        ],
      },
    ],
    sampleContent: {
      links: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
      ],
    },
  },
  home: {
    label: 'Home Page',
    description: 'Home page content',
    contentFields: [
      { path: 'heroTitle', type: 'text', label: 'Hero Title', required: true, default: 'Welcome Home', placeholder: 'Welcome' },
      { path: 'heroSubtitle', type: 'text', label: 'Hero Subtitle', default: 'This is the home page of the test multipage preset', placeholder: 'This is a test site' },
      { path: 'featureTitle', type: 'text', label: 'Feature Title', required: true, default: 'Features', placeholder: 'Features' },
      { path: 'featureText', type: 'textarea', label: 'Feature Text', default: 'Click "About" in the header to test page transitions.', placeholder: 'Some feature content here' },
    ],
    sampleContent: {
      heroTitle: 'Welcome Home',
      heroSubtitle: 'This is the home page of the test multipage preset',
      featureTitle: 'Features',
      featureText: 'Click "About" in the header to test page transitions.',
    },
  },
  about: {
    label: 'About Page',
    description: 'About page content',
    contentFields: [
      { path: 'title', type: 'text', label: 'About Title', required: true, default: 'About Us', placeholder: 'About Us' },
      { path: 'text', type: 'textarea', label: 'About Text', required: true, default: 'This is the about page of the test multipage preset', placeholder: 'Information about the site' },
      { path: 'teamTitle', type: 'text', label: 'Team Title', default: 'Our Team', placeholder: 'Our Team' },
      { path: 'teamText', type: 'textarea', label: 'Team Text', default: 'Click "Home" in the header to test page transitions back.', placeholder: 'Meet the team' },
    ],
    sampleContent: {
      title: 'About Us',
      text: 'This is the about page of the test multipage preset',
      teamTitle: 'Our Team',
      teamText: 'Click "Home" in the header to test page transitions back.',
    },
  },
})
