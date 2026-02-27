/**
 * About section pattern metadata for platform UI.
 *
 * Content fields (bioParagraphs, signature, photoSrc, photoAlt, clientLogos)
 * live in content.ts — NOT here. Typography scales are factory decisions.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import type { AboutBioProps } from './types'

export const meta = defineSectionMeta<AboutBioProps>({
  id: 'AboutBio',
  name: 'About Bio',
  description: 'Bio section with photo background and logo marquee',
  category: 'section',
  sectionCategory: 'about',
  unique: true,
  icon: 'about',
  tags: ['about', 'bio', 'profile', 'marquee'],
  component: false, // Factory function
  ownedFields: ['layout', 'className'],

  settings: {
    invertLogos: {
      type: 'toggle',
      label: 'Invert Logo Colors',
      default: true,
      description: 'Apply inverted color filter to logos (white on dark backgrounds)',
      group: 'Style',
    },
    marqueeDuration: {
      type: 'number',
      label: 'Marquee Duration',
      default: 120,
      description: 'Animation duration in seconds',
      min: 5,
      max: 120,
      step: 5,
      group: 'Marquee',
      advanced: true,
    },
    marqueeOffset: {
      type: 'number',
      label: 'Marquee Vertical Position',
      default: 2,
      description: 'Distance from bottom edge (% of section height). 0 = flush bottom.',
      min: 0,
      max: 20,
      step: 0.5,
      group: 'Marquee',
      advanced: true,
    },

    // Layout internals — preset-only, hidden from CMS UI
    bioMaxWidth: {
      type: 'number',
      label: 'Bio Container Width',
      default: 500,
      description: 'Max width of the bio text container (px)',
      min: 280,
      max: 800,
      step: 10,
      group: 'Layout',
      hidden: true,
    },
    bioOffset: {
      type: 'number',
      label: 'Bio Vertical Offset',
      default: 0,
      description: 'Push bio content down from top (% of section height). 0 = default position.',
      min: 0,
      max: 30,
      step: 0.5,
      group: 'Layout',
      hidden: true,
    },
  },
})
