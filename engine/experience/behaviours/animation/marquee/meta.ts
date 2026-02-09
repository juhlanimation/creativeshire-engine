import { defineBehaviourMeta } from '../../registry'
import type { MarqueeSettings } from './index'

export const meta = defineBehaviourMeta<MarqueeSettings>({
  id: 'animation/marquee',
  name: 'Animation Marquee',
  description: 'Continuous horizontal scroll animation for tickers',
  icon: 'arrow-right',
  tags: ['animation', 'marquee', 'ticker', 'scroll'],
  category: 'animation',
  settings: {
    speed: { type: 'range', label: 'Animation Speed (seconds)', default: 30, min: 10, max: 60, step: 5 },
  },
})
