import { defineBehaviourMeta } from '../../registry'
import type { IntroContentRevealSettings } from './index'

export const meta = defineBehaviourMeta<IntroContentRevealSettings>({
  id: 'intro/content-reveal',
  name: 'Intro Content Reveal',
  description: 'Reveals content with fade and slide when intro phase completes',
  icon: 'sunrise',
  tags: ['intro', 'reveal', 'content', 'fade'],
  category: 'intro',
  settings: {
    delay: {
      type: 'range',
      label: 'Reveal Delay (ms)',
      default: 0,
      min: 0,
      max: 1000,
      step: 50,
    },
    duration: {
      type: 'range',
      label: 'Reveal Duration (ms)',
      default: 600,
      min: 200,
      max: 1500,
      step: 50,
    },
    yOffset: {
      type: 'range',
      label: 'Y Offset (px)',
      default: 30,
      min: 0,
      max: 100,
      step: 5,
    },
    scaleStart: {
      type: 'range',
      label: 'Scale Start',
      default: 0.98,
      min: 0.9,
      max: 1,
      step: 0.01,
    },
  },
})
