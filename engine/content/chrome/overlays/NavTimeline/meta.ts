/**
 * NavTimeline widget metadata for platform UI.
 */

import { defineMeta } from '@/engine/schema/meta'
import type { NavTimelineProps } from './types'

export const meta = defineMeta<NavTimelineProps>({
  id: 'NavTimeline',
  name: 'Navigation Timeline',
  description: 'Vertical timeline showing scroll progress between sections',
  category: 'overlay',
  icon: 'timeline',
  tags: ['chrome', 'overlay', 'navigation', 'carousel', 'progress'],
  component: true,

  settings: {
    show: {
      type: 'toggle',
      label: 'Visible',
      default: true,
      description: 'Whether the timeline is visible',
    },
    position: {
      type: 'select',
      label: 'Position',
      default: 'center',
      description: 'Horizontal position on the screen',
      choices: [
        { value: 'center', label: 'Center' },
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
    },
    showArrows: {
      type: 'toggle',
      label: 'Show Arrows',
      default: true,
      description: 'Display navigation arrows at top and bottom',
    },
    autohide: {
      type: 'toggle',
      label: 'Auto-hide',
      default: false,
      description: 'Fade out after inactivity',
    },
    autohideDelay: {
      type: 'number',
      label: 'Auto-hide Delay',
      default: 2000,
      description: 'Milliseconds before fading out',
      min: 500,
      max: 10000,
    },
    alignment: {
      type: 'select',
      label: 'Label Alignment',
      default: 'left',
      description: 'Which side of the line labels appear on',
      choices: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
    },
    showTopArrow: {
      type: 'toggle',
      label: 'Show Top Arrow',
      default: true,
      description: 'Show arrow at top (typically hidden on first section)',
    },
    currentColor: {
      type: 'color',
      label: 'Current Section Color',
      default: '#ffffff',
      description: 'Color for current section elements',
    },
    nextColor: {
      type: 'color',
      label: 'Next Section Color',
      default: '#ffffff',
      description: 'Color for next section elements',
    },
  },
})
