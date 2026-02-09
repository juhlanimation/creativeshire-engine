import { defineBehaviourMeta } from '../../registry'
import type { IntroTextRevealSettings } from './index'

export const meta = defineBehaviourMeta<IntroTextRevealSettings>({
  id: 'intro/text-reveal',
  name: 'Intro Text Reveal',
  description: 'Staggered text reveal with optional clip-path animation',
  icon: 'type',
  tags: ['intro', 'text', 'reveal', 'stagger'],
  category: 'intro',
  settings: {
    staggerIndex: {
      type: 'range',
      label: 'Stagger Index',
      default: 0,
      min: 0,
      max: 10,
      step: 1,
    },
    staggerDelay: {
      type: 'range',
      label: 'Stagger Delay (ms)',
      default: 100,
      min: 0,
      max: 300,
      step: 25,
    },
    yOffset: {
      type: 'range',
      label: 'Y Offset (px)',
      default: 20,
      min: 0,
      max: 50,
      step: 5,
    },
    useClipPath: {
      type: 'toggle',
      label: 'Use Clip-Path',
      default: false,
    },
  },
})
