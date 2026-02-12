/**
 * Hero section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import type { HeroProps } from './types'

export const meta = defineSectionMeta<HeroProps>({
  id: 'Hero',
  name: 'Hero Section',
  description: 'Full viewport hero with video background and role titles',
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
      validation: { required: true, maxLength: 100 },
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
  },
})
