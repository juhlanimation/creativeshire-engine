/**
 * Marquee layout widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { MarqueeProps } from './types'

export const meta = defineMeta<MarqueeProps>({
  id: 'Marquee',
  name: 'Marquee',
  description: 'Infinite horizontal scroll container for any children',
  category: 'layout',
  icon: 'marquee',
  tags: ['container', 'layout', 'marquee', 'scroll', 'animation'],
  component: true,

  settings: {
    duration: {
      type: 'number',
      label: 'Duration',
      default: 120,
      description: 'Animation duration in seconds for one full loop',
      min: 1,
      max: 120,
      bindable: true,
    },
    gap: {
      type: 'spacing',
      label: 'Gap',
      default: 0,
      description: 'Space between child items',
      bindable: true,
      validation: { min: 0, max: 500 },
    },
    gapScale: {
      type: 'number',
      label: 'Gap Scale',
      default: 1,
      description: 'Multiplier for the gap value',
      min: 0.25,
      max: 10,
      step: 0.25,
      bindable: true,
    },
    direction: {
      type: 'select',
      label: 'Direction',
      default: 'left',
      description: 'Scroll direction',
      choices: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
      bindable: true,
    },
  },
})
