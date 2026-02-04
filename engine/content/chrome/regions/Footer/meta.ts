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
      bindable: true,
    },
    contactHeading: {
      type: 'text',
      label: 'Contact Heading',
      default: 'Contact',
      description: 'Heading for contact section',
      group: 'Contact',
      bindable: true,
    },
    contactEmail: {
      type: 'text',
      label: 'Contact Email',
      default: '',
      description: 'Contact email address',
      validation: { required: true },
      group: 'Contact',
      bindable: true,
    },
    contactLinkedin: {
      type: 'text',
      label: 'LinkedIn URL',
      default: '',
      description: 'LinkedIn profile URL',
      group: 'Contact',
      bindable: true,
    },
    studioHeading: {
      type: 'text',
      label: 'Studio Heading',
      default: 'Studio',
      description: 'Heading for studio section',
      group: 'Studio',
      bindable: true,
    },
    studioUrl: {
      type: 'text',
      label: 'Studio Website',
      default: '',
      description: 'Studio website URL',
      group: 'Studio',
      bindable: true,
    },
    studioEmail: {
      type: 'text',
      label: 'Studio Email',
      default: '',
      description: 'Studio email address',
      group: 'Studio',
      bindable: true,
    },
    studioSocials: {
      type: 'custom',
      label: 'Studio Socials',
      default: [],
      description: 'Studio social media links',
      group: 'Studio',
      bindable: true,
    },
    copyrightText: {
      type: 'text',
      label: 'Copyright Text',
      default: '',
      description: 'Copyright notice text',
      validation: { required: true },
      group: 'Legal',
      bindable: true,
    },
  },
})
