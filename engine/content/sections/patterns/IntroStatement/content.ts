import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { IntroStatementProps } from './types'

export const content: SectionContentDeclaration<Partial<IntroStatementProps>> = {
  label: 'Intro Statement',
  description: 'Large statement heading with body text and optional logo marquee.',
  contentFields: [
    { path: 'heading', type: 'text', label: 'Statement Heading', required: true },
    { path: 'bodyText', type: 'textarea', label: 'Body Text', required: true },
    {
      path: 'clientLogos',
      type: 'collection',
      label: 'Client Logos',
      itemFields: [
        { path: 'src', type: 'image', label: 'Logo Image', required: true },
        { path: 'alt', type: 'text', label: 'Logo Alt Text', required: true },
        { path: 'name', type: 'text', label: 'Client Name' },
        { path: 'height', type: 'number', label: 'Display Height (px)' },
      ],
    },
  ],
  sampleContent: {
    heading: 'WE CREATE WORLDS THAT MOVE PEOPLE',
    bodyText: 'An award-winning animation studio specializing in character animation, motion design, and visual storytelling for film, television, and digital media.',
    clientLogos: [
      { src: 'https://placehold.co/120x32/f9f9f9/f9f9f9?text=BRAND+1', alt: 'Brand 1', name: 'Brand 1', height: 32 },
      { src: 'https://placehold.co/120x32/f9f9f9/f9f9f9?text=BRAND+2', alt: 'Brand 2', name: 'Brand 2', height: 32 },
      { src: 'https://placehold.co/120x32/f9f9f9/f9f9f9?text=BRAND+3', alt: 'Brand 3', name: 'Brand 3', height: 32 },
      { src: 'https://placehold.co/120x32/f9f9f9/f9f9f9?text=BRAND+4', alt: 'Brand 4', name: 'Brand 4', height: 32 },
      { src: 'https://placehold.co/120x32/f9f9f9/f9f9f9?text=BRAND+5', alt: 'Brand 5', name: 'Brand 5', height: 32 },
    ],
  },
}
