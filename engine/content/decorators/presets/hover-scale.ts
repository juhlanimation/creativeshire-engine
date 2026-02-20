/**
 * Hover Scale decorator.
 * Adds a hover/scale behaviour to the widget (L2 only, no actions).
 */

import type { DecoratorDefinition } from '../types'
import { registerDecorator } from '../registry'

interface HoverScaleParams {
  scale?: number
}

const hoverScale: DecoratorDefinition<HoverScaleParams> = {
  id: 'hover-scale',
  name: 'Hover Scale',
  description: 'Scales the widget on hover',
  tags: ['hover', 'scale', 'animation'],
  settings: {
    scale: {
      type: 'range',
      label: 'Scale Factor',
      description: 'How much to scale on hover',
      default: 1.05,
      min: 1,
      max: 1.2,
      step: 0.01,
    },
  },
  behaviours: (params) => [
    {
      id: 'hover/scale',
      options: { scale: params.scale ?? 1.05 },
    },
  ],
}

registerDecorator(hoverScale)
