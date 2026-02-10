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
      validation: { maxLength: 100 },
      bindable: true,
    },
    imageSrc: {
      type: 'image',
      label: 'Logo Image',
      default: '',
      description: 'Logo image source (if no text)',
      bindable: true,
    },
    imageAlt: {
      type: 'text',
      label: 'Image Alt',
      default: 'Logo',
      description: 'Alt text for logo image',
      validation: { maxLength: 200 },
      bindable: true,
    },
    href: {
      type: 'text',
      label: 'Link URL',
      default: '/',
      description: 'Navigation URL when clicked',
      validation: { maxLength: 2048, pattern: '^(https?:\\/\\/|\\/|#|mailto:)', message: 'Must be a valid URL, path, or anchor' },
      bindable: true,
    },
  },
})
