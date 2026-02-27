import { defineChromeMeta } from '../../../../schema/meta'
import type { GlassNavProps } from './types'

export const meta = defineChromeMeta<GlassNavProps>({
  id: 'GlassNav',
  name: 'Glass Nav',
  description: 'Fixed transparent header that transitions to frosted glass on scroll.',
  category: 'chrome-pattern',
  chromeSlot: 'header',
  icon: 'header',
  tags: ['chrome', 'header', 'glass', 'blur', 'navigation'],
  component: false,
  settings: {
    scrollThreshold: {
      type: 'number',
      label: 'Scroll Threshold (px)',
      default: 50,
      min: 20,
      max: 200,
      step: 10,
      advanced: true,
    },
    blurStrength: {
      type: 'number',
      label: 'Blur Strength (px)',
      default: 12,
      min: 0,
      max: 20,
      step: 1,
      hidden: true,
    },
    glassBgOpacity: {
      type: 'number',
      label: 'Glass Background Opacity',
      default: 0.85,
      min: 0,
      max: 1,
      step: 0.05,
      hidden: true,
    },
    forceOpaque: {
      type: 'toggle',
      label: 'Force Opaque Background',
      default: false,
      hidden: true,
    },
  },
})
