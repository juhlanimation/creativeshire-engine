import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { HeroTitleProps } from './types'

export const content: SectionContentDeclaration<Partial<HeroTitleProps>> = {
  label: 'Hero Title',
  description: 'Full viewport hero with video background and centered title.',
  contentFields: [
    { path: 'title', type: 'text', label: 'Title', required: true, default: 'PORT12' },
    { path: 'tagline', type: 'text', label: 'Tagline', default: 'DRØM • DEL • SKAB' },
    { path: 'videoSrc', type: 'text', label: 'Hero Video URL', required: true },
    { path: 'loopStartTime', type: 'number', label: 'Loop Start Time (s)', default: 3.4 },
    { path: 'scrollIndicatorText', type: 'text', label: 'Scroll Indicator Text', default: '(SCROLL)' },
  ],
  sampleContent: {
    title: 'PORT12',
    tagline: 'DRØM • DEL • SKAB',
    videoSrc: '/videos/port-12/showreel.webm',
    loopStartTime: 3.4,
    scrollIndicatorText: '(SCROLL)',
  },
}
