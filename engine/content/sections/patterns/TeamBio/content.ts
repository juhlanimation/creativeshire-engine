import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { TeamBioProps } from './types'

export const content: SectionContentDeclaration<Partial<TeamBioProps>> = {
  label: 'Team Bio',
  description: 'Team member profiles with portrait, accent name, bio, and social links.',
  contentFields: [
    {
      path: 'members',
      type: 'collection',
      label: 'Team Members',
      required: true,
      itemFields: [
        { path: 'name', type: 'text', label: 'Name', required: true },
        { path: 'bio', type: 'textarea', label: 'Biography', required: true },
        { path: 'imageSrc', type: 'image', label: 'Portrait Photo', required: true },
        { path: 'overlayImageSrc', type: 'image', label: 'Hover Image' },
        { path: 'accentColor', type: 'text', label: 'Accent Color', required: true },
        { path: 'email', type: 'text', label: 'Email' },
        { path: 'linkedinUrl', type: 'text', label: 'LinkedIn URL' },
      ],
    },
  ],
  sampleContent: {
    members: [
      {
        name: 'JULIANA MORENO',
        bio: 'Lead animator with 12 years of experience in character animation for feature films and series. Previously at Pixar and Illumination.',
        imageSrc: '/images/team/juliana.webp',
        accentColor: '#ffd70c',
        email: 'juliana@studio.com',
        linkedinUrl: 'https://linkedin.com/in/juliana',
      },
      {
        name: 'ALEX CHEN',
        bio: 'Creative director specializing in motion design and visual storytelling. Award-winning work in commercials and music videos.',
        imageSrc: '/images/team/alex.webp',
        accentColor: '#fba5db',
        email: 'alex@studio.com',
        linkedinUrl: 'https://linkedin.com/in/alex',
      },
    ],
  },
}
