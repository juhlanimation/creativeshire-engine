/**
 * ScrollRevealBrand chrome pattern metadata for platform UI.
 */

import { defineChromeMeta } from '../../../../schema/meta'
import type { ScrollRevealBrandProps } from './types'

export const meta = defineChromeMeta<ScrollRevealBrandProps>({
  id: 'ScrollRevealBrand',
  name: 'Scroll Reveal Brand',
  description: 'Brand logo that reveals via clip-path animation as content covers the hero section, then sticks in the header.',
  category: 'chrome-pattern',
  chromeSlot: 'header',
  icon: 'text',
  tags: ['chrome', 'header', 'brand', 'logo', 'scroll-reveal'],
  component: false,

  settings: {
    brandName: {
      type: 'text',
      label: 'Brand Name',
      default: '',
      description: 'Brand name text displayed in the header',
      validation: { maxLength: 100 },
      group: 'Content',
      bindable: true,
    },
    progressVar: {
      type: 'text',
      label: 'Progress CSS Variable',
      default: '--hero-cover-progress',
      description: 'CSS custom property for cover progress (0-100)',
      validation: { maxLength: 100 },
      group: 'Advanced',
    },
    contentEdgeVar: {
      type: 'text',
      label: 'Content Edge CSS Variable',
      default: '--hero-content-edge',
      description: 'CSS custom property for content edge position (px)',
      validation: { maxLength: 100 },
      group: 'Advanced',
    },
  },
})
