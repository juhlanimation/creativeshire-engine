/**
 * ProjectShowcase section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import { textScaleSetting } from '../../../../schema/settings-helpers'
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
      default: true,
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
      default: 'dark',
      choices: [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
      ],
      group: 'Style',
    },

    // Typography
    studioScale: textScaleSetting('Studio Scale', 'small'),
    roleScale: textScaleSetting('Role Scale', 'small'),
  },
})
