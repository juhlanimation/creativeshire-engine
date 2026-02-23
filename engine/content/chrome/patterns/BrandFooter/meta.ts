/**
 * BrandFooter chrome pattern metadata for platform UI.
 */

import { defineChromeMeta } from '../../../../schema/meta'
import type { BrandFooterProps } from './types'

export const meta = defineChromeMeta<BrandFooterProps>({
  id: 'BrandFooter',
  name: 'Brand Footer',
  description: 'Centered footer with brand name, navigation, and contact columns',
  category: 'chrome-pattern',
  chromeSlot: 'footer',
  icon: 'footer',
  tags: ['chrome', 'footer', 'brand', 'navigation', 'contact'],
  component: false,

  settings: {
    brandName: {
      type: 'text',
      label: 'Brand Name',
      default: '',
      description: 'Brand or site name displayed prominently in the footer',
      validation: { maxLength: 100 },
      group: 'Brand',
      bindable: true,
    },
    navLinks: {
      type: 'custom',
      label: 'Navigation Links',
      default: [],
      description: 'Footer navigation links',
      group: 'Navigation',
      bindable: true,
    },
    email: {
      type: 'text',
      label: 'Contact Email',
      default: '',
      description: 'Contact email address',
      validation: { maxLength: 320, pattern: '^[^@]+@[^@]+\\.[^@]+$', message: 'Please enter a valid email address' },
      group: 'Contact',
      bindable: true,
    },
    phone: {
      type: 'text',
      label: 'Phone Number',
      default: '',
      description: 'Contact phone number (used for tel: link)',
      validation: { maxLength: 50 },
      group: 'Contact',
      bindable: true,
    },
    phoneDisplay: {
      type: 'text',
      label: 'Phone Display',
      default: '',
      description: 'Display text for phone number (e.g. formatted local number). Falls back to phone.',
      validation: { maxLength: 50 },
      group: 'Contact',
      bindable: true,
    },
    address: {
      type: 'text',
      label: 'Address',
      default: '',
      description: 'Physical address or location',
      validation: { maxLength: 200 },
      group: 'Contact',
      bindable: true,
    },
    copyright: {
      type: 'text',
      label: 'Copyright Text',
      default: '',
      description: 'Copyright notice text',
      validation: { maxLength: 200 },
      group: 'Legal',
      bindable: true,
    },
    paddingTop: {
      type: 'range',
      label: 'Padding Top',
      default: 1.5,
      min: 0,
      max: 12,
      step: 0.5,
      unit: 'rem',
      description: 'Top padding above the content area. 0 uses the theme default.',
      group: 'Spacing',
    },
    paddingBottom: {
      type: 'range',
      label: 'Padding Bottom',
      default: 3,
      min: 0,
      max: 12,
      step: 0.5,
      unit: 'rem',
      description: 'Bottom padding below the content area. 0 uses the theme default.',
      group: 'Spacing',
    },
  },
})
