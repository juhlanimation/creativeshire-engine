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
    logo: {
      type: 'custom',
      label: 'Logo',
      default: { src: '', alt: '' },
      description: 'Project/client logo configuration',
      group: 'Header',
    },
    videos: {
      type: 'custom',
      label: 'Videos',
      default: [],
      description: 'Videos for expandable gallery',
      validation: { required: true },
      group: 'Content',
      bindable: true,
    },

    // Footer
    socialLinks: {
      type: 'custom',
      label: 'Social Links',
      default: [],
      description: 'Social platform links for footer bar',
      group: 'Footer',
      bindable: true,
    },
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
