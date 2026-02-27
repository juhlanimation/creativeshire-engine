import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { HeroVideoProps } from './types'

export const content: SectionContentDeclaration<Partial<HeroVideoProps>> = {
  label: 'Hero Video',
  description: 'Full viewport hero with video background and role titles.',
  contentFields: [
    { path: 'introText', type: 'text', label: 'Hero Intro Text', required: true, default: "I'm Alex Morgan" },
    { path: 'roles', type: 'string-list', label: 'Role Titles', required: true, default: ['EXECUTIVE PRODUCER', 'PRODUCER', 'EDITOR'] },
    { path: 'videoSrc', type: 'text', label: 'Hero Video URL', required: true },
    { path: 'scrollIndicatorText', type: 'text', label: 'Scroll Indicator Text', default: '(SCROLL)' },
  ],
  sampleContent: {
    introText: "I'm Alex Morgan",
    roles: ['EXECUTIVE PRODUCER', 'PRODUCER', 'EDITOR'],
    videoSrc: '/videos/frontpage/frontpage.webm',
    scrollIndicatorText: '(SCROLL)',
  },
}
