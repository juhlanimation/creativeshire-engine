/**
 * LogoMarquee interactive widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { LogoMarqueeProps } from './types'

export const meta = defineMeta<LogoMarqueeProps>({
  id: 'LogoMarquee',
  name: 'Logo Marquee',
  description: 'Horizontal scrolling marquee of client logos',
  category: 'interactive',
  icon: 'marquee',
  tags: ['logos', 'clients', 'marquee', 'animation'],
  component: true,

  settings: {
    logos: {
      type: 'custom',
      label: 'Logos',
      default: [],
      description: 'Array of logo items or binding expression',
      validation: { required: true },
      bindable: true,
    },
    duration: {
      type: 'number',
      label: 'Duration',
      default: 30,
      description: 'Animation duration in seconds',
      bindable: true,
    },
    logoWidth: {
      type: 'number',
      label: 'Logo Width',
      default: 120,
      description: 'Width of each logo in pixels',
      bindable: true,
    },
    logoGap: {
      type: 'number',
      label: 'Logo Gap',
      default: 48,
      description: 'Gap between logos in pixels',
      bindable: true,
    },
  },
})
