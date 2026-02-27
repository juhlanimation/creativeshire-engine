/**
 * FixedNav chrome pattern metadata for platform UI.
 *
 * Content fields (siteTitle, navLinks, logo) live in content.ts.
 */

import { defineChromeMeta } from '../../../../schema/meta'
import type { FixedNavProps } from './types'

export const meta = defineChromeMeta<FixedNavProps>({
  id: 'FixedNav',
  name: 'Fixed Navigation',
  description: 'Fixed header with site title, logo, and navigation links',
  category: 'chrome-pattern',
  chromeSlot: 'header',
  icon: 'header',
  tags: ['chrome', 'header', 'navigation', 'fixed'],
  component: false,

  settings: {
    background: {
      type: 'color',
      label: 'Background',
      default: 'rgba(255, 255, 255, 0.95)',
      description: 'Header background color',
      group: 'Style',
    },
    color: {
      type: 'color',
      label: 'Text Color',
      default: '#000000',
      description: 'Header text color',
      group: 'Style',
    },
  },
})
