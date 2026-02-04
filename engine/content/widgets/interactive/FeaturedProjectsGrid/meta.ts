/**
 * FeaturedProjectsGrid interactive widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { FeaturedProjectsGridProps } from './types'

export const meta = defineMeta<FeaturedProjectsGridProps>({
  id: 'FeaturedProjectsGrid',
  name: 'Featured Projects Grid',
  description: 'Grid of featured project cards with alternating layouts',
  category: 'interactive',
  icon: 'grid',
  tags: ['projects', 'grid', 'cards', 'portfolio'],
  component: true,

  settings: {
    projects: {
      type: 'custom',
      label: 'Projects',
      default: [],
      description: 'Array of featured projects or binding expression',
      validation: { required: true },
      bindable: true,
    },
    startReversed: {
      type: 'toggle',
      label: 'Start Reversed',
      default: false,
      description: 'Start with reversed card layout',
    },
  },
})
