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
    videoBackground: {
      type: 'color',
      label: 'Video Frame Color',
      default: '',
      description: 'Background color for the container around the video',
      group: 'Style',
      bindable: true,
    },
    contentBackground: {
      type: 'color',
      label: 'Content Area Background',
      default: '',
      description: 'Background for the content zone behind the video frame',
      group: 'Style',
      bindable: true,
    },
    descriptionColor: {
      type: 'color',
      label: 'Description Text Color',
      default: '',
      description: 'Override color for description text',
      group: 'Style',
      bindable: true,
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
    descriptionScale: textScaleSetting('Description Scale', 'body'),
  },
})
