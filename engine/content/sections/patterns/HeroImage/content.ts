import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { HeroImageProps } from './types'

export const content: SectionContentDeclaration<Partial<HeroImageProps>> = {
  label: 'Hero Image',
  description: 'Full-viewport background image hero with optional parallax and scroll indicator.',
  contentFields: [
    { path: 'imageSrc', type: 'image', label: 'Hero Image', required: true },
    { path: 'imageAlt', type: 'text', label: 'Image Alt Text', required: true, default: 'Hero background' },
  ],
  sampleContent: {
    imageSrc: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1440&h=964&fit=crop',
    imageAlt: 'Hero background',
  },
}
