import { defineBehaviourMeta } from '../../registry'
import type { HoverScaleSettings } from './index'

export const meta = defineBehaviourMeta<HoverScaleSettings>({
  id: 'hover/scale',
  name: 'Hover Scale',
  description: 'Scale transform on hover with optional shadow changes',
  icon: 'maximize',
  tags: ['hover', 'scale', 'shadow', 'card'],
  category: 'hover',
  settings: {
    hoverScale: {
      type: 'range',
      label: 'Hover Scale',
      default: 1.03,
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
    overlayOpacity: {
      type: 'range',
      label: 'Default Overlay Opacity',
      default: 0.1,
      min: 0,
      max: 0.5,
      step: 0.05,
    },
    hoverOverlayOpacity: {
      type: 'range',
      label: 'Hover Overlay Opacity',
      default: 0.3,
      min: 0.1,
      max: 0.8,
      step: 0.05,
    },
  },
})
