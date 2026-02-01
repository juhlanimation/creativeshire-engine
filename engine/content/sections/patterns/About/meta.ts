/**
 * About section pattern metadata for platform UI.
 */

import { defineMeta } from '@/engine/schema/meta'
import type { AboutProps } from './types'

export const meta = defineMeta<AboutProps>({
  id: 'About',
  name: 'About Section',
  description: 'Bio section with photo background and logo marquee',
  category: 'section',
  icon: 'about',
  tags: ['about', 'bio', 'profile', 'marquee'],
  component: false, // Factory function

  settings: {
    bioParagraphs: {
      type: 'custom',
      label: 'Bio Paragraphs',
      default: [],
      description: 'Array of bio text paragraphs',
      group: 'Content',
    },
    signature: {
      type: 'text',
      label: 'Signature',
      default: '',
      description: 'Signature text (e.g., name)',
      validation: { required: true },
      group: 'Content',
    },
    photoSrc: {
      type: 'image',
      label: 'Photo',
      default: '',
      description: 'Background photo source',
      validation: { required: true },
      group: 'Media',
    },
    photoAlt: {
      type: 'text',
      label: 'Photo Alt',
      default: '',
      description: 'Accessibility description for photo',
      validation: { required: true },
      group: 'Media',
    },
    clientLogos: {
      type: 'custom',
      label: 'Client Logos',
      default: [],
      description: 'Array of client logos for marquee',
      group: 'Marquee',
    },
    marqueeDuration: {
      type: 'number',
      label: 'Marquee Duration',
      default: 30,
      description: 'Animation duration in seconds',
      min: 5,
      max: 120,
      step: 5,
      group: 'Marquee',
      advanced: true,
    },
  },
})
