import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { ProjectFeaturedProps } from './types'

export const content: SectionContentDeclaration<Partial<ProjectFeaturedProps>> = {
  label: 'Featured Projects',
  description: 'Featured projects grid with cards.',
  contentFields: [
    {
      path: 'projects',
      type: 'collection',
      label: 'Featured Projects',
      required: true,
      itemFields: [
        { path: 'title', type: 'text', label: 'Title', required: true },
        { path: 'description', type: 'textarea', label: 'Description' },
        { path: 'role', type: 'text', label: 'Role', required: true },
        { path: 'year', type: 'text', label: 'Year', required: true },
        { path: 'client', type: 'text', label: 'Client' },
        { path: 'studio', type: 'text', label: 'Studio' },
        { path: 'thumbnailSrc', type: 'image', label: 'Thumbnail', required: true },
        { path: 'thumbnailAlt', type: 'text', label: 'Thumbnail Alt Text' },
        { path: 'videoSrc', type: 'text', label: 'Hover Preview Video URL' },
        { path: 'videoUrl', type: 'text', label: 'Full Video URL' },
      ],
    },
  ],
  sampleContent: {
    projects: [
      {
        thumbnailSrc: '/images/01-elements-of-time/thumbnail.webp',
        thumbnailAlt: 'Elements of Time thumbnail',
        videoSrc: '/videos/01-elements-of-time/hover.webm',
        client: 'AZUKI',
        studio: 'CROSSROAD STUDIO',
        title: 'ELEMENTS OF TIME',
        description: "The film brings to life the Elementals' four domains.",
        year: '2025',
        role: 'Executive Producer, Producer',
      },
      {
        thumbnailSrc: '/images/02-tower-reveal/thumbnail.webp',
        thumbnailAlt: 'Tower Reveal thumbnail',
        videoSrc: '/videos/02-tower-reveal/hover.webm',
        client: 'SUPERCELL',
        studio: 'SUN CREATURE',
        title: 'TOWER REVEAL',
        description: 'A two-film campaign announcing Tower Troops.',
        year: '2024',
        role: 'Executive Producer',
      },
    ],
  },
}
