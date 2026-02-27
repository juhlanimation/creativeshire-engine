import { defineChromeMeta } from '../../../../schema/meta'
import type { HaubjergNavProps } from './types'

export const meta = defineChromeMeta<HaubjergNavProps>({
  id: 'HaubjergNav',
  name: 'Haubjerg Nav',
  description: 'Dark fixed navbar with two-part brand text, desktop nav links, and mobile hamburger menu',
  category: 'chrome-pattern',
  chromeSlot: 'header',
  icon: 'header',
  tags: ['chrome', 'header', 'navigation', 'dark'],
  component: false,
  settings: {},
})
