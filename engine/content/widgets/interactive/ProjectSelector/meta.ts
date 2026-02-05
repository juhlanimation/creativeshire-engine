/**
 * ProjectSelector interactive widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { ProjectSelectorProps } from './types'

export const meta = defineMeta<ProjectSelectorProps>({
  id: 'ProjectSelector',
  name: 'Project Selector',
  description: 'Thumbnail strip for selecting active project in showcases',
  category: 'interactive',
  icon: 'gallery',
  tags: ['project', 'gallery', 'selector', 'thumbnail'],
  component: true,

  settings: {
    projects: {
      type: 'custom',
      label: 'Projects',
      default: [],
      description: 'Array of project items',
      validation: { required: true },
      bindable: true,
    },
    activeIndex: {
      type: 'number',
      label: 'Active Index',
      default: 0,
      description: 'Currently selected project index',
    },
    orientation: {
      type: 'select',
      label: 'Orientation',
      default: 'horizontal',
      choices: [
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'vertical', label: 'Vertical' },
      ],
      description: 'Layout direction',
    },
    showInfo: {
      type: 'toggle',
      label: 'Show Info',
      default: true,
      description: 'Show info card on hover',
    },
  },
})
