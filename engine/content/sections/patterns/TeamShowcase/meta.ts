/**
 * TeamShowcase section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import type { TeamShowcaseProps } from './types'

export const meta = defineSectionMeta<TeamShowcaseProps>({
  id: 'TeamShowcase',
  name: 'Team Showcase',
  description: 'Fullscreen video showcase with stacked selectable member names',
  category: 'section',
  sectionCategory: 'team',
  unique: false,
  icon: 'users',
  tags: ['gallery', 'video', 'members', 'portfolio', 'showcase', 'fullscreen'],
  component: false, // Factory function
  ownedFields: ['layout', 'className'],

  settings: {
    members: {
      type: 'custom',
      label: 'Members',
      default: [],
      description: 'Array of member items with name, video, etc.',
      validation: { required: true },
      group: 'Content',
    },
    labelText: {
      type: 'text',
      label: 'Label Text',
      default: '',
      description: 'Prefix text displayed above member names (e.g., "We are")',
      validation: { maxLength: 100 },
      group: 'Content',
    },
    inactiveOpacity: {
      type: 'number',
      label: 'Inactive Opacity',
      default: 0.2,
      description: 'Opacity for non-selected member names (0-1)',
      min: 0,
      max: 1,
      group: 'Style',
    },
    backgroundColor: {
      type: 'text',
      label: 'Background Color',
      default: '',
      description: 'Section background color',
      validation: { maxLength: 100 },
      group: 'Style',
    },
  },
})
