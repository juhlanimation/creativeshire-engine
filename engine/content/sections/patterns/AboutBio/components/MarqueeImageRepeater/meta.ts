/**
 * MarqueeImageRepeater widget metadata for platform UI.
 */

import { defineMeta } from '../../../../../../schema/meta'
import type { MarqueeImageRepeaterProps } from './types'

export const meta = defineMeta<MarqueeImageRepeaterProps>({
  id: 'MarqueeImageRepeater',
  name: 'Marquee Image Repeater',
  description: 'Converts image data into a scrolling marquee of images. Supports binding expressions.',
  category: 'repeater',
  icon: 'marquee',
  tags: ['logos', 'clients', 'marquee', 'repeater'],
  component: true,

  // Content settings (logos) are section-owned.
  // This widget is purely structural — the section factory injects content via props.
  settings: {
    duration: {
      type: 'number',
      label: 'Duration',
      default: 30,
      description: 'Animation duration in seconds',
      min: 1,
      max: 120,
      bindable: true,
    },
    logoWidth: {
      type: 'number',
      label: 'Logo Width',
      default: 120,
      description: 'Width of each logo in pixels',
      min: 16,
      max: 800,
      bindable: true,
    },
    logoGap: {
      type: 'number',
      label: 'Logo Gap',
      default: 48,
      description: 'Gap between logos in pixels',
      min: 0,
      max: 200,
      bindable: true,
    },
  },
})
