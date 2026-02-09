import { defineBehaviourMeta } from '../../registry'
import type { HoverRevealSettings } from './index'

export const meta = defineBehaviourMeta<HoverRevealSettings>({
  id: 'hover/reveal',
  name: 'Hover Reveal',
  description: 'Hover-triggered reveal with scale, color shift, and text flip',
  icon: 'mouse-pointer',
  tags: ['hover', 'reveal', 'scale', 'flip'],
  category: 'hover',
  settings: {
    hoverScale: {
      type: 'range',
      label: 'Hover Scale',
      default: 1.02,
      min: 1,
      max: 1.1,
      step: 0.01,
    },
    pressScale: {
      type: 'range',
      label: 'Press Scale',
      default: 0.98,
      min: 0.9,
      max: 1,
      step: 0.01,
    },
    flipDuration: {
      type: 'range',
      label: 'Flip Duration (ms)',
      default: 400,
      min: 100,
      max: 800,
      step: 50,
    },
    fadeDuration: {
      type: 'range',
      label: 'Fade Duration (ms)',
      default: 200,
      min: 50,
      max: 500,
      step: 25,
    },
  },
})
