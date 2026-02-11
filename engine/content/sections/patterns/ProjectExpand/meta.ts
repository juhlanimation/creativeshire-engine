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
  icon: 'expand',
  tags: ['project', 'video', 'gallery', 'expand', 'thumbnail', 'portfolio'],
  component: false, // Factory function
  ownedFields: ['layout', 'behaviour', 'behaviourOptions', 'className'],

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
    backgroundColor: {
      type: 'color',
      label: 'Background Color',
      default: '#0B0A0A',
      description: 'Section background color',
      group: 'Style',
    },
    videoBackgroundColor: {
      type: 'color',
      label: 'Video Background',
      default: '#1F1F1F',
      description: 'Gallery area background color',
      group: 'Style',
    },
    email: {
      type: 'text',
      label: 'Contact Email',
      default: '',
      description: 'Email for contact bar',
      validation: { required: true, maxLength: 320, pattern: '^[^@]+@[^@]+\\.[^@]+$', message: 'Please enter a valid email address' },
      group: 'Contact',
      bindable: true,
    },
    contactPrompt: {
      type: 'text',
      label: 'Contact Prompt',
      default: '',
      description: 'Optional prompt text for contact bar',
      validation: { maxLength: 100 },
      group: 'Contact',
    },
  },
})
