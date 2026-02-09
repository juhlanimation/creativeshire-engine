import { defineBehaviourMeta } from '../../registry'
import type { IntroStepSettings } from './index'

export const meta = defineBehaviourMeta<IntroStepSettings>({
  id: 'intro/step',
  name: 'Intro Step',
  description: 'Maps intro step index and progress to CSS variables',
  icon: 'list-ordered',
  tags: ['intro', 'step', 'sequence', 'overlay'],
  category: 'intro',
  settings: {
    overlayFadeStep: {
      type: 'range',
      label: 'Overlay Fade Step',
      default: 2,
      min: 0,
      max: 10,
      step: 1,
    },
  },
})
