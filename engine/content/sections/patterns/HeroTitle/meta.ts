/**
 * Hero Title section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import { textScaleSetting, textSizeMultiplierSetting } from '../../../../schema/settings-helpers'
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
    title: {
      type: 'text',
      label: 'Title',
      default: '',
      description: 'Large centered title',
      validation: { maxLength: 200 },
      group: 'Content',
    },
    tagline: {
      type: 'text',
      label: 'Tagline',
      default: '',
      description: 'Subtitle below centered title',
      validation: { maxLength: 200 },
      group: 'Content',
    },
    scrollIndicatorText: {
      type: 'text',
      label: 'Scroll Indicator',
      default: '(SCROLL)',
      description: 'Text for scroll indicator',
      validation: { maxLength: 100 },
      group: 'Content',
    },
    videoSrc: {
      type: 'video',
      label: 'Background Video',
      default: '',
      description: 'Background video source URL',
      validation: { required: true },
      group: 'Media',
    },
    videoPoster: {
      type: 'image',
      label: 'Video Poster',
      default: '',
      description: 'Fallback image before video loads',
      group: 'Media',
    },
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
    titleScale: textScaleSetting('Title Scale', 'display'),
    titleSizeMultiplier: textSizeMultiplierSetting('Title Size', 4),
    taglineScale: textScaleSetting('Tagline Scale', 'h3'),
    scrollIndicatorScale: textScaleSetting('Scroll Indicator Scale', 'small'),
  },
})
