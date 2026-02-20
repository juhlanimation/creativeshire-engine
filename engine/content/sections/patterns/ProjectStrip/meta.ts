/**
 * OtherProjects section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import { textScaleSetting } from '../../../../schema/settings-helpers'
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

  settings: {
    heading: {
      type: 'text',
      label: 'Section Heading',
      default: 'Other Projects',
      description: 'Section heading text',
      validation: { maxLength: 100 },
    },
    yearRange: {
      type: 'text',
      label: 'Year Range',
      default: '',
      description: 'Year range label (e.g., "2020-2024")',
      validation: { maxLength: 20 },
    },
    projects: {
      type: 'custom',
      label: 'Projects',
      default: [],
      description: 'Array of project data for gallery',
    },

    // Typography
    headingScale: textScaleSetting('Heading Scale', 'small'),
    yearRangeScale: textScaleSetting('Year Range Scale', 'small'),
  },
})
