/**
 * Hero section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import type { HeroVideoProps } from './types'

export const meta = defineSectionMeta<HeroVideoProps>({
  id: 'HeroVideo',
  name: 'Hero Video',
  description: 'Full viewport hero with video background and bottom-aligned role titles',
  category: 'section',
  sectionCategory: 'hero',
  unique: true,
  icon: 'hero',
  tags: ['hero', 'landing', 'video', 'fullscreen'],
  component: false, // Factory function
  ownedFields: ['layout', 'className'],

  settings: {
    loopStartTime: {
      type: 'number',
      label: 'Loop Start Time',
      default: 0,
      description: 'Custom loop point for video (seconds to restart from)',
      min: 0,
      max: 3600,
      advanced: true,
    },
    introVideo: {
      type: 'toggle',
      label: 'Intro Video',
      default: false,
      description: 'Mark video for intro timing system, gate text with --intro-complete',
      advanced: true,
    },

    // Layout
    bottomOffset: {
      type: 'number',
      label: 'Bottom Offset',
      default: 12,
      description: 'Content distance from bottom edge (% of viewport height)',
      min: 0,
      max: 50,
      group: 'Layout',
    },
  },
})
