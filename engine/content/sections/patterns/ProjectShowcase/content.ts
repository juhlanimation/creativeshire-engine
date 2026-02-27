import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { ProjectShowcaseProps } from './types'

export const content: SectionContentDeclaration<Partial<ProjectShowcaseProps>> = {
  label: 'Project Showcase',
  description: 'Single project display with video, metadata, and optional shot navigation.',
  contentFields: [
    { path: 'logo.src', type: 'image', label: 'Logo Image', required: true },
    { path: 'logo.alt', type: 'text', label: 'Logo Alt Text', default: 'Logo' },
    { path: 'logo.width', type: 'number', label: 'Logo Width', default: 300 },
    { path: 'studio', type: 'text', label: 'Studio', required: true },
    { path: 'role', type: 'text', label: 'Role', required: true },
    { path: 'videoSrc', type: 'text', label: 'Main Video URL', required: true },
    { path: 'videoPoster', type: 'image', label: 'Video Poster' },
    { path: 'posterTime', type: 'number', label: 'Poster Frame Time (s)' },
    {
      path: 'shots',
      type: 'collection',
      label: 'Shot Markers',
      itemFields: [
        { path: 'id', type: 'number', label: 'Frame Number', required: true },
        { path: 'videoSrc', type: 'text', label: 'Shot Video URL' },
      ],
    },
  ],
  sampleContent: {
    logo: {
      src: '/images/bishoy-gendi/the-boy-mole-fox-horse-logo.webp',
      alt: 'The Boy, the Mole, the Fox and the Horse',
      width: 300,
    },
    studio: 'WellHello Productions',
    role: 'Character Animator',
    videoSrc: '/videos/bishoy-gendi/the-boy-mole-fox-horse/reel.webm',
    videoPoster: '/images/bishoy-gendi/posters/bmfh-reel.jpg',
    posterTime: 5,
    shots: [
      { id: 275, videoSrc: '/videos/bishoy-gendi/the-boy-mole-fox-horse/275.webm' },
      { id: 300, videoSrc: '/videos/bishoy-gendi/the-boy-mole-fox-horse/300.webm' },
      { id: 310, videoSrc: '/videos/bishoy-gendi/the-boy-mole-fox-horse/310.webm' },
      { id: 330, videoSrc: '/videos/bishoy-gendi/the-boy-mole-fox-horse/330.webm' },
      { id: 490, videoSrc: '/videos/bishoy-gendi/the-boy-mole-fox-horse/490.webm' },
      { id: 500, videoSrc: '/videos/bishoy-gendi/the-boy-mole-fox-horse/500.webm' },
      { id: 510, videoSrc: '/videos/bishoy-gendi/the-boy-mole-fox-horse/510.webm' },
      { id: 520, videoSrc: '/videos/bishoy-gendi/the-boy-mole-fox-horse/520.webm' },
    ],
  },
}
