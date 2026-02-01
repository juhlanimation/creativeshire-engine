/**
 * OtherProjects section pattern metadata for platform UI.
 */

import { defineMeta } from '@/engine/schema/meta'
import type { OtherProjectsProps } from './types'

export const meta = defineMeta<OtherProjectsProps>({
  id: 'OtherProjects',
  name: 'Other Projects Section',
  description: 'Horizontal thumbnail gallery (hidden on mobile)',
  category: 'section',
  icon: 'gallery',
  tags: ['portfolio', 'projects', 'gallery', 'horizontal'],
  component: false, // Factory function

  settings: {
    heading: {
      type: 'text',
      label: 'Section Heading',
      default: 'Other Projects',
      description: 'Section heading text',
    },
    yearRange: {
      type: 'text',
      label: 'Year Range',
      default: '',
      description: 'Year range label (e.g., "2020-2024")',
    },
    projects: {
      type: 'custom',
      label: 'Projects',
      default: [],
      description: 'Array of project data for gallery',
    },
  },
})
