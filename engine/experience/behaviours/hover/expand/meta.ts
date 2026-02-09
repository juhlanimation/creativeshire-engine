import { defineBehaviourMeta } from '../../registry'
import type { HoverExpandSettings } from './index'

export const meta = defineBehaviourMeta<HoverExpandSettings>({
  id: 'hover/expand',
  name: 'Hover Expand',
  description: 'Expands element width on hover for accordions and galleries',
  icon: 'move-horizontal',
  tags: ['hover', 'expand', 'width', 'accordion'],
  category: 'hover',
  settings: {
    baseWidth: {
      type: 'range',
      label: 'Base Width',
      default: 78,
      min: 50,
      max: 120,
      step: 2,
    },
    expandedWidth: {
      type: 'range',
      label: 'Expanded Width',
      default: 268,
      min: 200,
      max: 400,
      step: 10,
    },
    expandScale: {
      type: 'range',
      label: 'Expand Scale',
      default: 1,
      min: 1,
      max: 1.2,
      step: 0.01,
    },
  },
})
