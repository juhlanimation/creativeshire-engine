/**
 * OtherProjects section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import type { ProjectStripProps } from './types'

export const meta = defineSectionMeta<ProjectStripProps>({
  id: 'ProjectStrip',
  name: 'Project Strip',
  description: 'Horizontal thumbnail gallery (hidden on mobile)',
  category: 'section',
  sectionCategory: 'project',
  unique: false,
  requiredOverlays: ['VideoModal'],
  icon: 'gallery',
  tags: ['portfolio', 'projects', 'gallery', 'horizontal'],
  component: false, // Factory function
  ownedFields: ['layout', 'className'],

  settings: {},
})
