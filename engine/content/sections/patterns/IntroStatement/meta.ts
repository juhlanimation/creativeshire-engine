import { defineSectionMeta } from '../../../../schema/meta'
import type { IntroStatementProps } from './types'

export const meta = defineSectionMeta<IntroStatementProps>({
  id: 'IntroStatement',
  name: 'Intro Statement',
  description: 'Large statement heading with body text and optional logo marquee.',
  category: 'section',
  sectionCategory: 'content',
  unique: false,
  icon: 'section',
  tags: ['intro', 'statement', 'marquee', 'logos'],
  component: false,
  ownedFields: ['layout', 'className'],
  settings: {
    showMarquee: {
      type: 'toggle',
      label: 'Show Logo Marquee',
      default: true,
    },
    marqueeSpeed: {
      type: 'number',
      label: 'Marquee Speed (seconds)',
      default: 30,
      min: 10,
      max: 60,
      step: 5,
      advanced: true,
    },
    edgeFade: {
      type: 'toggle',
      label: 'Edge Fade on Marquee',
      default: true,
      advanced: true,
    },
  },
})
