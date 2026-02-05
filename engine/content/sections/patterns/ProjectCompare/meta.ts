import { defineSectionMeta } from '../../../../schema/meta'
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
      group: 'Content',
    },
    afterLabel: {
      type: 'text',
      label: 'After Label',
      default: '',
      description: 'Label for after video',
      group: 'Content',
    },
    description: {
      type: 'textarea',
      label: 'Description',
      default: '',
      description: 'Project description text',
      group: 'Content',
      bindable: true,
    },
    backgroundColor: {
      type: 'color',
      label: 'Background',
      default: '#FDF9F0',
      group: 'Style',
    },
    videoBackgroundColor: {
      type: 'color',
      label: 'Video Background',
      default: '#3B3D2E',
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
