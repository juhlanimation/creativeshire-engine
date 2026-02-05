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

  settings: {
    logo: {
      type: 'custom',
      label: 'Logo',
      default: { src: '', alt: '' },
      group: 'Header',
    },
    projects: {
      type: 'custom',
      label: 'Projects',
      default: [],
      description: 'Gallery projects with thumbnails and videos',
      validation: { required: true },
      group: 'Content',
      bindable: true,
    },
    defaultActiveIndex: {
      type: 'number',
      label: 'Default Active',
      default: 0,
      description: 'Initially selected project index',
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
