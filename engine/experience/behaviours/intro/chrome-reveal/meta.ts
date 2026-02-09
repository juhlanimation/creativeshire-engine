import { defineBehaviourMeta } from '../../registry'
import type { IntroChromeRevealSettings } from './index'

export const meta = defineBehaviourMeta<IntroChromeRevealSettings>({
  id: 'intro/chrome-reveal',
  name: 'Intro Chrome Reveal',
  description: 'Reveals header/footer chrome after intro sequence completes',
  icon: 'layout',
  tags: ['intro', 'chrome', 'header', 'footer'],
  category: 'intro',
  settings: {
    yOffset: {
      type: 'range',
      label: 'Slide Distance (px)',
      default: 20,
      min: 0,
      max: 50,
      step: 5,
    },
    edge: {
      type: 'select',
      label: 'Chrome Edge',
      default: 'top',
      choices: [
        { value: 'top', label: 'Top (Header)' },
        { value: 'bottom', label: 'Bottom (Footer)' },
      ],
    },
    delay: {
      type: 'range',
      label: 'Reveal Delay (ms)',
      default: 0,
      min: 0,
      max: 500,
      step: 50,
    },
  },
})
