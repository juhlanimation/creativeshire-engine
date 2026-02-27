/**
 * FeaturedProjects section pattern metadata for platform UI.
 *
 * Content fields (projects) live in content.ts.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import type { ProjectFeaturedProps } from './types'

export const meta = defineSectionMeta<ProjectFeaturedProps>({
  id: 'ProjectFeatured',
  name: 'Project Featured',
  description: 'Featured projects grid with alternating layout ProjectCards',
  category: 'section',
  sectionCategory: 'project',
  unique: false,
  requiredOverlays: ['VideoModal'],
  icon: 'projects',
  tags: ['portfolio', 'projects', 'grid', 'featured'],
  component: false, // Factory function
  ownedFields: ['layout', 'className'],

  settings: {
    startReversed: {
      type: 'toggle',
      label: 'Start Reversed',
      default: false,
      description: 'First project has thumbnail on the right',
    },
  },
})
