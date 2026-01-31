/**
 * Video interactive widget metadata for platform UI.
 */

import { defineMeta } from '@/creativeshire/schema/meta'
import type { VideoProps } from './types'

export const meta = defineMeta<VideoProps>({
  id: 'Video',
  name: 'Video',
  description: 'Video with hover-play, autoplay, and modal integration modes',
  category: 'interactive',
  icon: 'video',
  tags: ['media', 'video', 'interactive', 'modal'],
  component: true,

  settings: {
    src: {
      type: 'video',
      label: 'Video Source',
      default: '',
      description: 'Video file URL (hover/preview)',
      validation: { required: true },
    },
    poster: {
      type: 'image',
      label: 'Poster Image',
      default: '',
      description: 'Shown before video loads or when not hovering',
    },
    alt: {
      type: 'text',
      label: 'Alt Text',
      default: '',
      description: 'Accessibility description for poster',
    },
    hoverPlay: {
      type: 'toggle',
      label: 'Hover Play',
      default: false,
      description: 'Play on hover, show poster otherwise (thumbnail mode)',
    },
    autoplay: {
      type: 'toggle',
      label: 'Autoplay',
      default: true,
      description: 'Auto-play video (ignored when Hover Play is enabled)',
      condition: 'hoverPlay === false',
    },
    loop: {
      type: 'toggle',
      label: 'Loop',
      default: true,
      description: 'Loop video playback',
    },
    muted: {
      type: 'toggle',
      label: 'Muted',
      default: true,
      description: 'Mute video audio',
    },
    objectFit: {
      type: 'select',
      label: 'Object Fit',
      default: 'cover',
      description: 'How video fits its container',
      choices: [
        { value: 'cover', label: 'Cover' },
        { value: 'contain', label: 'Contain' },
        { value: 'fill', label: 'Fill' },
      ],
    },
    aspectRatio: {
      type: 'select',
      label: 'Aspect Ratio',
      default: '',
      description: 'Container aspect ratio (for hover-play mode)',
      choices: [
        { value: '', label: 'Auto' },
        { value: '16/9', label: 'Widescreen (16:9)' },
        { value: '4/3', label: 'Standard (4:3)' },
        { value: '1/1', label: 'Square (1:1)' },
        { value: '9/16', label: 'Portrait (9:16)' },
      ],
      advanced: true,
    },
    background: {
      type: 'toggle',
      label: 'Background Mode',
      default: false,
      description: 'Absolute positioning for background videos',
      advanced: true,
    },
    videoUrl: {
      type: 'video',
      label: 'Modal Video URL',
      default: '',
      description: 'Full-length video for modal playback. Use with on: { click: "open-video-modal" }',
      group: 'Modal',
    },
  },
})
