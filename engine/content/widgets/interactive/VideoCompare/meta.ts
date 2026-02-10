import { defineMeta } from '../../../../schema/meta'
import type { VideoCompareProps } from './types'

export const meta = defineMeta<VideoCompareProps>({
  id: 'VideoCompare',
  name: 'Video Compare',
  description: 'Before/after video comparison with draggable divider',
  category: 'interactive',
  icon: 'compare',
  tags: ['video', 'compare', 'before-after', 'slider'],
  component: true, // React component

  settings: {
    beforeSrc: {
      type: 'video',
      label: 'Before Video',
      default: '',
      description: 'Video source for "before" state',
      validation: { required: true },
      bindable: true,
    },
    afterSrc: {
      type: 'video',
      label: 'After Video',
      default: '',
      description: 'Video source for "after" state',
      validation: { required: true },
      bindable: true,
    },
    beforeLabel: {
      type: 'text',
      label: 'Before Label',
      default: '',
      description: 'Label for before video (optional)',
      validation: { maxLength: 100 },
      bindable: true,
    },
    afterLabel: {
      type: 'text',
      label: 'After Label',
      default: '',
      description: 'Label for after video (optional)',
      validation: { maxLength: 100 },
      bindable: true,
    },
    initialPosition: {
      type: 'number',
      label: 'Initial Position',
      default: 50,
      description: 'Initial divider position (0-100)',
      min: 0,
      max: 100,
    },
    aspectRatio: {
      type: 'text',
      label: 'Aspect Ratio',
      default: '16/9',
      description: 'Container aspect ratio',
      validation: { maxLength: 50 },
      advanced: true,
    },
  },
})
