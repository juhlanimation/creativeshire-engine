/**
 * Hero section pattern metadata for platform UI.
 */

import { defineMeta } from '@/creativeshire/schema/meta'
import type { HeroProps } from './types'

export const meta = defineMeta<HeroProps>({
  id: 'Hero',
  name: 'Hero Section',
  description: 'Full viewport hero with video background and role titles',
  category: 'section',
  icon: 'hero',
  tags: ['hero', 'landing', 'video', 'fullscreen'],
  component: false, // Factory function

  settings: {
    introText: {
      type: 'text',
      label: 'Intro Text',
      default: '',
      description: 'Introduction text (e.g., "I\'m Bo Juhl")',
      validation: { required: true },
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
