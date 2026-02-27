/**
 * ProjectShowcase section pattern metadata for platform UI.
 *
 * Content fields (logo, studio, role, videoSrc, etc.) live in content.ts.
 * Typography scales are factory decisions — not exposed as settings.
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
    videoBorder: {
      type: 'toggle',
      label: 'Show Border',
      default: true,
      description: 'Show border around video',
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
