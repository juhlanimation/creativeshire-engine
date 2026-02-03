/**
 * Footer chrome component metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { FooterProps } from './types'

export const meta = defineMeta<FooterProps>({
  id: 'Footer',
  name: 'Footer',
  description: 'Global site footer with navigation, contact info, and studio links',
  category: 'region',
  icon: 'footer',
  tags: ['chrome', 'footer', 'navigation', 'contact'],
  component: true,

  settings: {
    navLinks: {
      type: 'custom',
      label: 'Navigation Links',
      default: [],
      description: 'Footer navigation links',
      group: 'Navigation',
    },
    contactHeading: {
      type: 'text',
      label: 'Contact Heading',
      default: 'Contact',
      description: 'Heading for contact section',
      group: 'Contact',
    },
    contactEmail: {
      type: 'text',
      label: 'Contact Email',
      default: '',
      description: 'Contact email address',
      validation: { required: true },
      group: 'Contact',
    },
    contactLinkedin: {
      type: 'text',
      label: 'LinkedIn URL',
      default: '',
      description: 'LinkedIn profile URL',
      group: 'Contact',
    },
    studioHeading: {
      type: 'text',
      label: 'Studio Heading',
      default: 'Studio',
      description: 'Heading for studio section',
      group: 'Studio',
    },
    studioUrl: {
      type: 'text',
      label: 'Studio Website',
      default: '',
      description: 'Studio website URL',
      group: 'Studio',
    },
    studioEmail: {
      type: 'text',
      label: 'Studio Email',
      default: '',
      description: 'Studio email address',
      group: 'Studio',
    },
    studioSocials: {
      type: 'custom',
      label: 'Studio Socials',
      default: [],
      description: 'Studio social media links',
      group: 'Studio',
    },
    copyrightText: {
      type: 'text',
      label: 'Copyright Text',
      default: '',
      description: 'Copyright notice text',
      validation: { required: true },
      group: 'Legal',
    },
  },
})
