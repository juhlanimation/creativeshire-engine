/**
 * CenteredNav chrome pattern metadata for platform UI.
 *
 * Content fields (brandName, navLinks) live in content.ts.
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

  settings: {},
})
