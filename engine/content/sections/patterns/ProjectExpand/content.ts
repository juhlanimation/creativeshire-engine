import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { ProjectExpandProps } from './types'

export const content: SectionContentDeclaration<Partial<ProjectExpandProps>> = {
  label: 'Project Expand',
  description: 'Expandable video gallery with thumbnails.',
  contentFields: [
    { path: 'logo.src', type: 'image', label: 'Logo Image', required: true },
    { path: 'logo.alt', type: 'text', label: 'Logo Alt Text', default: 'Logo' },
    { path: 'logo.width', type: 'number', label: 'Logo Width', default: 120 },
    {
      path: 'videos',
      type: 'collection',
      label: 'Expandable Videos',
      required: true,
      itemFields: [
        { path: 'thumbnailSrc', type: 'image', label: 'Thumbnail', required: true },
        { path: 'thumbnailAlt', type: 'text', label: 'Thumbnail Alt Text' },
        { path: 'videoSrc', type: 'text', label: 'Video URL', required: true },
        { path: 'title', type: 'text', label: 'Video Title', required: true },
      ],
    },
  ],
  sampleContent: {
    logo: {
      src: '/images/bishoy-gendi/Riot_Games_2022.svg.png',
      alt: 'Riot Games',
      width: 120,
    },
    videos: [
      {
        id: 'lor',
        thumbnailSrc: '/videos/bishoy-gendi/riot-games/legends-of-runeterra.webm',
        thumbnailAlt: 'Legends of Runeterra',
        videoSrc: '/videos/bishoy-gendi/riot-games/legends-of-runeterra.webm',
        videoUrl: '/videos/bishoy-gendi/riot-games/legends-of-runeterra.webm',
        title: 'Legends of Runeterra',
      },
      {
        id: 'lol-crcr',
        thumbnailSrc: '/videos/bishoy-gendi/riot-games/lol-crcr.webm',
        thumbnailAlt: 'LOL x Clash Royale',
        videoSrc: '/videos/bishoy-gendi/riot-games/lol-crcr.webm',
        videoUrl: '/videos/bishoy-gendi/riot-games/lol-crcr.webm',
        title: 'LOL x Clash Royale',
      },
      {
        id: 'star-guardian',
        thumbnailSrc: '/videos/bishoy-gendi/riot-games/star-guardian.webm',
        thumbnailAlt: 'Star Guardian',
        videoSrc: '/videos/bishoy-gendi/riot-games/star-guardian.webm',
        videoUrl: '/videos/bishoy-gendi/riot-games/star-guardian.webm',
        title: 'Star Guardian',
      },
    ],
  },
}
