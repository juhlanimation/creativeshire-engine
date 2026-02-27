import { defineSectionMeta } from '../../../../schema/meta'
import type { HeroImageProps } from './types'

export const meta = defineSectionMeta<HeroImageProps>({
  id: 'HeroImage',
  name: 'Hero Image',
  description: 'Full-viewport background image hero with optional parallax and scroll indicator.',
  category: 'section',
  sectionCategory: 'hero',
  unique: true,
  icon: 'hero',
  tags: ['hero', 'image', 'fullscreen', 'parallax'],
  component: false,
  ownedFields: ['layout', 'className'],
  settings: {
    showScrollArrow: {
      type: 'toggle',
      label: 'Show Scroll Arrow',
      default: true,
    },
    overlayOpacity: {
      type: 'number',
      label: 'Overlay Opacity',
      default: 0.1,
      min: 0,
      max: 1,
      step: 0.05,
      group: 'Style',
    },
    parallaxRate: {
      type: 'number',
      label: 'Parallax Rate',
      default: 0.3,
      min: 0,
      max: 0.5,
      step: 0.05,
      advanced: true,
    },
  },
})
