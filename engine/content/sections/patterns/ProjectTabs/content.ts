import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { ProjectTabsProps } from './types'

export const content: SectionContentDeclaration<Partial<ProjectTabsProps>> = {
  label: 'Project Tabs',
  description: 'Tabbed project interface with categorized video collections.',
  contentFields: [
    { path: 'defaultTab', type: 'text', label: 'Default Tab ID', default: 'ldr' },
    {
      path: 'tabs',
      type: 'collection',
      label: 'Tabs',
      required: true,
      itemFields: [
        { path: 'id', type: 'text', label: 'Tab ID', required: true, hidden: true },
        { path: 'label', type: 'text', label: 'Tab Label', required: true },
        {
          path: 'videos',
          type: 'collection',
          label: 'Tab Videos',
          itemFields: [
            { path: 'src', type: 'text', label: 'Video URL', required: true },
            { path: 'title', type: 'text', label: 'Video Title', required: true },
          ],
        },
      ],
    },
    { path: 'externalLink.url', type: 'text', label: 'External Link URL' },
    { path: 'externalLink.label', type: 'text', label: 'External Link Label', default: 'See more on Instagram' },
  ],
  sampleContent: {
    defaultTab: 'ldr',
    tabs: [
      {
        id: 'ldr',
        label: 'Love, Death & Robots',
        layout: 'standard',
        videos: [
          { src: '/videos/bishoy-gendi/projects-i-like/ldr-ice-colony.webm', title: 'Colony Sequence' },
          { src: '/videos/bishoy-gendi/projects-i-like/ldr-ice-dolphin.webm', title: 'Dolphin Run' },
          { src: '/videos/bishoy-gendi/projects-i-like/ldr-ice-rule.webm', title: 'Rule Sequence' },
        ],
      },
      {
        id: 'diablo',
        label: 'Diablo IV x Berserk',
        layout: 'standard',
        videos: [
          { src: '/videos/bishoy-gendi/projects-i-like/diablo-reel-1.webm', title: 'Fight Sequence' },
          { src: '/videos/bishoy-gendi/projects-i-like/diablo-reel-2.webm', title: 'Breakdown' },
          { src: '/videos/bishoy-gendi/projects-i-like/diablo-reel-3.webm', title: 'Final Edit' },
        ],
      },
    ],
    externalLink: {
      url: 'https://instagram.com/example',
      label: 'See more on Instagram',
    },
  },
}
