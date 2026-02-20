import { defineSectionMeta } from '../../../../schema/meta'
import { textScaleSetting } from '../../../../schema/settings-helpers'
import type { ProjectCompareProps } from './types'

export const meta = defineSectionMeta<ProjectCompareProps>({
  id: 'ProjectCompare',
  name: 'Project Compare',
  description: 'Before/after video comparison with draggable divider',
  category: 'section',
  sectionCategory: 'project',
  unique: false,
  icon: 'compare',
  tags: ['project', 'video', 'compare', 'before-after', 'breakdown'],
  component: false,
  ownedFields: ['layout', 'className'],

  settings: {
    logo: {
      type: 'custom',
      label: 'Logo',
      default: { src: '', alt: '' },
      group: 'Header',
    },
    beforeVideo: {
      type: 'video',
      label: 'Before Video',
      default: '',
      description: 'Process/breakdown video',
      validation: { required: true },
      group: 'Content',
      bindable: true,
    },
    afterVideo: {
      type: 'video',
      label: 'After Video',
      default: '',
      description: 'Final result video',
      validation: { required: true },
      group: 'Content',
      bindable: true,
    },
    beforeLabel: {
      type: 'text',
      label: 'Before Label',
      default: '',
      description: 'Label for before video',
      validation: { maxLength: 100 },
      group: 'Content',
    },
    afterLabel: {
      type: 'text',
      label: 'After Label',
      default: '',
      description: 'Label for after video',
      validation: { maxLength: 100 },
      group: 'Content',
    },
    description: {
      type: 'textarea',
      label: 'Description',
      default: '',
      description: 'Project description text',
      validation: { maxLength: 5000 },
      group: 'Content',
      bindable: true,
    },

    // Typography
    descriptionScale: textScaleSetting('Description Scale', 'body'),
  },
})
