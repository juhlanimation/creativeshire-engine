import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { AboutCollageProps } from './types'

export const content: SectionContentDeclaration<Partial<AboutCollageProps>> = {
  label: 'About Collage',
  description: 'Text block with scattered photo images.',
  contentFields: [
    { path: 'text', type: 'textarea', label: 'About Text', required: true },
    {
      path: 'images',
      type: 'collection',
      label: 'About Images',
      required: true,
      itemFields: [
        { path: 'src', type: 'image', label: 'Image', required: true },
        { path: 'alt', type: 'text', label: 'Alt Text', default: '' },
      ],
    },
  ],
  sampleContent: {
    text: 'Port12 er et kontorfællesskab, men vi er sgu mere fællesskab end vi er kontor.\n\nGodt nok sidder vi meget på vores flade og hakker i tastaturerne, men vi går mere op i at spille hinanden gode ved at dele: viden, erfaring, opgaver og inspiration.',
    images: [
      { src: '/images/port-12/1.webp', alt: 'Port12 workspace' },
      { src: '/images/port-12/2.webp', alt: 'Port12 entrance' },
      { src: '/images/port-12/3.webp', alt: 'Port12 members' },
      { src: '/images/port-12/4.webp', alt: 'Port12 collaboration' },
    ],
  },
}
