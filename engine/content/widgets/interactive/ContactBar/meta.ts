/**
 * ContactBar interactive widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { ContactBarProps } from './types'

export const meta = defineMeta<ContactBarProps>({
  id: 'ContactBar',
  name: 'Contact Bar',
  description: 'Social links bar with click-to-copy email support',
  category: 'interactive',
  icon: 'link',
  tags: ['contact', 'social', 'links', 'instagram', 'linkedin', 'email'],
  component: true,

  settings: {
    links: {
      type: 'custom',
      label: 'Social Links',
      default: [],
      description: 'List of social platform links',
      bindable: true,
    },
    iconSize: {
      type: 'number',
      label: 'Icon Size',
      default: 20,
      description: 'Icon size in pixels',
      min: 12,
      max: 48,
    },
    gap: {
      type: 'number',
      label: 'Gap',
      default: 16,
      description: 'Space between icons in pixels',
      min: 4,
      max: 64,
    },
    textColor: {
      type: 'select',
      label: 'Color Scheme',
      default: 'light',
      choices: [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
      ],
      description: 'Icon color scheme for light or dark backgrounds',
    },
  },
})
