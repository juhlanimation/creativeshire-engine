/**
 * FeaturedProjects section pattern metadata for platform UI.
 */

import { defineMeta } from '@/engine/schema/meta'
import type { FeaturedProjectsProps } from './types'

export const meta = defineMeta<FeaturedProjectsProps>({
  id: 'FeaturedProjects',
  name: 'Featured Projects Section',
  description: 'Featured projects grid with alternating layout ProjectCards',
  category: 'section',
  icon: 'projects',
  tags: ['portfolio', 'projects', 'grid', 'featured'],
  component: false, // Factory function

  settings: {
    projects: {
      type: 'custom',
      label: 'Featured Projects',
      default: [],
      description: 'Array of featured project data',
    },
    startReversed: {
      type: 'toggle',
      label: 'Start Reversed',
      default: false,
      description: 'First project has thumbnail on the right',
    },
  },
})
