/**
 * VideoPlayer interactive widget metadata for platform UI.
 */

import { defineMeta } from '@/creativeshire/schema/meta'
import type { VideoPlayerProps } from './types'

export const meta = defineMeta<VideoPlayerProps>({
  id: 'VideoPlayer',
  name: 'Video Player',
  description: 'Full-featured video player with controls, scrubber, and fullscreen',
  category: 'interactive',
  icon: 'video-player',
  tags: ['media', 'video', 'player', 'controls'],
  component: true,

  settings: {
    src: {
      type: 'video',
      label: 'Video Source',
      default: '',
      description: 'Video file URL',
      validation: { required: true },
    },
    poster: {
      type: 'image',
      label: 'Poster Image',
      default: '',
      description: 'Shown before video starts playing',
    },
    autoPlay: {
      type: 'toggle',
      label: 'Auto Play',
      default: true,
      description: 'Start playback automatically',
    },
    startTime: {
      type: 'number',
      label: 'Start Time',
      default: 0,
      description: 'Start playback at this time (seconds)',
      min: 0,
      step: 1,
      advanced: true,
    },
  },
})
