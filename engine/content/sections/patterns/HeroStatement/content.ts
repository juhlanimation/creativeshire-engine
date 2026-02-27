import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { HeroStatementProps } from './types'

export const content: SectionContentDeclaration<Partial<HeroStatementProps>> = {
  label: 'Hero Statement',
  description: 'Statement hero with large heading, image collage, body columns, and email CTA.',
  contentFields: [
    { path: 'heading', type: 'text', label: 'Display Heading', required: true },
    { path: 'bodyTextLeft', type: 'textarea', label: 'Body Text (Left Column)', required: true },
    { path: 'bodyTextRight', type: 'textarea', label: 'Body Text (Right Column)' },
    {
      path: 'collageImages',
      type: 'collection',
      label: 'Collage Images',
      itemFields: [
        { path: 'src', type: 'image', label: 'Image', required: true },
        { path: 'alt', type: 'text', label: 'Alt Text', required: true },
      ],
    },
    { path: 'ctaLabel', type: 'text', label: 'CTA Label', default: 'Say hello' },
    { path: 'ctaEmail', type: 'text', label: 'CTA Email', required: true },
  ],
  sampleContent: {
    heading: 'ABOUT CCCCCCC',
    bodyTextLeft: 'Founded in 2018, we are a collective of animators, designers and storytellers passionate about crafting memorable visual experiences.',
    bodyTextRight: 'Our work spans feature films, series, commercials, and interactive media. We believe in the power of animation to communicate complex ideas with emotional clarity.',
    collageImages: [
      { src: '/images/about/studio-1.webp', alt: 'Studio workspace' },
      { src: '/images/about/team-1.webp', alt: 'Team at work' },
    ],
    ctaLabel: 'Say hello',
    ctaEmail: 'hello@studio.com',
  },
}
