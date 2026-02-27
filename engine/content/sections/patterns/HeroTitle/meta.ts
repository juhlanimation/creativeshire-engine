/**
 * Hero Title section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import { textSizeMultiplierSetting } from '../../../../schema/settings-helpers'
import type { HeroTitleProps } from './types'

export const meta = defineSectionMeta<HeroTitleProps>({
  id: 'HeroTitle',
  name: 'Hero Title',
  description: 'Full viewport hero with video background and centered title + tagline',
  category: 'section',
  sectionCategory: 'hero',
  unique: true,
  icon: 'hero',
  tags: ['hero', 'landing', 'video', 'fullscreen', 'title'],
  component: false,
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

    // Typography
    titleSizeMultiplier: textSizeMultiplierSetting('Title Size', 4, { advanced: true }),
  },
})
