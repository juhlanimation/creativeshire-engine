import { defineMeta } from '../../../../../../schema/meta'
import type { ScrollCardProps } from './types'

export const meta = defineMeta<ScrollCardProps>({
  id: 'ProjectScroll__ScrollCard',
  name: 'Scroll Card',
  description: 'Project card with image, optional video hover, accordion description.',
  category: 'interactive',
  icon: 'component',
  tags: ['project', 'card', 'scroll'],
  component: true,
  settings: {},
})
