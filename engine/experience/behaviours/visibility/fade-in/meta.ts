import { defineBehaviourMeta } from '../../registry'
import type { FadeInSettings } from './index'

export const meta = defineBehaviourMeta<FadeInSettings>({
  id: 'visibility/fade-in',
  name: 'Visibility Fade In',
  description: 'Fades and slides content as it enters the viewport',
  icon: 'eye',
  tags: ['visibility', 'fade', 'slide', 'intersection'],
  category: 'visibility',
  settings: {
    distance: { type: 'range', label: 'Slide Distance', default: 20, min: 0, max: 100, step: 5 },
  },
})
