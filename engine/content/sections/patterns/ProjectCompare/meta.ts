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
  ownedFields: ['layout', 'className'],

  settings: {
    videoBackground: {
      type: 'color',
      label: 'Video Frame Color',
      default: '',
      description: 'Background color for the container around the video',
      group: 'Style',
    },
    contentBackground: {
      type: 'color',
      label: 'Content Area Background',
      default: '',
      description: 'Background for the content zone behind the video frame',
      group: 'Style',
    },
    descriptionColor: {
      type: 'color',
      label: 'Description Text Color',
      default: '',
      description: 'Override color for description text',
      group: 'Style',
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
  },
})
