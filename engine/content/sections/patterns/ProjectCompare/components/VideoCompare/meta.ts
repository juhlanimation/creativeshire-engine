import { defineMeta } from '../../../../../../schema/meta'
import type { VideoCompareProps } from './types'

export const meta = defineMeta<VideoCompareProps>({
  id: 'VideoCompare',
  name: 'Video Compare',
  description: 'Before/after video comparison with draggable divider',
  category: 'interactive',
  icon: 'compare',
  tags: ['video', 'compare', 'before-after', 'slider'],
  component: true, // React component

  // Content settings (beforeSrc, afterSrc, beforeLabel, afterLabel) are section-owned.
  // This widget is purely structural — the section factory injects content via props.
  settings: {
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
