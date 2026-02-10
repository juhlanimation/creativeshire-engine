/**
 * TeamShowcase interactive widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { TeamShowcaseProps } from './types'

export const meta = defineMeta<TeamShowcaseProps>({
  id: 'TeamShowcase',
  name: 'Team Showcase',
  description: 'Fullscreen video showcase triggered by hovering or scrolling through team member names',
  category: 'interactive',
  icon: 'users',
  tags: ['team', 'video', 'interactive', 'showcase'],
  component: true,

  settings: {
    members: {
      type: 'text',
      label: 'Members',
      default: '',
      description: 'Team members data (binding expression)',
      validation: { required: true, maxLength: 500 },
      bindable: true,
    },
    labelText: {
      type: 'text',
      label: 'Label Text',
      default: 'Vi er',
      description: 'Prefix text displayed above member names',
      validation: { maxLength: 100 },
      bindable: true,
    },
    inactiveOpacity: {
      type: 'number',
      label: 'Inactive Opacity',
      default: 0.2,
      description: 'Opacity for non-selected member names (0-1)',
      min: 0,
      max: 1,
      advanced: true,
    },
    videoTransitionMs: {
      type: 'number',
      label: 'Video Transition',
      default: 500,
      description: 'Video crossfade duration in milliseconds',
      min: 0,
      max: 2000,
      advanced: true,
    },
    nameTransitionMs: {
      type: 'number',
      label: 'Name Transition',
      default: 300,
      description: 'Name opacity transition duration in milliseconds',
      min: 0,
      max: 2000,
      advanced: true,
    },
  },
})
