import { defineBehaviourMeta } from '../../registry'

export interface GlassSettings {
  threshold: number
  targetOpacity: number
  targetBlur: number
}

export const meta = defineBehaviourMeta<GlassSettings>({
  id: 'scroll/glass',
  name: 'Scroll Glass',
  description: 'Threshold-based glass morphism — transparent below scroll threshold, frosted glass above',
  icon: 'layers',
  tags: ['scroll', 'glass', 'blur', 'nav'],
  category: 'scroll',
  settings: {
    threshold: {
      type: 'number',
      label: 'Scroll Threshold',
      default: 50,
      min: 20,
      max: 200,
      step: 10,
      description: 'Scroll distance (px) before glass activates',
      advanced: true,
    },
    targetOpacity: {
      type: 'number',
      label: 'Glass Opacity',
      default: 0.85,
      min: 0,
      max: 1,
      step: 0.05,
      description: 'Background opacity when glass is active',
      hidden: true,
    },
    targetBlur: {
      type: 'number',
      label: 'Blur Strength',
      default: 12,
      min: 0,
      max: 20,
      step: 1,
      description: 'Backdrop blur in pixels when glass is active',
      hidden: true,
    },
  },
})
