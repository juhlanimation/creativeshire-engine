/**
 * ProjectGallery section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import type { ProjectGalleryProps } from './types'

export const meta = defineSectionMeta<ProjectGalleryProps>({
  id: 'ProjectGallery',
  name: 'Project Gallery',
  description: 'Main video with selectable project thumbnails',
  category: 'section',
  sectionCategory: 'gallery',
  unique: false,
  icon: 'gallery',
  tags: ['project', 'gallery', 'video', 'selector', 'thumbnails'],
  component: false,
  ownedFields: ['layout', 'className'],

  settings: {
    defaultActiveIndex: {
      type: 'number',
      label: 'Default Active',
      default: 0,
      description: 'Initially selected project index',
      min: 0,
      max: 100,
      group: 'Content',
    },
    backgroundColor: {
      type: 'color',
      label: 'Background',
      default: '#C03540',
      group: 'Style',
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
    contentBorder: {
      type: 'text',
      label: 'Content Border',
      default: '',
      description: 'CSS border around the content canvas (e.g. "2px solid #C03540")',
      group: 'Style',
      validation: { maxLength: 100 },
    },
  },
})
