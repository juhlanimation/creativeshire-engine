/**
 * ProjectShowcase section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import type { ProjectShowcaseProps } from './types'

export const meta = defineSectionMeta<ProjectShowcaseProps>({
  id: 'ProjectShowcase',
  name: 'Project Showcase',
  description: 'Single project display with video and metadata',
  category: 'section',
  sectionCategory: 'project',
  unique: false,
  icon: 'video',
  tags: ['project', 'video', 'showcase', 'single'],
  component: false,
  ownedFields: ['layout', 'className'],

  settings: {
    logo: {
      type: 'custom',
      label: 'Logo',
      default: { src: '', alt: '' },
      description: 'Project logo',
      group: 'Header',
    },
    studio: {
      type: 'text',
      label: 'Studio',
      default: '',
      description: 'Production studio name',
      validation: { maxLength: 100 },
      group: 'Header',
      bindable: true,
    },
    role: {
      type: 'text',
      label: 'Role',
      default: '',
      description: 'Your role on the project',
      validation: { maxLength: 100 },
      group: 'Header',
      bindable: true,
    },
    videoSrc: {
      type: 'video',
      label: 'Video',
      default: '',
      description: 'Main video source',
      validation: { required: true },
      group: 'Content',
      bindable: true,
    },
    videoPoster: {
      type: 'image',
      label: 'Poster',
      default: '',
      description: 'Video poster image',
      group: 'Content',
    },
    videoBorder: {
      type: 'toggle',
      label: 'Show Border',
      default: false,
      description: 'Show border around video',
      group: 'Style',
    },
    shots: {
      type: 'custom',
      label: 'Shot Numbers',
      default: [],
      description: 'Shot numbers for navigation (optional)',
      group: 'Content',
    },
    backgroundColor: {
      type: 'color',
      label: 'Background',
      default: '#FAF6ED',
      group: 'Style',
    },
    textColor: {
      type: 'select',
      label: 'Text Color',
      default: 'dark',
      choices: [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' }
      ],
      group: 'Style',
    },
    email: {
      type: 'text',
      label: 'Email',
      default: '',
      validation: { required: true, maxLength: 320, pattern: '^[^@]+@[^@]+\\.[^@]+$', message: 'Please enter a valid email address' },
      group: 'Contact',
      bindable: true,
    },
  },
})
