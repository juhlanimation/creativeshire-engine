/**
 * ContactFooter chrome pattern metadata for platform UI.
 */

import { defineChromeMeta } from '../../../../schema/meta'
import type { ContactFooterProps } from './types'

export const meta = defineChromeMeta<ContactFooterProps>({
  id: 'ContactFooter',
  name: 'Contact Footer',
  description: 'Three-column footer with navigation, contact info, and studio links',
  category: 'chrome-pattern',
  chromeSlot: 'footer',
  icon: 'footer',
  tags: ['chrome', 'footer', 'contact', 'navigation', 'studio'],
  component: false,

  settings: {
    paddingTop: {
      type: 'range',
      label: 'Padding Top',
      default: 2,
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
      default: 5.5,
      min: 0,
      max: 12,
      step: 0.5,
      unit: 'rem',
      description: 'Bottom padding below the content area. 0 uses the theme default.',
      group: 'Spacing',
    },
  },
})
