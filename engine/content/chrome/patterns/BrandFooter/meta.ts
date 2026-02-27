/**
 * BrandFooter chrome pattern metadata for platform UI.
 *
 * Content fields (brandName, navLinks, email, etc.) live in content.ts.
 * Only style/spacing settings remain here.
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
