/**
 * ProjectVideoGrid section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import type { ProjectVideoGridProps } from './types'

export const meta = defineSectionMeta<ProjectVideoGridProps>({
  id: 'ProjectVideoGrid',
  name: 'Project Video Grid',
  description: 'Mixed aspect ratio video grid for showcasing multiple clips',
  category: 'section',
  sectionCategory: 'project',
  unique: false,
  icon: 'grid',
  tags: ['project', 'video', 'grid', 'gallery'],
  component: false,
  ownedFields: ['layout', 'className'],

  settings: {
    logo: {
      type: 'custom',
      label: 'Logo',
      default: { src: '', alt: '' },
      description: 'Project/client logo',
      group: 'Header',
    },
    videos: {
      type: 'custom',
      label: 'Videos',
      default: [],
      description: 'Videos with aspect ratios and column assignments',
      validation: { required: true },
      group: 'Content',
      bindable: true,
    },
    hoverPlay: {
      type: 'toggle',
      label: 'Hover to Play',
      default: true,
      description: 'Play videos on hover',
      group: 'Behavior',
    },
  },
})
