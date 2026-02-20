/**
 * CenteredNav chrome pattern metadata for platform UI.
 */

import { defineChromeMeta } from '../../../../schema/meta'
import type { CenteredNavProps } from './types'

export const meta = defineChromeMeta<CenteredNavProps>({
  id: 'CenteredNav',
  name: 'Centered Navigation',
  description: 'Centered header with brand name and horizontal navigation links',
  category: 'chrome-pattern',
  chromeSlot: 'header',
  icon: 'header',
  tags: ['chrome', 'header', 'navigation', 'centered'],
  component: false,

  settings: {
    brandName: {
      type: 'text',
      label: 'Brand Name',
      default: '',
      description: 'Brand or site name displayed prominently in the center',
      validation: { maxLength: 100 },
      group: 'Brand',
      bindable: true,
    },
    navLinks: {
      type: 'custom',
      label: 'Navigation Links',
      default: [],
      description: 'Links displayed below the brand name',
      group: 'Navigation',
      bindable: true,
    },
  },
})
