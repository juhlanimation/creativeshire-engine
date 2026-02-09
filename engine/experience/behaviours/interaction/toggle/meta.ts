import { defineBehaviourMeta } from '../../registry'
import type { ToggleSettings } from './index'

export const meta = defineBehaviourMeta<ToggleSettings>({
  id: 'interaction/toggle',
  name: 'Interaction Toggle',
  description: 'Click/tap toggle state for accordions and menus',
  icon: 'toggle-left',
  tags: ['interaction', 'toggle', 'click', 'accordion'],
  category: 'interaction',
  settings: {
    scale: { type: 'range', label: 'Active Scale', default: 1.02, min: 1, max: 1.2, step: 0.01 },
  },
})
