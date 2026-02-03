/**
 * LogoLink pattern metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { LogoLinkConfig } from './types'

export const meta = defineMeta<LogoLinkConfig>({
  id: 'LogoLink',
  name: 'Logo Link',
  description: 'Logo with hover effects and navigation link',
  category: 'pattern',
  icon: 'logo',
  tags: ['brand', 'navigation', 'header'],
  component: false, // Factory function, not React component

  settings: {
    text: {
      type: 'text',
      label: 'Text',
      default: '',
      description: 'Logo text (if no image)',
    },
    imageSrc: {
      type: 'image',
      label: 'Logo Image',
      default: '',
      description: 'Logo image source (if no text)',
    },
    imageAlt: {
      type: 'text',
      label: 'Image Alt',
      default: 'Logo',
      description: 'Alt text for logo image',
    },
    href: {
      type: 'text',
      label: 'Link URL',
      default: '/',
      description: 'Navigation URL when clicked',
    },
  },
})
