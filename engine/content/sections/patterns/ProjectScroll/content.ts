import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { ProjectScrollProps } from './types'

export const content: SectionContentDeclaration<Partial<ProjectScrollProps>> = {
  label: 'Project Scroll',
  description: 'Sticky sidebar with scrollable project cards and video hover.',
  contentFields: [
    { path: 'sectionTitle', type: 'text', label: 'Section Title', default: 'Selected Work' },
    { path: 'introText', type: 'textarea', label: 'Intro Text' },
    {
      path: 'projects',
      type: 'collection',
      label: 'Projects',
      required: true,
      itemFields: [
        { path: 'title', type: 'text', label: 'Project Title', required: true },
        { path: 'client', type: 'text', label: 'Client Name', required: true },
        { path: 'description', type: 'textarea', label: 'Description' },
        { path: 'imageSrc', type: 'image', label: 'Cover Image', required: true },
        { path: 'overlayImageSrc', type: 'image', label: 'Hover Overlay Image' },
        { path: 'videoSrc', type: 'text', label: 'Hover Video URL' },
      ],
    },
  ],
  sampleContent: {
    sectionTitle: 'Selected\nProjects',
    introText: 'A curated selection of our most impactful projects spanning animation, motion design, and visual effects.',
    projects: [
      { title: 'ODDSET GAMES', client: 'Danske Spil', description: 'Character animation and motion design for a gaming brand campaign spanning digital and broadcast media.', imageSrc: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=668&h=420&fit=crop' },
      { title: 'ELEMENTS OF TIME', client: 'Azuki', description: 'Visual storytelling through abstract motion design for an NFT art collection launch.', imageSrc: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=668&h=420&fit=crop' },
      { title: 'NEON PULSE', client: 'Apple TV+', description: 'Title sequence and motion graphics for a cyberpunk thriller series.', imageSrc: 'https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=668&h=420&fit=crop' },
      { title: 'PAPER WINGS', client: 'Disney+', description: 'Short film combining hand-drawn and 3D animation techniques.', imageSrc: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=668&h=420&fit=crop' },
      { title: 'SOLAR FLARE', client: 'Spotify', description: 'Music video featuring particle simulation and abstract motion design.', imageSrc: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=668&h=420&fit=crop' },
    ],
  },
}
