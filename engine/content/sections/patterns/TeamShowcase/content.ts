import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { TeamShowcaseProps } from './types'

export const content: SectionContentDeclaration<Partial<TeamShowcaseProps>> = {
  label: 'Team Showcase',
  description: 'Fullscreen video showcase with selectable member names.',
  contentFields: [
    { path: 'labelText', type: 'text', label: 'Team Label', default: 'Vi er' },
    {
      path: 'members',
      type: 'collection',
      label: 'Team Members',
      required: true,
      itemFields: [
        { path: 'name', type: 'text', label: 'Name', required: true },
        { path: 'videoSrc', type: 'text', label: 'Video URL' },
        { path: 'href', type: 'text', label: 'Portfolio URL' },
      ],
    },
  ],
  sampleContent: {
    labelText: 'Vi er',
    members: [
      { id: 'rune', name: 'Rune Svenningsen', videoSrc: '/videos/port-12/RS_Port12_Showreel_2.webm', href: 'https://runesvenningsen.dk' },
      { id: 'maria-t', name: 'Maria Tranberg', videoSrc: '/videos/port-12/MARIAT.webm', href: 'https://mariatranberg.com' },
      { id: 'nicolaj', name: 'Nicolaj Larsson', videoSrc: '/videos/port-12/NL_Port12_Showreel_v2.webm', href: 'https://ccccccc.tv' },
      { id: 'tor', name: 'Tor Birk Trads', videoSrc: '/videos/port-12/TorBirkTrads2.webm', href: 'https://www.torbirktrads.dk' },
    ],
  },
}
