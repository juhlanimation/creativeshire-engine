/**
 * ContactFooter chrome pattern content declaration.
 * Footer with navigation, contact info, and studio links.
 */

import type { SectionContentDeclaration } from '../../../../schema/content-field'

export const content: SectionContentDeclaration = {
  label: 'Contact Footer',
  description: 'Footer with navigation, contact info, and studio links',
  contentFields: [
    {
      path: 'navLinks',
      type: 'collection',
      label: 'Footer Navigation Links',
      itemFields: [
        { path: 'label', type: 'text', label: 'Label', required: true },
        { path: 'href', type: 'text', label: 'Link Target', required: true },
      ],
    },
    { path: 'contactHeading', type: 'text', label: 'Contact Heading', default: 'GET IN TOUCH' },
    { path: 'email', type: 'text', label: 'Contact Email', required: true, placeholder: 'hello@example.com' },
    { path: 'linkedinUrl', type: 'text', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/yourname' },
    { path: 'studioHeading', type: 'text', label: 'Studio Heading', default: 'FIND MY STUDIO' },
    { path: 'studioUrl', type: 'text', label: 'Studio Website URL', placeholder: 'https://yourstudio.com' },
    { path: 'studioUrlLabel', type: 'text', label: 'Studio URL Display Label', placeholder: 'yourstudio.com' },
    { path: 'studioEmail', type: 'text', label: 'Studio Email', placeholder: 'hello@yourstudio.com' },
    {
      path: 'studioSocials',
      type: 'collection',
      label: 'Studio Social Links',
      itemFields: [
        { path: 'platform', type: 'text', label: 'Platform', required: true },
        { path: 'url', type: 'text', label: 'URL', required: true },
      ],
    },
    { path: 'copyright', type: 'text', label: 'Copyright Text', placeholder: 'Copyright \u00a9 Your Name / All rights reserved' },
  ],
  sampleContent: {
    navLinks: [
      { label: 'HOME', href: '#hero' },
      { label: 'ABOUT', href: '#about' },
      { label: 'PROJECTS', href: '#projects' },
    ],
    contactHeading: 'GET IN TOUCH',
    contactEmail: 'hello@example.com',
    linkedinUrl: 'https://linkedin.com/in/example',
    studioHeading: 'FIND MY STUDIO',
    studioUrl: 'https://yourstudio.com',
    studioUrlLabel: 'yourstudio.com',
    studioEmail: 'hello@yourstudio.com',
    studioSocials: [
      { platform: 'linkedin', url: 'https://linkedin.com/company/example' },
      { platform: 'instagram', url: 'https://instagram.com/example' },
    ],
    copyright: 'Copyright \u00a9 Example / All rights reserved',
  },
}
