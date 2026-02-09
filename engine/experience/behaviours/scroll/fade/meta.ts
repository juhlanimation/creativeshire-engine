import { defineBehaviourMeta } from '../../registry'

export const meta = defineBehaviourMeta({
  id: 'scroll/fade',
  name: 'Scroll Fade',
  description: 'Fades section in as it enters viewport using intersection ratio',
  icon: 'eye',
  tags: ['scroll', 'fade', 'opacity', 'section'],
  category: 'scroll',
})
