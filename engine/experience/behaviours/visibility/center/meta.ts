import { defineBehaviourMeta } from '../../registry'
import type { CenterSettings } from './index'

export const meta = defineBehaviourMeta<CenterSettings>({
  id: 'visibility/center',
  name: 'Visibility Center',
  description: 'Tracks which element is closest to viewport center',
  icon: 'crosshair',
  tags: ['visibility', 'center', 'scroll', 'gallery'],
  category: 'visibility',
  settings: {
    threshold: { type: 'range', label: 'Center Threshold', default: 0.3, min: 0.1, max: 0.5, step: 0.05 },
    smooth: { type: 'toggle', label: 'Smooth Progress', default: true },
  },
})
