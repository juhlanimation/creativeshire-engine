/**
 * ProjectTabs section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import type { ProjectTabsProps } from './types'

export const meta = defineSectionMeta<ProjectTabsProps>({
  id: 'ProjectTabs',
  name: 'Project Tabs',
  description: 'Tabbed interface for multiple project galleries',
  category: 'section',
  sectionCategory: 'project',
  unique: false,
  icon: 'tabs',
  tags: ['project', 'tabs', 'gallery', 'multi-project'],
  component: false,
  ownedFields: ['layout', 'className'],

  settings: {
    defaultTab: {
      type: 'text',
      label: 'Default Tab',
      default: '',
      description: 'ID of initially active tab',
      validation: { maxLength: 100 },
      group: 'Layout',
    },
  },
})
