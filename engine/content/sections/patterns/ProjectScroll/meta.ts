import { defineSectionMeta } from '../../../../schema/meta'
import type { ProjectScrollProps } from './types'

export const meta = defineSectionMeta<ProjectScrollProps>({
  id: 'ProjectScroll',
  name: 'Project Scroll',
  description: 'Sticky sidebar with project index and scrollable project cards.',
  category: 'section',
  sectionCategory: 'project',
  unique: false,
  icon: 'projects',
  tags: ['projects', 'scroll', 'sidebar', 'portfolio'],
  component: false,
  ownedFields: ['layout', 'className'],
  settings: {
    sidebarWidth: {
      type: 'select',
      label: 'Sidebar Width',
      default: 'default',
      choices: [
        { value: 'narrow', label: 'Narrow (30%)' },
        { value: 'default', label: 'Default (38%)' },
        { value: 'wide', label: 'Wide (45%)' },
      ],
    },
    cardBorder: {
      type: 'toggle',
      label: 'Card Borders',
      default: true,
      group: 'Style',
    },
    fadeOverlay: {
      type: 'toggle',
      label: 'Fade-to-Black Overlay',
      default: true,
      advanced: true,
    },
    fadeStart: {
      type: 'number',
      label: 'Fade Start Point',
      default: 0.5,
      min: 0,
      max: 1,
      step: 0.1,
      hidden: true,
    },
  },
})
