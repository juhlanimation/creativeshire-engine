/**
 * FixedNav chrome pattern metadata for platform UI.
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
    siteTitle: {
      type: 'text',
      label: 'Site Title',
      default: '',
      description: 'Text displayed in the header',
      validation: { maxLength: 100 },
      group: 'Brand',
      bindable: true,
    },
    navLinks: {
      type: 'custom',
      label: 'Navigation Links',
      default: [],
      description: 'Links displayed in the header navigation',
      group: 'Navigation',
      bindable: true,
    },
    logo: {
      type: 'text',
      label: 'Logo URL',
      default: '',
      description: 'Optional logo image URL',
      validation: { maxLength: 2048 },
      group: 'Brand',
      bindable: true,
    },
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
