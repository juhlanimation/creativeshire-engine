/**
 * ProjectCard pattern metadata for platform UI.
 */

import { defineMeta } from '../../../../../../schema/meta'
import type { ProjectCardConfig } from './types'

export const meta = defineMeta<ProjectCardConfig>({
  id: 'ProjectCard',
  name: 'Project Card',
  description: 'Featured project display with thumbnail, video, and metadata',
  category: 'pattern',
  icon: 'project',
  tags: ['portfolio', 'project', 'card', 'media'],
  component: false, // Factory function, not React component
  defaultDecorators: [
    { id: 'video-modal' },
    { id: 'cursor-label', params: { label: 'WATCH' } },
    { id: 'hover-scale' },
  ],

  settings: {
    thumbnailSrc: {
      type: 'image',
      label: 'Thumbnail',
      default: '',
      description: 'Thumbnail image source',
      validation: { required: true },
      bindable: true,
    },
    thumbnailAlt: {
      type: 'text',
      label: 'Thumbnail Alt',
      default: '',
      description: 'Accessibility description for thumbnail',
      validation: { required: true, maxLength: 200 },
      bindable: true,
    },
    videoSrc: {
      type: 'video',
      label: 'Hover Video',
      default: '',
      description: 'Video for hover playback (optional)',
      bindable: true,
    },
    videoUrl: {
      type: 'video',
      label: 'Modal Video',
      default: '',
      description: 'Full-length video URL for modal playback',
      bindable: true,
    },
    client: {
      type: 'text',
      label: 'Client',
      default: '',
      description: 'Client name',
      validation: { required: true, maxLength: 100 },
      bindable: true,
    },
    studio: {
      type: 'text',
      label: 'Studio',
      default: '',
      description: 'Studio name',
      validation: { required: true, maxLength: 100 },
      bindable: true,
    },
    title: {
      type: 'text',
      label: 'Title',
      default: '',
      description: 'Project title',
      validation: { required: true, maxLength: 100 },
      bindable: true,
    },
    description: {
      type: 'textarea',
      label: 'Description',
      default: '',
      description: 'Project description',
      validation: { required: true, maxLength: 1000 },
      bindable: true,
    },
    year: {
      type: 'text',
      label: 'Year',
      default: '',
      description: 'Project year (e.g., 2024)',
      validation: { maxLength: 20 },
      advanced: true,
      bindable: true,
    },
    role: {
      type: 'text',
      label: 'Role',
      default: '',
      description: 'Role in project (e.g., Director)',
      validation: { maxLength: 50 },
      advanced: true,
      bindable: true,
    },
    reversed: {
      type: 'toggle',
      label: 'Reverse Layout',
      default: false,
      description: 'Content left, thumbnail right',
      bindable: true,
    },
  },
})
