/**
 * FeaturedProjects section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import type { FeaturedProjectsProps } from './types'

export const meta = defineSectionMeta<FeaturedProjectsProps>({
  id: 'FeaturedProjects',
  name: 'Featured Projects Section',
  description: 'Featured projects grid with alternating layout ProjectCards',
  category: 'section',
  sectionCategory: 'project',
  unique: false,
  icon: 'projects',
  tags: ['portfolio', 'projects', 'grid', 'featured'],
  component: false, // Factory function
  ownedFields: ['layout', 'behaviour', 'behaviourOptions', 'className'],

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
