/**
 * Test Multipage Preset Content Contract
 *
 * Declares what content structure the test-multipage preset expects.
 * Platform adapters must transform source data to match this contract.
 */

import type { ContentContract } from '../types'

/**
 * Content contract for the test-multipage preset.
 * Documents all binding paths and their expected types.
 */
export const testMultipageContentContract: ContentContract = {
  head: {
    type: 'object',
    description: 'Page metadata for SEO',
    required: true,
    fields: {
      siteTitle: {
        type: 'string',
        description: 'Site title displayed in header',
        required: true,
        example: 'Test Site',
      },
    },
  },

  nav: {
    type: 'object',
    description: 'Navigation configuration',
    required: true,
    fields: {
      links: {
        type: 'object[]',
        description: 'Navigation links in header',
        required: true,
        itemShape: {
          label: { type: 'string', description: 'Link text', required: true },
          href: { type: 'string', description: 'Link URL', required: true },
        },
      },
    },
  },

  home: {
    type: 'object',
    description: 'Home page content',
    required: true,
    fields: {
      heroTitle: {
        type: 'string',
        description: 'Hero section title',
        required: true,
        example: 'Welcome',
      },
      heroSubtitle: {
        type: 'string',
        description: 'Hero section subtitle',
        required: false,
        example: 'This is a test site',
      },
      featureTitle: {
        type: 'string',
        description: 'Feature section title',
        required: true,
        example: 'Features',
      },
      featureText: {
        type: 'string',
        description: 'Feature section text',
        required: false,
        example: 'Some feature content here',
      },
    },
  },

  about: {
    type: 'object',
    description: 'About page content',
    required: true,
    fields: {
      title: {
        type: 'string',
        description: 'About section title',
        required: true,
        example: 'About Us',
      },
      text: {
        type: 'string',
        description: 'About section text',
        required: true,
        example: 'Information about the site',
      },
      teamTitle: {
        type: 'string',
        description: 'Team section title',
        required: false,
        example: 'Our Team',
      },
      teamText: {
        type: 'string',
        description: 'Team section text',
        required: false,
        example: 'Meet the team',
      },
    },
  },
}
