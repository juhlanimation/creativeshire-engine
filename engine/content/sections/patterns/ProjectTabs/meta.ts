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

  settings: {
    tabs: {
      type: 'custom',
      label: 'Tabs',
      default: [],
      description: 'Tab configurations with projects',
      validation: { required: true },
      group: 'Content',
      bindable: true,
    },
    defaultTab: {
      type: 'text',
      label: 'Default Tab',
      default: '',
      description: 'ID of initially active tab',
      group: 'Content',
    },
    externalLink: {
      type: 'custom',
      label: 'External Link',
      default: null,
      description: 'Optional external link in tab bar (e.g., Instagram)',
      group: 'Content',
    },
    backgroundColor: {
      type: 'color',
      label: 'Background',
      default: '#000000',
      group: 'Style',
    },
    email: {
      type: 'text',
      label: 'Email',
      default: '',
      validation: { required: true },
      group: 'Contact',
      bindable: true,
    },
  },
})
