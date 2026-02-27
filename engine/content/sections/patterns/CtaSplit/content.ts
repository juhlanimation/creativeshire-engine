import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { CtaSplitProps } from './types'

export const content: SectionContentDeclaration<Partial<CtaSplitProps>> = {
  label: 'CTA Split',
  description: 'Call-to-action with split layout and optional image collage.',
  contentFields: [
    { path: 'heading', type: 'text', label: 'Heading', required: true },
    { path: 'bodyText', type: 'textarea', label: 'Body Text', required: true },
    { path: 'ctaLabel', type: 'text', label: 'CTA Label', default: 'Get in touch' },
    { path: 'ctaEmail', type: 'text', label: 'CTA Email', required: true },
    {
      path: 'collageImages',
      type: 'collection',
      label: 'Collage Images (featured layout)',
      itemFields: [
        { path: 'src', type: 'image', label: 'Image', required: true },
        { path: 'alt', type: 'text', label: 'Alt Text', required: true },
      ],
    },
  ],
  sampleContent: {
    heading: 'YOU NAME IT,\nWE ANIMATE IT.',
    bodyText: 'We are always looking for new projects and collaborations. Whether you have a specific vision or just want to explore possibilities, we would love to hear from you.',
    ctaLabel: 'Get in touch',
    ctaEmail: 'hello@studio.com',
    collageImages: [
      { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=668&h=329&fit=crop', alt: 'Project highlight 1' },
      { src: 'https://images.unsplash.com/photo-1633186710895-309db2eca9e4?w=668&h=329&fit=crop', alt: 'Project highlight 2' },
    ],
  },
}
