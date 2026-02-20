/**
 * StackVideoShowcase interactive widget metadata for platform UI.
 */

import { defineMeta } from '../../../../../../schema/meta'
import type { StackVideoShowcaseProps } from './types'

export const meta = defineMeta<StackVideoShowcaseProps>({
  id: 'StackVideoShowcase',
  name: 'Stack Video Showcase',
  description: 'Fullscreen video showcase triggered by hovering or scrolling through stacked names',
  category: 'interactive',
  icon: 'users',
  tags: ['video', 'interactive', 'showcase', 'stack'],
  component: true,

  // Content settings (labelText, inactiveOpacity) are section-owned.
  // This widget is purely structural — the section factory injects content via props.
  settings: {
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
    actionPrefix: {
      type: 'text',
      label: 'Action Prefix',
      default: '',
      description: 'Prefix for action dispatching (e.g., section id)',
      validation: { maxLength: 100 },
      advanced: true,
    },
  },
})
