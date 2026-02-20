import { defineBehaviourMeta } from '../../registry'

export const meta = defineBehaviourMeta({
  id: 'scroll/collapse',
  name: 'Scroll Collapse',
  description: 'Hides region on scroll down, shows on scroll up (collapsible header)',
  icon: 'chevron-up',
  tags: ['scroll', 'collapse', 'header', 'hide', 'show'],
  category: 'scroll',
})
