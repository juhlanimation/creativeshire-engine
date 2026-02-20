/**
 * Hero section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import { textScaleSetting } from '../../../../schema/settings-helpers'
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
    introText: {
      type: 'text',
      label: 'Intro Text',
      default: '',
      description: 'Introduction text (e.g., "I\'m Bo Juhl")',
      validation: { maxLength: 100 },
      group: 'Content',
    },
    roles: {
      type: 'custom',
      label: 'Role Titles',
      default: [],
      description: 'Array of role titles to display',
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

    // Typography
    introScale: textScaleSetting('Intro Text Scale', 'body'),
    roleTitleScale: textScaleSetting('Role Title Scale', 'display'),
    scrollIndicatorScale: textScaleSetting('Scroll Indicator Scale', 'small'),
  },
})
