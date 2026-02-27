import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { ProjectVideoGridProps } from './types'

export const content: SectionContentDeclaration<Partial<ProjectVideoGridProps>> = {
  label: 'Project Video Grid',
  description: 'Grid layout with mixed aspect ratio videos.',
  contentFields: [
    { path: 'logo.src', type: 'image', label: 'Logo Image', required: true },
    { path: 'logo.alt', type: 'text', label: 'Logo Alt Text' },
    { path: 'logo.width', type: 'number', label: 'Logo Width', default: 200 },
    {
      path: 'videos',
      type: 'collection',
      label: 'Video Grid',
      required: true,
      itemFields: [
        { path: 'src', type: 'text', label: 'Video URL', required: true },
        { path: 'title', type: 'text', label: 'Video Title', required: true },
        { path: 'aspectRatio', type: 'text', label: 'Aspect Ratio', required: true },
        { path: 'poster', type: 'image', label: 'Thumbnail' },
        { path: 'posterTime', type: 'number', label: 'Poster Frame Time (s)' },
      ],
    },
  ],
  sampleContent: {
    logo: {
      src: '/images/bishoy-gendi/Supercell-logo-alpha.webp',
      alt: 'Supercell',
      width: 200,
    },
    videos: [
      {
        src: '/videos/bishoy-gendi/clash-royale/bigboi-green.webm',
        title: 'BigBoi Green',
        aspectRatio: '9/16',
        posterTime: 1,
      },
      {
        src: '/videos/bishoy-gendi/clash-royale/goblin-machine.webm',
        title: 'Goblin Machine',
        aspectRatio: '9/16',
        posterTime: 1,
      },
      {
        src: '/videos/bishoy-gendi/clash-royale/dagger-duchess.webm',
        title: 'Dagger Duchess',
        aspectRatio: '16/9',
        posterTime: 1,
      },
      {
        src: '/videos/bishoy-gendi/clash-royale/rune-giant.webm',
        title: 'Rune Giant',
        aspectRatio: '16/9',
        posterTime: 1,
      },
    ],
  },
}
