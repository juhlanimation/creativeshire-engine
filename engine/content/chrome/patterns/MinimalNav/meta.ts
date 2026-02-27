/**
 * MinimalNav chrome pattern metadata for platform UI.
 *
 * Content fields (navLinks, email) live in content.ts.
 */

import { defineChromeMeta } from '../../../../schema/meta'
import type { MinimalNavProps } from './types'

export const meta = defineChromeMeta<MinimalNavProps>({
  id: 'MinimalNav',
  name: 'Minimal Navigation',
  description: 'Right-aligned header with nav links, divider, and contact email',
  category: 'chrome-pattern',
  chromeSlot: 'header',
  icon: 'header',
  tags: ['chrome', 'header', 'navigation', 'minimal'],
  component: false,

  settings: {
    blendMode: {
      type: 'select',
      label: 'Blend Mode',
      default: 'normal',
      choices: [
        { value: 'normal', label: 'Normal' },
        { value: 'difference', label: 'Difference' },
      ],
      description: 'Mix-blend-mode for automatic contrast against backgrounds',
      group: 'Style',
    },
  },
})
