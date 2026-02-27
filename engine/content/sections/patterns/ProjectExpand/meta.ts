/**
 * ProjectExpand section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import type { ProjectExpandProps } from './types'

export const meta = defineSectionMeta<ProjectExpandProps>({
  id: 'ProjectExpand',
  name: 'Project Expand Gallery',
  description: 'Expandable video thumbnail gallery (Riot Games style)',
  category: 'section',
  sectionCategory: 'project',
  unique: false,
  requiredOverlays: ['VideoModal'],
  icon: 'expand',
  tags: ['project', 'video', 'gallery', 'expand', 'thumbnail', 'portfolio'],
  component: false, // Factory function
  ownedFields: ['layout', 'className'],

  settings: {
    textColor: {
      type: 'select',
      label: 'Text Color',
      default: 'light',
      choices: [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
      ],
      group: 'Style',
    },
  },
})
