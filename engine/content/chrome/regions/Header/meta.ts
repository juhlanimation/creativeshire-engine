/**
 * Header chrome component metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { HeaderProps } from './types'

export const meta = defineMeta<HeaderProps>({
  id: 'Header',
  name: 'Header',
  description: 'Fixed site header with navigation links',
  category: 'region',
  icon: 'header',
  tags: ['chrome', 'header', 'navigation'],
  component: true,

  settings: {
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
      group: 'Brand',
      bindable: true,
    },
    siteTitle: {
      type: 'text',
      label: 'Site Title',
      default: '',
      description: 'Text displayed next to or instead of logo',
      group: 'Brand',
      bindable: true,
    },
    fixed: {
      type: 'toggle',
      label: 'Fixed Position',
      default: true,
      description: 'Keep header fixed at top of viewport',
      group: 'Layout',
    },
    background: {
      type: 'color',
      label: 'Background',
      default: 'transparent',
      description: 'Header background color',
      group: 'Style',
    },
    color: {
      type: 'color',
      label: 'Text Color',
      default: 'inherit',
      description: 'Header text color',
      group: 'Style',
    },
  },
})
