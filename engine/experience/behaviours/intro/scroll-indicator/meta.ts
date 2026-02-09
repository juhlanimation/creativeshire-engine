import { defineBehaviourMeta } from '../../registry'
import type { IntroScrollIndicatorSettings } from './index'

export const meta = defineBehaviourMeta<IntroScrollIndicatorSettings>({
  id: 'intro/scroll-indicator',
  name: 'Intro Scroll Indicator',
  description: 'Shows scroll indicator after intro completes and scroll unlocks',
  icon: 'chevrons-down',
  tags: ['intro', 'scroll', 'indicator', 'pulse'],
  category: 'intro',
  settings: {
    delay: {
      type: 'range',
      label: 'Show Delay (ms)',
      default: 0,
      min: 0,
      max: 1000,
      step: 100,
    },
    enablePulse: {
      type: 'toggle',
      label: 'Pulsing Animation',
      default: true,
    },
    hideOnScroll: {
      type: 'toggle',
      label: 'Hide On Scroll',
      default: true,
    },
    hideThreshold: {
      type: 'range',
      label: 'Hide Threshold',
      default: 0.05,
      min: 0,
      max: 0.2,
      step: 0.01,
    },
  },
})
