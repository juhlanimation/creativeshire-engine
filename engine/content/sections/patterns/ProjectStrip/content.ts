import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { ProjectStripProps } from './types'

export const content: SectionContentDeclaration<Partial<ProjectStripProps>> = {
  label: 'Project Strip',
  description: 'Horizontal thumbnail gallery.',
  contentFields: [
    { path: 'heading', type: 'text', label: 'Section Heading', default: 'OTHER SELECTED PROJECTS' },
    { path: 'yearRange', type: 'text', label: 'Year Range', default: '2018-2024' },
    {
      path: 'projects',
      type: 'collection',
      label: 'Projects',
      itemFields: [
        { path: 'title', type: 'text', label: 'Title', required: true },
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
    heading: 'OTHER SELECTED PROJECTS',
    yearRange: '2018-2024',
    projects: [
      {
        id: 'genshin-impact',
        title: 'SCENERY AND SENTIMENT',
        year: '2023',
        role: 'Executive Producer',
        client: 'HOYOVERSE',
        studio: 'SUN CREATURE',
        thumbnailSrc: '/images/other-projects/genshin-impact-thumbnail.webp',
        thumbnailAlt: 'Genshin Impact thumbnail',
        videoSrc: '/videos/other-projects/genshin-impact-hover.webm',
      },
      {
        id: 'its-on',
        title: "IT'S ON!",
        year: '2018',
        role: 'Executive Producer, Editor',
        client: 'RIOT GAMES',
        studio: 'SUN CREATURE',
        thumbnailSrc: '/images/other-projects/its-on-thumbnail.webp',
        thumbnailAlt: "It's On thumbnail",
        videoSrc: '/videos/other-projects/its-on-hover.webm',
      },
    ],
  },
}
