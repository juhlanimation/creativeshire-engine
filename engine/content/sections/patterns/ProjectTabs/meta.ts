/**
 * ProjectTabs section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import { textScaleSetting } from '../../../../schema/settings-helpers'
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
      validation: { maxLength: 100 },
      group: 'Content',
    },
    externalLink: {
      type: 'custom',
      label: 'External Link',
      default: null,
      description: 'Optional external link in tab bar (e.g., Instagram)',
      group: 'Content',
    },

    // Typography
    titleScale: textScaleSetting('Title Scale', 'h3'),
    clientScale: textScaleSetting('Client Scale', 'body'),
    studioScale: textScaleSetting('Studio Scale', 'body'),
    roleScale: textScaleSetting('Role Scale', 'body'),
  },
})
